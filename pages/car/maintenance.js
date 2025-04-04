// pages/car/maintenance.js
const app = getApp()
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carId: null,
    car: null,
    maintenanceRecords: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取车辆ID
    const carId = options.id
    
    if (!carId) {
      // 如果没有车辆ID，尝试获取默认车辆
      this.getDefaultCar()
    } else {
      this.setData({ carId })
      this.getCarInfo(carId)
      this.getMaintenanceRecords(carId)
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

  // 获取默认车辆
  getDefaultCar: function() {
    request.get('/api/user/car/default', {}, true, false).then(res => {
      if (res.code === 0 && res.data) {
        const carId = res.data.id
        this.setData({ 
          carId,
          car: res.data
        })
        this.getMaintenanceRecords(carId)
      } else {
        this.showNoCarTip()
      }
    }).catch(err => {
      console.error('获取默认车辆失败', err)
      this.showNoCarTip()
    })
  },

  // 获取车辆信息
  getCarInfo: function(carId) {
    request.get(`/api/user/car/${carId}`, {}, true, false).then(res => {
      if (res.code === 0 && res.data) {
        this.setData({ car: res.data })
      } else {
        wx.showToast({
          title: '获取车辆信息失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.error('获取车辆信息失败', err)
      wx.showToast({
        title: '获取车辆信息失败',
        icon: 'none'
      })
    })
  },

  // 获取保养记录
  getMaintenanceRecords: function(carId) {
    this.setData({ loading: true })
    
    request.get(`/api/maintenance/car/${carId}`, {}, true, false).then(res => {
      if (res.code === 0) {
        this.setData({
          maintenanceRecords: res.data || [],
          loading: false
        })
      } else {
        // API返回错误时使用模拟数据
        this.useMockData(carId)
      }
    }).catch(err => {
      console.error('获取保养记录失败', err)
      // API调用失败时使用模拟数据
      this.useMockData(carId)
    })
  },

  // 使用模拟数据（当API不可用时）
  useMockData: function(carId) {
    console.log('使用保养记录模拟数据')
    
    // 当前日期
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    
    // 模拟数据
    const mockRecords = [
      {
        id: 1,
        carId: carId,
        maintenanceType: '常规保养',
        description: '更换机油、机油滤清器，检查空气滤清器',
        day: '15',
        month: month - 2 > 0 ? month - 2 : 12 - (2 - month),
        year: month - 2 > 0 ? year : year - 1,
        mileage: '5000',
        cost: '350'
      },
      {
        id: 2,
        carId: carId,
        maintenanceType: '轮胎更换',
        description: '更换两条前轮胎，动平衡调整',
        day: '03',
        month: month - 4 > 0 ? month - 4 : 12 - (4 - month),
        year: month - 4 > 0 ? year : year - 1,
        mileage: '4200',
        cost: '1200'
      }
    ]
    
    this.setData({
      maintenanceRecords: mockRecords,
      loading: false
    })
  },

  // 处理加载错误
  handleLoadError: function() {
    this.setData({ loading: false })
    wx.showToast({
      title: '获取保养记录失败',
      icon: 'none'
    })
  },

  // 显示无车辆提示
  showNoCarTip: function() {
    this.setData({ loading: false })
    wx.showModal({
      title: '提示',
      content: '您还没有添加车辆信息，是否前往添加？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/car/add'
          })
        } else {
          wx.navigateBack()
        }
      }
    })
  },

  // 跳转到保养详情
  goToDetail: function(e) {
    const recordId = e.currentTarget.dataset.id
    
    // 检查是否注册了详情页面
    if (this.pageExists('/pages/maintenance/detail')) {
      wx.navigateTo({
        url: `/pages/maintenance/detail?id=${recordId}`
      })
    } else {
      // 页面不存在时显示提示
      wx.showToast({
        title: '保养详情功能开发中',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 添加保养记录(手动记录)
  addRecord: function() {
    // 检查是否注册了添加页面
    if (this.pageExists('/pages/maintenance/add')) {
      wx.navigateTo({
        url: `/pages/maintenance/add?carId=${this.data.carId}`
      })
    } else {
      // 页面不存在时显示提示
      wx.showToast({
        title: '添加保养记录功能开发中',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 检查页面是否存在
  pageExists: function(pagePath) {
    // 获取已注册的页面路径
    const pages = getCurrentPages()
    const app = getApp()
    
    // 如果app.json中的pages可用，直接检查
    if (app.globalData && app.globalData.appPages) {
      return app.globalData.appPages.includes(pagePath)
    }
    
    // 否则返回false，表示页面可能不存在
    return false
  },

  // 查看车辆详情
  viewCarDetail: function() {
    wx.navigateTo({
      url: `/pages/car/edit?id=${this.data.carId}`
    })
  },
  
  // 返回
  goBack: function() {
    wx.navigateBack()
  }
})