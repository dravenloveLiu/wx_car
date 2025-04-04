const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    cars: [],
    loading: false,
    empty: false,
    isLogin: false
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    // 每次显示页面时，重新加载车辆数据
    if (app.globalData.isLogin) {
      this.loadUserCars()
    }
  },

  onPullDownRefresh() {
    this.loadUserCars()
  },

  // 检查登录状态
  checkLoginStatus() {
    const isLogin = app.globalData.isLogin
    this.setData({ isLogin })
    
    if (isLogin) {
      this.loadUserCars()
    } else {
      this.setData({ empty: true })
    }
  },

  // 加载用户的所有车辆
  loadUserCars() {
    this.setData({ loading: true })
    
    request.get('/api/user/cars').then(res => {
      wx.stopPullDownRefresh()
      
      if (res.code === 0) {
        const cars = res.data || []
        this.setData({
          cars: cars,
          empty: cars.length === 0,
          loading: false
        })
      } else {
        this.setData({
          cars: [],
          empty: true,
          loading: false
        })
      }
    }).catch(err => {
      console.error('获取车辆列表失败', err)
      wx.stopPullDownRefresh()
      this.setData({
        cars: [],
        empty: true,
        loading: false
      })
      
      wx.showToast({
        title: '获取车辆信息失败',
        icon: 'none'
      })
    })
  },

  // 点击添加车辆
  addCar() {
    if (!this.data.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth?redirectUrl=' + encodeURIComponent('/pages/car/list')
            })
          }
        }
      })
      return
    }
    
    wx.navigateTo({
      url: '/pages/car/add'
    })
  },

  // 点击编辑车辆
  editCar(e) {
    const carId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/car/edit?id=${carId}`
    })
  },

  // 点击设为默认
  setDefault(e) {
    const carId = e.currentTarget.dataset.id
    
    wx.showLoading({
      title: '设置中',
    })
    
    request.put(`/api/user/car/${carId}/default`).then(res => {
      wx.hideLoading()
      
      if (res.code === 0) {
        wx.showToast({
          title: '设置成功',
          icon: 'success'
        })
        
        // 更新全局车辆信息
        app.globalData.userCar = res.data
        
        // 刷新车辆列表
        this.loadUserCars()
      } else {
        throw new Error(res.message || '设置失败')
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '设置失败，请重试',
        icon: 'none'
      })
    })
  },

  // 点击删除车辆
  deleteCar(e) {
    const carId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该车辆信息吗？',
      success: (res) => {
        if (res.confirm) {
          this.confirmDelete(carId)
        }
      }
    })
  },

  // 确认删除车辆
  confirmDelete(carId) {
    wx.showLoading({
      title: '删除中',
    })
    
    request.delete(`/api/user/car/${carId}`).then(res => {
      wx.hideLoading()
      
      if (res.code === 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        
        // 如果删除的是当前用户车辆，清空全局车辆信息
        if (app.globalData.userCar && app.globalData.userCar.id === carId) {
          app.globalData.userCar = null
        }
        
        // 刷新车辆列表
        this.loadUserCars()
      } else {
        throw new Error(res.message || '删除失败')
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '删除失败，请重试',
        icon: 'none'
      })
    })
  },

  // 登录跳转
  goLogin() {
    wx.navigateTo({
      url: '/pages/auth/auth?redirectUrl=' + encodeURIComponent('/pages/car/list')
    })
  }
}) 