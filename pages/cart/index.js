/**
 * 1 获取用户的收货地址
 *   1.1 绑定点击事件
 *   1.2 调用小程序内置api获取用户的收货地址wx.chooseAddress
 *   1.3 获取用户对小程序所授予获取地址的权限状态(scope)
 *       1.3.1 假设用户点击获取收货地址的提示框确定(authSetting.scope.address)，scope值为true，直接调用获取收货地址
 *       1.3.2 假设用户从来没有调用过收货地址的api，scope值为undefined，直接调用获取收货地址
 *       1.3.3 假设用户点击获取收货地址的提示框取消，scope值为false
 *             1.3.3.1 诱导用户自己打开授权设置页面(wx.openSetting)，当用户重新给予获取地址权限的时候
 *             1.3.3.2 获取收货地址
 *   1.4 把获取到的收货地址存入到本地存储中
 * 2 页面加载完毕
 *   2.1 获取本地存储中的地址数据，把数据设置给data中的一个变量
 * 3 onShow
 *   3.1 回到商品详情页面，第一次添加商品的时候，手动添加了属性(num=1;checked=true)
 *   3.2 获取缓存中的购物车数组
 *   3.2 把购物车数据填充到data中
 * 4 全选的实现
 *   4.1 onShow 获取缓存中的购物车数组
 *   4.2 根据购物车中的商品数据，所有的商品都被选中，checked = true，全选就被选中
 * 5 总价格和总数量
 *   5.1 需要商品被选中才去计算
 *   5.2 获取购物车数组
 *   5.3 遍历
 *   5.4 判断商品是否被选中，若选中，则 
 *       总价格 += 商品的单价 * 商品的数量
 *       总数量 += 商品的数量
 *   5.5 把计算后的价格和数量设置回data中即可
 * 6 商品的选中
 *   6.1 绑定change事件
 *   6.2 获取到被修改的商品对象
 *   6.3 商品对象的选中状态取反
 *   6.4 重新填回data中和缓存中
 *   6.5 重新计算全选、总价格、总数量
 * 7 全选和反选
 *   7.1 给全选复选框绑定change事件
 *   7.2 获取data中的全选变量allChecked
 *   7.3 直接取反allChecked = !allChecked
 *   7.4 遍历购物车数组，让里面商品选中状态跟随allChecked改变而改变
 *   7.5 把购物车数组和allChecked重新设置回data，把购物车重新设置回缓存中
 * 8 商品数量的编辑
 *   8.1 "+" "-"按钮绑定同一个点击事件，区分的关键是自定义一个属性
 *   8.2 传递被点击的商品id(goods_id)
 *   8.3 获取data中的购物车数组来获取需要被修改的商品对象
 *   8.4 当购物车的数量为1且用户点击"-"，弹窗提示(wx.showModal)，询问用户是否要删除
 *       8.4.1 确定，直接执行删除
 *       8.4.2 取消，什么都不做
 *   8.4 直接修改商品对象的数量num
 *   8.5 把cart数组重新设置回data中和缓存中this.setCart()
 * 9 点击结算
 *   9.1 判断有没有收货地址信息
 *   9.2 判断用户有没有选购商品
 *   9.3 经过以上的验证，跳转到支付页面
 */
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1、获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || [];
    // 计算全选
    // every：遍历数组方法，接收一个回调函数，如果每一个回调函数都返回true，那么every方法的返回值为true
    // 只要有一个回调函数返回了false，那么不再循环执行，直接返回false
    // 空数组调用every，返回值为true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    // let allChecked = true;
    // let totalPrice = 0;
    // let totalNum = 0;
    // cart.forEach(v => {
    //   if (v.checked) {
    //     totalPrice += v.num * v.goods_price;
    //     totalNum += v.num;
    //   } else {
    //     allChecked = false;
    //   }
    // })
    // // 判断数组是否为空
    // allChecked = cart.length != 0 ? allChecked : false;
    // // 2、给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
    this.setData({
      address
    });
    this.setCart(cart);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击收货地址
  async handleChooseAddress() {
    // 1、获取用户的当前设置
    // wx.getSetting({
    //   success: (result) => {
    //     // authSetting：用户授权结果  获取权限状态
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       // 获取用户收货地址
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1);
    //         },
    //       })
    //     } else {
    //       // 用户以前拒绝过授予权限，先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           // 可以调用收货地址代码
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   },
    // })

    try {
      // 1、获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2、判断权限状态
      if (scopeAddress === false) {
        // 3、先诱导用户打开授权页面
        await openSetting();
      }
      // 4、调用获取收货地址的api
      let address = await chooseAddress();
      // address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      // 5、存入到缓存中
      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error);
    }
  },

  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 把购物车数据重新设置回data中和缓存中
    this.setCart(cart);
  },

  // 设置购物车状态同时重新计算底部工具栏的数据(全选、总价格、总数量)
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    // 2、给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync('cart', cart);
  },

  // 商品全选功能
  handleItemAllCheck() {
    // 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 把修改后的值填充回data或缓存中
    this.setCart(cart);
  },

  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const {
      id,
      operation
    } = e.currentTarget.dataset;
    // console.log(id, operation);
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      // wx.showModal({
      //   title: '提示',
      //   content: '您是否要删除？',
      //   success: (res) => { // 注意这里要使用箭头函数，使this指向全局的window对象
      //     if (res.confirm) {
      //       // console.log('用户点击确定')
      //       cart.splice(index, 1);
      //       this.setCart(cart);
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
      const res = await showModal({
        content: "您是否要删除？"
      });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 修改数量
      cart[index].num += operation;
      // 设置回缓存和data中
      this.setCart(cart);
    }
  },

  // 点击结算
  async handlePay() {
    // 判断收货地址
    const {
      address,
      totalNum
    } = this.data;
    if (!address.userName) {
      await showToast({
        title: "您还没有选择收货地址！"
      });
      return;
    }
    // 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({
        title: "您还没有选购商品！"
      });
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})