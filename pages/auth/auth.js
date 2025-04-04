// pages/auth/auth.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    formData: {
      phone: '',
      name: '',
      carInfo: ''
    },
    showInfoForm: false
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
        // 保存微信用户基本信息
        app.globalData.userInfo = res.userInfo
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

  // 提交用户信息
  async submitUserInfo() {
    const { phone, name, carInfo } = this.data.formData

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

    if (!carInfo) {
      wx.showToast({
        title: '请输入车辆信息',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({
        title: '正在登录...'
      })

      // 获取登录code
      const { code } = await wx.login()
      
      // 调用后端登录接口
      const result = await wx.cloud.callFunction({
        name: 'login',
        data: {
          code,
          userInfo: {
            ...this.data.userInfo,
            phone,
            name,
            carInfo
          }
        }
      })

      wx.hideLoading()

      if (result.result && result.result.token) {
        // 保存登录状态
        wx.setStorageSync('token', result.result.token)
        app.globalData.token = result.result.token
        app.globalData.isLogin = true
        
        // 保存用户完整信息
        app.globalData.userInfo = {
          ...this.data.userInfo,
          phone,
          name,
          carInfo
        }

        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })

        // 延迟返回，确保提示显示
        setTimeout(() => {
          const pages = getCurrentPages()
          if (pages.length > 1) {
            wx.navigateBack()
          } else {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }, 1500)
      } else {
        throw new Error('登录失败')
      }
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  }
})