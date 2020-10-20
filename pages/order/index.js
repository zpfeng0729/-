/**
 * 1 页面被打开的时候 onShow
 *   1.1 onShow不同于OnLoad，无法在形参上接收options参数
 *   1.2 判断缓存中有没有token，没有则跳转到授权页面，有则往下继续执行
 *   1.3 获取url上的参数type
 *   1.4 根据type来决定页面tab标题的数组元素哪个被激活选中
 *   1.4 根据type发送请求获取订单数据
 *   1.5 渲染页面
 * 2 点击不同的tab标题也需要重新发送请求来获取和渲染数据
 * 
 * 
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
    tabs: [{
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
    orders: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options参数只存在于onLoad里面，onShow里面取不到
    // console.log(options);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 小程序中有个页面栈(是一个数组)，每打开一个新页面都会在页面栈中推入一个当前页面，长度最大是10个页面
    // 获取页面栈数组
    const pages = getCurrentPages();
    // 页面栈数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 获取url上的type参数
    const {
      type
    } = currentPage.options;
    // 激活选中页面tab标题，当type = 1，index = 0，依次类推
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },

  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({
      url: "/my/orders/all",
      data: {
        type
      }
    });
    console.log(res);
    this.setData({
      // 还需要进行时间处理
      orders: res.data.message.orders.map(v => ({
        ...v,
        create_time_cn: (new Date(v.create_time * 1000).toLocaleString())
      }))
    })
  },

  // 根据标题索引来激活选中tab标题数组
  changeTitleByIndex(index) {
    // 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 赋值到data中
    this.setData({
      tabs
    });

  },

  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const {
      index
    } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求，当type = 1，index = 0，依次类推
    this.getOrders(index + 1);
  }
})