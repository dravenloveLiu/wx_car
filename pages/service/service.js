// pages/service/service.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0,
    tabs: ['进行中', '已完成'],
    services: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadServices()
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
    // 每次显示页面时重新加载数据
    this.loadServices()
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
    this.loadServices()
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

  // 切换标签页
  switchTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      activeTab: index
    })
    this.loadServices()
  },

  // 加载服务记录
  async loadServices() {
    try {
      wx.showLoading({
        title: '加载中...'
      })

      const result = await wx.cloud.callFunction({
        name: 'getServices',
        data: {
          status: this.data.activeTab === 0 ? 'ongoing' : 'completed'
        }
      })

      wx.hideLoading()
      wx.stopPullDownRefresh()

      if (result.result && result.result.data) {
        this.setData({
          services: result.result.data,
          loading: false
        })
      }
    } catch (error) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    }
  },

  // 查看服务详情
  viewDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/service/detail/detail?id=${id}`
    })
  },

  // 获取进度状态样式
  getStatusStyle(status) {
    const statusMap = {
      'waiting': 'status-waiting',
      'checking': 'status-checking',
      'repairing': 'status-repairing',
      'testing': 'status-testing',
      'completed': 'status-completed'
    }
    return statusMap[status] || 'status-waiting'
  },

  // 获取进度状态文本
  getStatusText(status) {
    const statusMap = {
      'waiting': '等待服务',
      'checking': '检查中',
      'repairing': '维修中',
      'testing': '质检中',
      'completed': '已完成'
    }
    return statusMap[status] || '等待服务'
  },

  // 获取进度百分比
  getProgressPercent(status) {
    const percentMap = {
      'waiting': 0,
      'checking': 25,
      'repairing': 50,
      'testing': 75,
      'completed': 100
    }
    return percentMap[status] || 0
  },

  // 格式化时间
  formatDate(dateStr) {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  }
})