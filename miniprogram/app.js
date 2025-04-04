App({
  globalData: {
    userInfo: null,
    baseUrl: 'http://localhost:8080', // 后端接口基础URL
    token: '',
    isLogin: false
  },
  onLaunch: function () {
    // 检查登录状态
    wx.checkSession({
      success: () => {
        const token = wx.getStorageSync('token')
        if (token) {
          this.globalData.token = token
          this.globalData.isLogin = true
        }
      },
      fail: () => {
        // session_key 已经失效，需要重新执行登录流程
        wx.removeStorageSync('token')
        this.globalData.isLogin = false
      }
    })
  }
}) 