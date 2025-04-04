const app = getApp()
const request = require('../../utils/request.js')

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
    engineTypes: ['汽油', '柴油', '混动', '纯电动'],
    carBrands: [], // 从后端获取的品牌列表
    carModels: [], // 选定品牌后的车型列表
    loading: false
  },

  onLoad(options) {
    // 从后端获取品牌列表
    this.getCarBrands()
  },

  // 获取汽车品牌列表
  getCarBrands() {
    this.setData({ loading: true })
    
    request.get('/api/car/brands').then(res => {
      if (res.code === 0 && res.data) {
        this.setData({
          carBrands: res.data,
          loading: false
        })
      }
    }).catch(err => {
      console.error('获取品牌列表失败', err)
      this.setData({ loading: false })
      // 获取失败时使用默认品牌列表
    })
  },

  // 获取车型列表
  getCarModels(brandId) {
    this.setData({ loading: true })
    
    request.get('/api/car/models', { brandId }).then(res => {
      if (res.code === 0 && res.data) {
        this.setData({
          carModels: res.data,
          loading: false
        })
      }
    }).catch(err => {
      console.error('获取车型列表失败', err)
      this.setData({ loading: false })
    })
  },

  // 品牌选择
  bindBrandChange(e) {
    const index = e.detail.value
    const brand = this.data.carBrands[index] || this.data.brands[index]
    
    this.setData({
      'carForm.brand': brand.name || brand,
      'carForm.brandId': brand.id || ''
    })
    
    // 如果有brandId，获取对应的车型
    if (brand.id) {
      this.getCarModels(brand.id)
    }
  },

  // 车型选择
  bindModelChange(e) {
    const index = e.detail.value
    const model = this.data.carModels[index]
    
    this.setData({
      'carForm.model': model.name,
      'carForm.modelId': model.id
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
    const { brand, model, plateNumber, year, mileage } = this.data.carForm
    
    // 表单验证
    if (!brand || !model || !plateNumber) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      })
      return
    }

    // 检查用户是否登录
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth?redirectUrl=' + encodeURIComponent('/pages/car/add')
            })
          }
        }
      })
      return
    }

    // 提交车辆信息
    wx.showLoading({
      title: '保存中',
    })

    request.post('/api/user/car', this.data.carForm).then(res => {
      wx.hideLoading()
      
      if (res.code === 0) {
        // 保存成功
        wx.showToast({
          title: '添加爱车成功',
          icon: 'success'
        })

        // 更新全局车辆信息
        app.globalData.userCar = res.data

        // 返回上一页
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        throw new Error(res.message || '添加失败')
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '添加失败，请重试',
        icon: 'none'
      })
    })
  }
}) 