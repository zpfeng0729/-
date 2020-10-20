import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  login
} from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

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

  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      const {
        encryptedData,
        rawData,
        iv,
        signature
      } = e.detail;
      // 获取小程序登录成功后的code值
      // wx.login({
      //   timeout: 10000,
      //   success: (result) => {
      //     const {
      //       code
      //     } = result;
      //   },
      // });
      const {
        code
      } = await login();
      const loginParams = {
        encryptedData,
        rawData,
        iv,
        signature,
        code
      };
      // 发送请求获取用户的token
      // const {
      //   token
      // } = request({
      //   url: "/users/wxlogin",
      //   data: loginParams,
      //   method: "post"
      // });
      // 接口请求不到，自己模拟了一个
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      // 把token存入缓存中，同时跳转回上一个页面
      wx.setStorageSync('token', token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})