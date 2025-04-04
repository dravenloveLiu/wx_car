const app = getApp()

Page({
  data: {
    carForm: {
      brand: '',
      model: '',
      plateNumber: '',
      year: '',
      mileage: '',
      engineType: '',
      buyDate: ''
    },
    brands: ['大众', '丰田', '本田', '现代', '福特', '别克', '宝马', '奔驰', '奥迪', '雪佛兰'],
    engineTypes: ['汽油', '柴油', '混动', '纯电动']
  },

  onLoad(options) {
    // 页面初始化
  },

  // 品牌选择
  bindBrandChange(e) {
    this.setData({
      'carForm.brand': this.data.brands[e.detail.value]
    })
  },

  // 发动机类型选择
  bindEngineTypeChange(e) {
    this.setData({
      'carForm.engineType': this.data.engineTypes[e.detail.value]
    })
  },

  // 购买日期选择
  bindDateChange(e) {
    this.setData({
      'carForm.buyDate': e.detail.value
    })
  },

  // 表单输入变化处理
  inputChange(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`carForm.${field}`]: value
    })
  },

  // 表单提交
  submitForm() {
    const { brand, model, plateNumber } = this.data.carForm
    
    // 表单验证
    if (!brand || !model || !plateNumber) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      })
      return
    }

    // 模拟提交表单
    wx.showLoading({
      title: '保存中',
    })

    // 模拟网络请求延迟
    setTimeout(() => {
      wx.hideLoading()
      
      // 模拟保存成功
      wx.showToast({
        title: '添加爱车成功',
      })

      // 将车辆信息保存到 app.globalData
      app.globalData.userCar = this.data.carForm

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }, 1000)
  }
}) 