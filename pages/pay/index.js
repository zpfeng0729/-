/**
 * 1 页面加载的时候
 *   1.1 从缓存中获取购物车数据渲染到页面中，这些数据checked = true
 * 2 微信支付
 *   2.1 哪些人、哪些账号可以实现微信支付
 *       2.1.1 企业账号
 *       2.1.2 企业账号的小程序后台中必须给开发者添加上白名单(一个appid可以同时绑定多个开发者，这些开发者就可以共用这个appid和它的开发权限)
 * 3 支付按钮
 *   3.1 先判断缓存中有没有token
 *   3.2 没有跳转就到授权页面获取token
 *   3.3 有token。。。
 *   3.4 创建订单，获取订单编号
 *   3.5 已经完成了微信支付
 *   3.6 手动删除缓存中已经被选中了的商品
 *   3.7 将删除后的购物车数据填充回缓存中
 *   3.8 再跳转页面
 *   
 */
import {
  requestPayment,
  showToast
} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    // 总价格、总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    // 给data赋值
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击支付
  async handleOrderPay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      // 创建订单
      // 准备请求头参数
      // const header = {
      //   Authorization: token
      // };
      // 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.goods_number,
          goods_price: v.goods_price
        })
      });
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      // 准备发送请求创建订单，获取订单编号
      const res = await request({
        url: "/my/orders/create",
        method: "post",
        data: orderParams,
        // header
      });
      // 发起预支付接口
      const res1 = await request({
        url: "/my/orders/req_unifiedorder",
        method: "post",
        data: {
          order_number: res.data.message.order_number
        },
        // header
      });
      const {
        pay
      } = res1.data.message;
      // console.log({pay});
      // console.log(pay);
      // 发起微信支付
      await requestPayment(pay);
      // 查询后台订单状态
      const res3 = await request({
        url: "/my/orders/chkOrder",
        method: "post",
        data: {
          order_number: res.data.message.order_number
        },
        // header
      });
      await showToast({
        title: "支付成功"
      });
      // 手动删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart);
      // 支付成功后跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      await showToast({
        title: "支付失败"
      });
      console.log(error);
    }
  }

})