/**
 * 1 发送请求获取数据
 * 2 点击轮播图，预览大图
 *   2.1 给轮播图绑定点击事件
 *   2.2 调用小程序API previewImage
 * 3 点击加入购物车
 *   3.1 先绑定点击事件
 *   3.2 获取缓存中的购物车数据(数组格式的)
 *   3.3 先判断当前的商品是否已经存在于购物车中
 *   3.4 已经存在，则修改商品数据，让购物车数量++，并重新把购物车数组填回缓存中
 *   3.5 不存在于购物车数组中，则直接给购物车数组添加一个新元素，并给新元素带上购买数量属性num，然后重新把购物车数组填回缓存中
 *   3.6 根据用户操作弹出一些提示
 * 4 商品收藏
 *   4.1 页面onShow的时候，加载缓存中的商品
 *   4.2 判断当前商品是不是被收藏(是，改变页面图标，否，什么也不做)
 *   4.3 点击商品收藏按钮的时候，判断商品是否存在缓存数组中
 *       4.3.1 已经存在，则把该商品删除
 *       4.3.2 不存在，则把该商品添加到收藏数组中，再存入到缓存中即可
 */

import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏过
    isCollect: false,
  },

  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow() {
    // 获取页面栈数组
    let pages = getCurrentPages();
    // 页面栈数组中索引最大的页面就是当前页面
    let currentPages = pages[pages.length - 1];
    console.log(currentPages);
    let options = currentPages.options;
    const {
      goods_id
    } = options;
    // console.log(goods_id); // 57441
    // console.log({goods_id}); // {goods_id: "57441"}
    this.getGoodsDetail(goods_id);

  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    });
    this.GoodsInfo = res.data.message;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: res.data.message.goods_name,
        goods_price: res.data.message.goods_price,
        // iphone部分手机不识别webp图片格式
        // 若由前端转换，需要确保后台存在此webp图片对应的jpg图片，例如1.webp => 1.jpg
        goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, ".jpg"),
        pics: res.data.message.pics
      },
      isCollect
    })
  },

  // 点击轮播图放大预览
  handlePreviewImage(e) {
    // 1、先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    console.log(urls);
    // 2、接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    });
  },

  // 点击加入购物车
  handleCartAdd() {
    // 1、获取缓存中的购物车数据(数组格式的)
    let cart = wx.getStorageSync("cart") || [];
    // 2、判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 3、不存在，第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 4、已经存在购物车数据，执行num++
      cart[index].num++;
    }
    // 5、把购物车重新添回缓存中
    wx.setStorageSync("cart", cart);
    // 6、弹窗提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      // mask: true可以防止用户手抖疯狂点击按钮
      mask: true,
    });
  },

  // 点击商品收藏图标
  handleCollect() {
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 当index != -1表示商品已经收藏过
    if (index !== -1) {
      // 能找到该商品，说明该商品已经收藏过，则在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 把数组存入到缓存中
    wx.setStorageSync('collect', collect);
    // 修改data
    this.setData({
      isCollect
    });
  }
})