const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    services: [],
    selectedService: null,
    date: '',
    time: '',
    name: '',
    phone: '',
    carNumber: '',
    remark: '',
    minDate: new Date().getTime(),
    maxDate: new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // 30天后
  },

  onLoad() {
    this.getServices()
    // 设置默认日期为明天
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.setData({
      date: this.formatDate(tomorrow)
    })
  },

  getServices() {
    request.get('/api/services').then(res => {
      this.setData({
        services: res.data
      })
    })
  },

  selectService(e) {
    const service = e.currentTarget.dataset.service
    this.setData({
      selectedService: this.data.selectedService?.id === service.id ? null : service
    })
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },

  inputName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  inputCarNumber(e) {
    this.setData({
      carNumber: e.detail.value
    })
  },

  inputRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  validateForm() {
    if (!this.data.selectedService) {
      wx.showToast({
        title: '请选择服务项目',
        icon: 'none'
      })
      return false
    }
    if (!this.data.date || !this.data.time) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
      return false
    }
    if (!this.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    if (!/^1[3-9]\d{9}$/.test(this.data.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return false
    }
    if (!this.data.carNumber) {
      wx.showToast({
        title: '请输入车牌号',
        icon: 'none'
      })
      return false
    }
    return true
  },

  submitAppointment() {
    if (!this.validateForm()) return

    const data = {
      serviceId: this.data.selectedService.id,
      appointmentDate: this.data.date,
      appointmentTime: this.data.time,
      name: this.data.name,
      phone: this.data.phone,
      carNumber: this.data.carNumber,
      remark: this.data.remark
    }

    request.post('/api/appointments', data).then(() => {
      wx.showToast({
        title: '预约成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }).catch(err => {
      wx.showToast({
        title: err.message || '预约失败',
        icon: 'none'
      })
    })
  }
}) 