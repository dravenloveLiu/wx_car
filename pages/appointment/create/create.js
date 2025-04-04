Page({
  data: {
    date: '',
    time: '',
    serviceTypes: ['换轮胎', '做保养', '换蓄电池', '汽车打蜡', '爱车升级', '喷漆', '配件维修', '隔热窗膜'],
    selectedService: '',
    carInfo: '',
    description: '',
    contact: '',
    phone: ''
  },

  onLoad(options) {
    // 设置默认日期为明天
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.setData({
      date: this.formatDate(tomorrow),
      time: '09:00'
    })

    // 如果从其他页面传入了服务类型，则预选中
    if (options.serviceType) {
      this.setData({
        selectedService: decodeURIComponent(options.serviceType)
      })
    }
  },

  // 日期选择器变化
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  // 时间选择器变化
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },

  // 服务类型选择
  bindServiceChange(e) {
    this.setData({
      selectedService: this.data.serviceTypes[e.detail.value]
    })
  },

  // 输入框内容变化
  inputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [field]: e.detail.value
    })
  },

  // 提交预约
  async submitAppointment() {
    const { date, time, selectedService, carInfo, description, contact, phone } = this.data
    
    if (!date || !time || !selectedService || !carInfo || !contact || !phone) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    // 验证手机号
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({
        title: '提交中...'
      })

      const result = await wx.cloud.callFunction({
        name: 'createAppointment',
        data: {
          date,
          time,
          serviceType: selectedService,
          carInfo,
          description,
          contact,
          phone,
          status: '待确认', // 预约状态：待确认、已确认、已完成、已取消
          createTime: new Date()
        }
      })

      wx.hideLoading()
      
      if (result.result && result.result.success) {
        wx.showToast({
          title: '预约成功',
          icon: 'success'
        })
        
        // 延迟跳转到预约列表页
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/appointment/list/list'
          })
        }, 1500)
      } else {
        throw new Error('预约失败')
      }
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '预约失败，请重试',
        icon: 'none'
      })
    }
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}) 