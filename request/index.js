// 同时发送异步代码的次数
let ajaxTime = 0;
export const request = (params) => {
  // 判断url中是否带有/my/，如果带有则表示请求的是私有的路径，需要带上header token
  let header = {
    ...params.header
  };
  if (params.url.includes("/my/")) {
    // 拼接header，带上token
    header["Authorization"] = wx.getStorageSync("token");
  }

  // 每发送一次请求ajaxTime就加1
  ajaxTime++;
  // 显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask: true // 显示一层蒙板
  });

  // 定义公共的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTime--;
        if (ajaxTime === 0) {
          // 关闭正在等待的图标
          wx.hideLoading();
        }
      }
    });
  })
}