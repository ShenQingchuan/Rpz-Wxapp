
// 自定义的 ajax 429 Too Many Request 判断器
wx.$ratelimitGuard = function(statusCode) {
  let judge = true;
  if (statusCode === 429) {
    wx.lin.showToast({
      title: '请求太快啦！',
      icon: 'error',
      iconStyle: 'color: red; size: 60',
    });
    judge = false;
  }
  return judge;
}

// 自定义的 success toast
wx.$successToast = function(msg){
  wx.lin.showToast({
    title: msg,
    icon: 'success',
    iconStyle: 'color: #34bfa3; size: 60',
  });
}
// 自定义的 error toast
wx.$errorToast = function (msg) {
  wx.lin.showToast({
    title: msg,
    icon: 'error',
    iconStyle: 'color: #34bfa3; size: 60',
  });
}


//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
		user_openid: null,
  }
})