const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    canIUseGetUserProfile: false,
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (userInfo) => {
        this.login(userInfo.userInfo)
      },
      fail: (err) => {
        console.error('获取用户信息失败', err)
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    })
  },

  login(userInfo) {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          request.post('/api/auth/login', {
            code: res.code,
            userInfo: userInfo
          }).then(res => {
            // 保存token
            wx.setStorageSync('token', res.token)
            app.globalData.token = res.token
            app.globalData.userInfo = userInfo
            app.globalData.isLogin = true
            
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            })
            
            // 返回上一页或首页
            const pages = getCurrentPages()
            if (pages.length > 1) {
              wx.navigateBack()
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }).catch(err => {
            console.error('登录失败', err)
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
          })
        }
      }
    })
  }
}) 