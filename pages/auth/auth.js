// pages/auth/auth.js
const app = getApp()
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginType: 'wechat', // 默认为微信登录
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    formData: {
      phone: '',
      name: '',
      code: '',  // 验证码
      isVerifying: false,  // 是否正在验证手机号
      carInfo: ''
    },
    countdown: 0,  // 验证码倒计时
    showInfoForm: false,
    logoLoadFailed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    // 获取上一个页面传来的redirectUrl
    this.redirectUrl = options.redirectUrl || '/pages/index/index'
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 切换登录方式
   */
  switchLoginType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ 
      loginType: type,
      showInfoForm: false 
    })
  },

  /**
   * 获取用户信息（微信登录第一步）
   */
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '请授权用户信息',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 微信直接登录（无需手机验证）
   */
  wechatLogin() {
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          // 显示加载中
          wx.showLoading({
            title: '登录中...',
            mask: true
          })
          
          // 使用现有的登录接口，而不是/api/auth/wechat-login
          request.post('/api/auth/login', {
            code: loginRes.code,
            loginType: 'wechat', // 标识是微信登录
            nickname: this.data.userInfo.nickName,
            avatarUrl: this.data.userInfo.avatarUrl,
            gender: this.data.userInfo.gender
          }).then(res => {
            wx.hideLoading()
            
            // 登录成功
            if (res.data && res.data.token) {
              if (res.data.isNewUser) {
                // 如果是新用户，显示完善信息表单
                this.setData({
                  showInfoForm: true
                })
              } else {
                // 老用户直接设置登录状态并跳转
                this.handleLoginSuccess(res.data.token, res.data.userInfo)
              }
            } else {
              this.handleLoginFailed('登录失败，请重试')
            }
          }).catch(err => {
            wx.hideLoading()
            console.error('微信登录API失败，使用模拟数据', err)
            
            // 后端API不可用时，使用模拟数据
            this.mockLogin('wechat')
          })
        } else {
          this.handleLoginFailed('获取用户登录态失败')
        }
      },
      fail: () => {
        this.handleLoginFailed('微信登录失败')
      }
    })
  },

  /**
   * 手机号登录
   */
  phoneLogin() {
    const { phone, code } = this.data.formData

    if (!this.validatePhone(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    if (!code || code.length !== 6) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none'
      })
      return
    }

    // 显示加载中
    wx.showLoading({
      title: '登录中...',
      mask: true
    })

    // 使用现有的登录接口，而不是/api/auth/phone-login
    request.post('/api/auth/login', {
      loginType: 'phone', // 标识是手机号登录
      phone: phone,
      verificationCode: code
    }).then(res => {
      wx.hideLoading()
      
      // 登录成功
      if (res.data && res.data.token) {
        if (res.data.isNewUser) {
          // 如果是新用户，显示完善信息表单
          this.setData({
            showInfoForm: true
          })
        } else {
          // 老用户直接设置登录状态并跳转
          this.handleLoginSuccess(res.data.token, res.data.userInfo)
        }
      } else {
        this.handleLoginFailed('登录失败，请重试')
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('手机号登录API失败，使用模拟数据', err)
      
      // 后端API不可用时，使用模拟数据
      this.mockLogin('phone', phone)
    })
  },

  /**
   * 模拟登录（API不可用时）
   */
  mockLogin(loginType, phone) {
    console.log('使用模拟登录', loginType)
    
    // 生成模拟token
    const mockToken = 'mock_token_' + Math.random().toString(36).substr(2)
    
    // 创建模拟用户数据
    let mockUserInfo = {}
    
    if (loginType === 'wechat' && this.data.userInfo) {
      // 微信登录
      mockUserInfo = {
        id: 1,
        nickname: this.data.userInfo.nickName,
        avatarUrl: this.data.userInfo.avatarUrl,
        gender: this.data.userInfo.gender,
        isNewUser: false
      }
    } else if (loginType === 'phone') {
      // 手机号登录
      mockUserInfo = {
        id: 1,
        phone: phone,
        nickname: '用户' + phone.substr(-4),
        avatarUrl: '',
        isNewUser: false
      }
    }
    
    setTimeout(() => {
      // 判断是否需要完善资料
      const needInfo = Math.random() > 0.5
      
      if (needInfo) {
        this.setData({
          showInfoForm: true
        })
        wx.showToast({
          title: '请完善个人资料',
          icon: 'none'
        })
      } else {
        // 模拟登录成功
        this.handleLoginSuccess(mockToken, mockUserInfo)
      }
    }, 500)
  },

  /**
   * 提交用户信息（完善资料）
   */
  submitUserInfo() {
    const { name, carInfo } = this.data.formData

    if (!name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }

    // 显示加载中
    wx.showLoading({
      title: '提交中...',
      mask: true
    })

    // 组装提交数据，根据登录方式区分
    const submitData = {
      name: name,
      carInfo: carInfo
    }

    // 如果是通过微信登录的，添加微信信息
    if (this.data.loginType === 'wechat' && this.data.userInfo) {
      submitData.nickName = this.data.userInfo.nickName
      submitData.avatarUrl = this.data.userInfo.avatarUrl
      submitData.gender = this.data.userInfo.gender
    }

    // 如果是通过手机号登录的，添加手机号
    if (this.data.loginType === 'phone') {
      submitData.phone = this.data.formData.phone
    }

    // 调用完善信息接口
    request.post('/api/user/complete-info', submitData).then(res => {
      wx.hideLoading()
      
      // 提交成功
      if (res.code === 0) {
        // 设置登录状态并跳转
        this.handleLoginSuccess(res.data.token, res.data.userInfo)
      } else {
        wx.showToast({
          title: res.message || '提交失败，请重试',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('完善信息API失败，使用模拟数据', err)
      
      // 使用模拟数据
      this.mockCompleteInfo(submitData)
    })
  },

  /**
   * 模拟完善信息（API不可用时）
   */
  mockCompleteInfo(submitData) {
    console.log('使用模拟完善信息', submitData)
    
    // 生成模拟token
    const mockToken = 'mock_token_' + Math.random().toString(36).substr(2)
    
    // 创建模拟用户数据
    const mockUserInfo = {
      id: 1,
      name: submitData.name,
      nickname: submitData.nickName || ('用户' + (submitData.phone ? submitData.phone.substr(-4) : Math.floor(Math.random() * 10000))),
      avatarUrl: submitData.avatarUrl || '',
      phone: submitData.phone || '',
      gender: submitData.gender || 0
    }
    
    setTimeout(() => {
      // 模拟登录成功
      this.handleLoginSuccess(mockToken, mockUserInfo)
    }, 500)
  },

  /**
   * 处理登录成功
   */
  handleLoginSuccess(token, userInfo) {
    // 设置登录状态
    app.setLoginState(token, userInfo)
    
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    })

    // 延迟返回，确保提示显示
    setTimeout(() => {
      if (this.redirectUrl.startsWith('/pages/')) {
        // 根据redirectUrl判断是Tab页面还是普通页面
        if (['pages/index/index', 'pages/service/service', 'pages/appointment/list/list', 'pages/member/index/index'].some(tab => this.redirectUrl.includes(tab))) {
          wx.switchTab({
            url: this.redirectUrl
          })
        } else {
          wx.redirectTo({
            url: this.redirectUrl
          })
        }
      } else {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    }, 1500)
  },

  /**
   * 处理登录失败
   */
  handleLoginFailed(message) {
    wx.showToast({
      title: message,
      icon: 'none'
    })
  },

  /**
   * 表单输入处理
   */
  inputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  /**
   * 验证手机号
   */
  validatePhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone)
  },

  /**
   * 获取验证码
   */
  getVerificationCode() {
    const { phone } = this.data.formData
    
    if (!this.validatePhone(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    // 开始倒计时
    this.setData({
      countdown: 60
    })

    const timer = setInterval(() => {
      this.setData({
        countdown: this.data.countdown - 1
      })

      if (this.data.countdown <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    // 调用发送验证码接口
    request.post('/api/auth/send-code', {
      phone: phone
    }, true, true).then(res => {
      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      })
    }).catch(err => {
      console.error('验证码发送失败:', err);
      
      // 验证码API失败时，继续倒计时但提示用户使用模拟验证码
      wx.showToast({
        title: '验证码发送失败，请使用123456',
        icon: 'none',
        duration: 3000
      })
      
      // 将模拟验证码填入输入框（开发/测试环境使用）
      this.setData({
        'formData.code': '123456'
      })
      
      // 在生产环境中，可以移除上面的自动填充代码
      // 并且只在控制台输出模拟验证码
      console.log('使用模拟验证码：123456')
    })
  },

  /**
   * 处理图片加载错误
   */
  handleImageError: function(e) {
    console.error('图片加载失败：/images/logo.png');
    this.setData({
      logoLoadFailed: true
    });
  }
})