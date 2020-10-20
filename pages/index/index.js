// 引入用来发送请求的方法，注意：微信小程序一定要把路径补全
import {
  request
} from "../../request/index.js"
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []

  },
  // 页面开始加载就会触发
  onLoad: function (options) {
    // 发送异步请求获取轮播图数据
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     console.log(result)
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    // 优化：通过ES6的Promise
    // request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'
    // }).then(result => {
    //   this.setData({
    //     swiperList: result.data.message
    //   })
    // })
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();

  },

  // 获取轮播图数据
  getSwiperList() {
    request({
      // url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'
      url: '/home/swiperdata'
    }).then(result => {
      this.setData({
        swiperList: result.data.message
      })
    })
  },

  // 获取分类导航数据
  getCateList() {
    request({
      url: '/home/catitems'
    }).then(result => {
      this.setData({
        catesList: result.data.message
      })
    })
  },

  // 获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata'
    }).then(result => {
      this.setData({
        floorList: result.data.message
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});