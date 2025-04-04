const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    carId: null,
    carForm: {
      id: null,
      brand: '',
      model: '',
      plateNumber: '',
      year: '',
      mileage: '',
      engineType: '',
      buyDate: '',
      isDefault: 0
    },
    brands: ['大众', '丰田', '本田', '现代', '福特', '别克', '宝马', '奔驰', '奥迪', '雪佛兰'],
    engineTypes: ['汽油', '柴油', '混动', '纯电动'],
    carBrands: [], // 从后端获取的品牌列表
    carModels: [], // 选定品牌后的车型列表
    loading: false,
    loadingCar: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({
        carId: options.id,
        loadingCar: true
      })
      
      // 加载车辆详情
      this.loadCarDetail(options.id)
    }
    
    // 从后端获取品牌列表
    this.getCarBrands()
  },

  // 加载车辆详情
  loadCarDetail(carId) {
    request.get(`/api/user/car/${carId}`).then(res => {
      if (res.code === 0 && res.data) {
        const car = res.data
        this.setData({
          carForm: {
            id: car.id,
            brand: car.brand || '',
            model: car.model || '',
            plateNumber: car.plateNumber || '',
            year: car.year || '',
            mileage: car.mileage || '',
            engineType: car.engineType || '',
            buyDate: car.buyDate || '',
            isDefault: car.isDefault || 0,
            brandId: car.brandId,
            modelId: car.modelId
          },
          loadingCar: false
        })
        
        // 如果有品牌ID，获取对应的车型
        if (car.brandId) {
          this.getCarModels(car.brandId)
        }
      } else {
        wx.showToast({
          title: '无法获取车辆信息',
          icon: 'none'
        })
        
        // 返回上一页
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    }).catch(err => {
      console.error('获取车辆详情失败', err)
      wx.showToast({
        title: '获取车辆信息失败',
        icon: 'none'
      })
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    })
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

  // 默认车辆切换
  switchChange(e) {
    this.setData({
      'carForm.isDefault': e.detail.value ? 1 : 0
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

    // 提交车辆信息
    wx.showLoading({
      title: '保存中',
    })

    request.put(`/api/user/car/${this.data.carId}`, this.data.carForm).then(res => {
      wx.hideLoading()
      
      if (res.code === 0) {
        // 保存成功
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })

        // 更新全局车辆信息
        if (this.data.carForm.isDefault === 1) {
          app.globalData.userCar = res.data
        } else if (app.globalData.userCar && app.globalData.userCar.id === this.data.carId) {
          // 如果当前编辑的车辆是全局设置的默认车辆，但取消了默认状态，则清空全局车辆信息
          app.globalData.userCar = null
        }

        // 返回上一页
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        throw new Error(res.message || '更新失败')
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '更新失败，请重试',
        icon: 'none'
      })
    })
  }
}) 