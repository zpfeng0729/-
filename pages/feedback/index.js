/**
 * 1 点击"+"，触发tap点击事件
 *   1.1 调用小程序内置的选择图片的api
 *   1.2 获取到图片的路径数组
 *   1.3 把图片路径存到data的变量中
 *   1.4 页面就可以根据图片数组进行循环显示自定义组件
 * 2 点击自定义图片组件
 *   2.1 获取被点击的元素的索引
 *   2.2 获取data中的图片数组
 *   2.3 根据索引删除数组中对应的元素
 *   2.4 把数组重新设置回data中
 * 3 点击提交按钮
 *   3.1 获取文本域的内容(类似普通输入框的获取)
 *       3.1.1 data中定义变量，表示输入框内容
 *       3.1.2 文本域绑定输入事件，事件触发的时候，把输入框的值存入到变量中
 *   3.2 对这些内容做合法性验证
 *   3.3 验证通过，将用户选择的图片，上传至专门的图片服务器，返回图片外网的链接
 *       3.3.1 遍历图片数组
 *       3.3.2 挨个上传
 *       3.3.1 自己再维护图片数组，存放图片上传后的外网的链接
 *   3.4 文本域和外网的图片的路径一起提交到服务器中(这里只做前端的模拟，并不会发送请求到后台服务器)
 *   3.5 提交成功之后，清空当前页面
 *   3.6 返回上一页
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      },
    ],
    // 被选中的图片路径数组
    chooseImgs: [],
    // 文本域内容
    textVal: ""
  },
  // 外网的图片的路径数组
  uploadImgs: [],

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


  // 标题点击事件，从子组件传递过来
  handleTabsItemChange(e) {
    // 1、获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2、修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3、赋值到data中
    this.setData({
      tabs
    });
  },

  // 点击"+"选择图片
  handleChooseImg() {
    // 调用小程序内置的选择图片api
    wx.chooseImage({
      count: 9, // 同时选中的图片的数量
      sizeType: ['original', 'compressed'], // 图片的格式 原图 压缩
      sourceType: ['album', 'camera'], // 图片的来源:相册 照相机
      success: (result) => {
        this.setData({
          // 图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        });
      }
    });
  },

  // 点击自定义的图片组件
  handleRemoveImg(e) {
    // 获取被点击的组件的索引
    const {
      index
    } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let {
      chooseImgs
    } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    });
  },

  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    });

  },

  // 提交按钮的点击事件
  handleFormSubmit() {
    // 获取文本域的内容
    const {
      textVal,
      chooseImgs
    } = this.data;
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }
    // 上传图片到专门的图片服务器
    // 上传文件的api不支持多个文件同时上传，那么需要遍历数组，逐个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: '正在上传中',
      mask: true
    });
    // 判断有没有需要上传的图片数组
    if (chooseImgs.length !== 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称，后台来获取文件 file
          name: 'file',
          // 图片要上传到哪里
          url: 'https://images.ac.cn/Home/Index/UploadAction/', // 点击提交，可以上传图⽚到接⼝地址新浪图床上
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data.url);
            this.uploadImgs.push(url);
            // 所有图片都上传完成了才触发
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              // 把文本的内容和外网的图片数组提交到后台中
              // TODO
              // 提交成功了重置页面
              this.setData({
                textVal: "",
                chooseImgs: []
              });
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      });
    } else {
      // 只是提交了普通文本
      // TODO
      wx.hideLoading();
      // 返回上一个页面
      wx.navigateBack({
        delta: 1
      });
    }
  }
})