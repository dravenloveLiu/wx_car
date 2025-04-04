// pages/auth/auth.js
const app = getApp()
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          showInfoForm: true
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

  // 表单输入处理
  inputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  // 验证手机号
  validatePhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone)
  },

  // 获取验证码
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
      // 验证码发送失败，重置倒计时
      clearInterval(timer)
      this.setData({
        countdown: 0
      })
      
      wx.showToast({
        title: err.message || '验证码发送失败',
        icon: 'none'
      })
    })
  },

  // 提交用户信息
  submitUserInfo() {
    const { phone, name, code, carInfo } = this.data.formData

    if (!name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }

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

    // 获取登录code
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          // 调用登录接口
          request.post('/api/auth/login', {
            code: loginRes.code,
            phone: phone,
            verificationCode: code,
            nickname: this.data.userInfo.nickName,
            avatarUrl: this.data.userInfo.avatarUrl,
            gender: this.data.userInfo.gender,
            name: name,
            carInfo: carInfo
          }).then(res => {
            // 登录成功
            if (res.data && res.data.token) {
              // 设置登录状态
              app.setLoginState(res.data.token, {
                ...this.data.userInfo,
                phone: phone,
                name: name
              })
              
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
            }
          }).catch(err => {
            console.error('登录失败:', err);
            wx.showToast({
              title: err.message || '登录失败，请重试',
              icon: 'none'
            })
          })
        } else {
          wx.showToast({
            title: '获取用户登录态失败',
            icon: 'none'
          })
        }
      }
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
    
    // 显示错误提示
    wx.showToast({
      title: '资源加载错误',
      icon: 'none',
      duration: 2000
    });
  }
})