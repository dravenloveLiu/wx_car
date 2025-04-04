const app = getApp()

Page({
  data: {
    serviceId: '',
    serviceInfo: null,
    loading: true,
    steps: [
      { name: '等待服务', status: 'waiting' },
      { name: '检查中', status: 'checking' },
      { name: '维修中', status: 'repairing' },
      { name: '质检中', status: 'testing' },
      { name: '已完成', status: 'completed' }
    ],
    currentStepIndex: 0
  },

  onLoad(options) {
    if (options.id) {
      this.setData({
        serviceId: options.id
      })
      this.loadServiceDetail()
    }
  },

  onPullDownRefresh() {
    this.loadServiceDetail()
  },

  // 加载服务详情
  async loadServiceDetail() {
    try {
      wx.showLoading({
        title: '加载中...'
      })

      const result = await wx.cloud.callFunction({
        name: 'getServiceDetail',
        data: {
          serviceId: this.data.serviceId
        }
      })

      wx.hideLoading()
      wx.stopPullDownRefresh()

      if (result.result && result.result.data) {
        const serviceInfo = result.result.data
        // 计算当前步骤索引
        const currentStepIndex = this.data.steps.findIndex(step => step.status === serviceInfo.status)
        
        this.setData({
          serviceInfo,
          currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : 0,
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

  // 格式化时间
  formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  // 获取步骤状态样式
  getStepStyle(index) {
    if (index < this.data.currentStepIndex) {
      return 'completed'
    } else if (index === this.data.currentStepIndex) {
      return 'current'
    }
    return 'waiting'
  },

  // 联系客服
  contactService() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567'
    })
  }
}) 