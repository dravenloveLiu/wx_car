App({
  globalData: {
    userInfo: null,
    // 根据实际后端地址修改
    baseUrl: 'http://localhost:8080', // 开发环境API地址，上线前修改为生产环境地址
    token: wx.getStorageSync('token') || '',
    isLogin: false,
    userCar: null // 存储用户车辆信息
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('微信登录成功：', res)
      }
    })
    
    // 添加全局的图片请求失败处理
    this.handleImageError();
    
    // 注意：小程序需要在项目根目录的 /images/ 文件夹中添加 logo.png 文件
    // 该文件被用于登录页面显示，缺少此文件会导致500错误

    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
      this.globalData.isLogin = true
      
      // 获取用户信息
      this.getUserInfo()
      
      // 获取用户车辆信息
      this.getUserCar()
    }
    
    // 获取当前环境信息
    wx.getSystemInfo({
      success: (res) => {
        console.log('当前运行环境:', res);
        // 可以根据res.platform等信息判断环境
        if (res.platform === 'devtools') {
          // 开发工具环境
          this.globalData.baseUrl = 'http://localhost:8080';
        } else {
          // 真机环境，可以设置为生产环境地址
          // this.globalData.baseUrl = 'https://api.carservice.com';
        }
      }
    });
  },
  
  // 获取用户信息
  getUserInfo: function() {
    const request = require('./utils/request.js')
    request.get('/api/user/info').then(res => {
      if (res.code === 0) {
        this.globalData.userInfo = res.data
      }
    }).catch(err => {
      console.error('获取用户信息失败', err)
      // 如果是因为token过期导致的错误，utils/request.js会自动处理跳转到登录页
    })
  },
  
  // 获取用户车辆信息
  getUserCar: function() {
    const request = require('./utils/request.js')
    request.get('/api/user/car').then(res => {
      if (res.code === 0 && res.data) {
        this.globalData.userCar = res.data
      }
    }).catch(err => {
      console.error('获取用户车辆信息失败', err)
    })
  },
  
  // 设置登录状态
  setLoginState: function(token, userInfo) {
    this.globalData.token = token
    this.globalData.isLogin = true
    this.globalData.userInfo = userInfo
    
    // 将token存储到本地
    wx.setStorageSync('token', token)
    
    // 获取用户车辆信息
    this.getUserCar()
  },
  
  // 退出登录
  logout: function() {
    this.globalData.token = ''
    this.globalData.isLogin = false
    this.globalData.userInfo = null
    this.globalData.userCar = null
    
    // 清除本地存储的token
    wx.removeStorageSync('token')
  },
  
  // 全局图片加载失败处理
  handleImageError: function() {
    // 重写小程序的图片错误事件处理
    const oldImgError = wx.getLogManager;
    wx.onError(function(res) {
      console.error('全局错误捕获: ', res);
      // 判断是否为图片加载错误
      if (res && res.message && res.message.indexOf('Failed to load') > -1) {
        console.warn('检测到图片加载失败，错误已被全局捕获');
      }
    });
  }
}) 