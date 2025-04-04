const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    tire: null,
    loading: true,
    id: null
  },

  onLoad(options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getTireDetail(options.id)
    }
  },

  getTireDetail(id) {
    // 模拟数据，实际开发中应该从API获取
    const tireData = {
      id: id,
      name: id == 1 ? '米其林轮胎 PRIMACY 4 ST 215/55R17 94V' : 
            id == 2 ? '普利司通轮胎 TURANZA T005 225/45R17 91W' : 
            '固特异轮胎 EAGLE F1 ASYMMETRIC 5 225/45R17 91Y',
      price: id == 1 ? 688 : id == 2 ? 599 : 729,
      images: ['/images/tire-default.png'],
      brand: id == 1 ? '米其林' : id == 2 ? '普利司通' : '固特异',
      model: id == 1 ? 'PRIMACY 4 ST' : id == 2 ? 'TURANZA T005' : 'EAGLE F1 ASYMMETRIC 5',
      size: id == 1 ? '215/55R17' : id == 2 ? '225/45R17' : '225/45R17',
      speedRating: id == 1 ? '94V' : id == 2 ? '91W' : '91Y',
      description: '优质轮胎，提供出色的抓地力和舒适性，适合各种路况，耐磨损，提供卓越的操控和制动性能。',
      features: [
        '出色的湿地制动性能',
        '更长的使用寿命',
        '舒适安静的驾驶体验',
        '优异的抓地力和稳定性'
      ],
      stock: 50,
      rating: 4.8,
      reviews: 128
    }

    // 模拟API请求延迟
    setTimeout(() => {
      this.setData({
        tire: tireData,
        loading: false
      })
    }, 500)
  },

  addToCart() {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },

  buy() {
    wx.navigateTo({
      url: '/pages/order/create?productId=' + this.data.id + '&type=tire'
    })
  },

  makeAppointment() {
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        content: '预约服务需要先登录，是否前往登录？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth'
            })
          }
        }
      })
      return
    }
    wx.navigateTo({
      url: '/pages/appointment/create/create?serviceType=轮胎更换'
    })
  }
}) 