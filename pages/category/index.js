// 引入用来发送请求的方法，注意：微信小程序一定要把路径补全
import {
  request
} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧菜单索引
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 1、先判断一下本地存储中有没有旧的数据
     * {time: Date.now(), data: [...]}
     * 2、如果没有旧的数据，直接发送请求
     * 3、如果有旧的数据，并且旧的数据没有过期，就使用本地存储中旧数据即可
     * 
     * 
     * web中的本地存储与小程序中的本地存储的区别
     * 1）写代码的方式不一样
     * web：localStorage.setItem("key", "value")  localStorage.getItem("key")
     * 小程序：wx.setStorageSync("key", "value")  wx.getStorageSync("key");
     * 2）存的时候有没有做类型转换
     * web：不管存入的是什么类型的数据，最终都会先调用一下 toString() 方法，把数据变成字符串再存入进去
     * 小程序：不存在类型转换这个操作，存什么类型的数据进去，获取的时候就是什么类型
     * 
     */
    // this.getCates();
    // 1、先获取本地存储中的数据(小程序中也是有本地存储技术的)
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      // 不存在，则发送请求
      this.getCates();
    } else {
      // 有旧的数据，定义过期时间
      if (Date.now() - Cates.time > 1000 * 10) {
        // 过期，重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  // 获取分类数据
  async getCates() {
    // request({
    //   // url: 'https://api-hmugo-web.itheima.net/api/public/v1/categories'
    //   url: '/categories'
    // }).then(res => {
    //   this.Cates = res.data.message;

    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates", {
    //     time: Date.now(),
    //     data: this.Cates
    //   });

    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 使用ES7的async await来发送请求
    const res = await request({
      url: "/categories"
    })
    this.Cates = res.data.message;

    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });

    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    /**
     * 1、获取被点击的标题的索引
     * 2、给data中currentIndex赋值
     * 3、根据不同的索引来渲染右侧不同的商品内容
     */
    // console.log(e.currentTarget.dataset);
    const {
      index
    } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的scroll-view标签的滚动条距离顶部的距离
      scrollTop: 0
    })
  }
})