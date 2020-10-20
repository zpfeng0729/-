/**
 * 1 输入框绑定值改变事件(input事件)
 *   1.1 获取到输入框的值，
 *   1.2 合法性判断
 *   1.3 检验通过把输入框的值发送给后台
 *   1.4 返回的数据打印到页面上
 * 2 防抖(防止抖动)，通过定时器实现
 *   2.1 定义全局的定时器id
 * 
 * 
 * 防抖：一般是用于输入框中，防止重复输入，重复发送请求
 * 节流：一般是用在页面的下拉和上拉
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
    goods: [],
    // 控制"取消"按钮是否显示
    isFocus: false,
    // 输入框的值
    inputValue: ""

  },
  TimeId: -1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 输入框的值改变了就会触发的事件
  handleInput(e) {
    // 获取输入框的值
    const {
      value
    } = e.detail;
    // 检测合法性
    // trim()：去除字符串头尾的空格
    if (!value.trim()) {
      clearTimeout(this.TimeId);
      this.setData({
        goods: [],
        isFocus: false
      })
      // 值不合法
      return;
    }
    this.setData({
      isFocus: true
    })
    // 准备发送请求获取数据
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },

  // 准备发送请求获取搜索建议的数据
  async qsearch(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {query}
    })
    this.setData({
      goods: res.data.message
    });
  },

  // 点击取消按钮
  handleCancel() {
    this.setData({
      inputValue: "",
      isFocus: false,
      goods: []
    });
  }
})