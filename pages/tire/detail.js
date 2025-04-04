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
      name: id == 1 ? '米其林轮胎 PRIMACY 4 ST 215/55R17' : 
            id == 2 ? '普利司通轮胎 TURANZA T005 225/45R17' : 
            id == 3 ? '固特异轮胎 EAGLE F1 ASYMMETRIC 5 225/45R17' :
            id == 4 ? '马牌轮胎 UltraContact UC6 215/60R16' :
            id == 5 ? '倍耐力轮胎 P7 Cinturato 225/50R17' :
            id == 6 ? '韩泰轮胎 Ventus S1 evo3 225/45R18' : '未知轮胎',
      price: id == 1 ? 688 : 
             id == 2 ? 599 : 
             id == 3 ? 729 :
             id == 4 ? 539 :
             id == 5 ? 659 :
             id == 6 ? 499 : 599,
      images: [],
      brand: id == 1 ? '米其林' : 
             id == 2 ? '普利司通' : 
             id == 3 ? '固特异' :
             id == 4 ? '马牌' :
             id == 5 ? '倍耐力' :
             id == 6 ? '韩泰' : '未知品牌',
      model: id == 1 ? 'PRIMACY 4 ST' : 
             id == 2 ? 'TURANZA T005' : 
             id == 3 ? 'EAGLE F1 ASYMMETRIC 5' :
             id == 4 ? 'UltraContact UC6' :
             id == 5 ? 'P7 Cinturato' :
             id == 6 ? 'Ventus S1 evo3' : '未知型号',
      size: id == 1 ? '215/55R17 94V' : 
            id == 2 ? '225/45R17 91W' : 
            id == 3 ? '225/45R17 91Y' :
            id == 4 ? '215/60R16 95V' :
            id == 5 ? '225/50R17 98Y' :
            id == 6 ? '225/45R18 95Y' : '未知尺寸',
      speedRating: id == 1 ? 'V (240km/h)' : 
                   id == 2 ? 'W (270km/h)' : 
                   id == 3 ? 'Y (300km/h)' :
                   id == 4 ? 'V (240km/h)' :
                   id == 5 ? 'Y (300km/h)' :
                   id == 6 ? 'Y (300km/h)' : '未知级别',
      description: id == 1 ? '米其林PRIMACY 4 ST是一款中高端轮胎，提供卓越的湿地性能和静音体验，舒适性和安全性俱佳，适合各种轿车使用。' : 
                   id == 2 ? '普利司通TURANZA T005是一款豪华舒适型轮胎，拥有出色的湿地抓地力和低噪音特性，为驾驶者提供静音舒适的驾乘体验。' : 
                   id == 3 ? '固特异EAGLE F1 ASYMMETRIC 5是一款高性能运动轮胎，专为运动驾驶设计，具有出色的干湿地操控性能和制动性能。' :
                   id == 4 ? '马牌UltraContact UC6是一款舒适型轮胎，提供出色的静音性能和舒适的驾乘体验，同时具有良好的耐磨性和燃油经济性。' :
                   id == 5 ? '倍耐力P7 Cinturato是一款高性能环保轮胎，提供出色的操控性和燃油经济性，同时降低排放，适合追求性能与环保兼顾的车主。' :
                   id == 6 ? '韩泰Ventus S1 evo3是一款性价比极高的高性能轮胎，提供良好的干湿地抓地力和操控感，适合追求驾驶乐趣的车主。' : '轮胎详细描述',
      features: id == 1 ? [
        '出色的湿地性能',
        '长效静音技术',
        '均衡的操控性',
        '优异的使用寿命'
      ] : id == 2 ? [
        '先进的排水设计',
        '舒适静音技术',
        '高质量胎面橡胶',
        '均衡的驾乘体验'
      ] : id == 3 ? [
        '高性能轮胎设计',
        '出色的抓地力',
        '精准的操控响应',
        '良好的干湿地性能'
      ] : id == 4 ? [
        '舒适静音技术',
        '均衡的磨损性能',
        '良好的燃油经济性',
        '优化的胎面花纹'
      ] : id == 5 ? [
        '环保低碳设计',
        '良好的操控反馈',
        '优化的胎面配方',
        '降低滚动阻力'
      ] : id == 6 ? [
        '高性价比设计',
        '良好的操控反馈',
        '优化的抓地性能',
        '适中的侧向支撑'
      ] : ['特点1', '特点2', '特点3', '特点4'],
      stock: 86,
      rating: 4.8,
      reviews: 156
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
      url: `/pages/order/create?tireId=${this.data.id}`
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
      url: `/pages/appointment/create/create?tireId=${this.data.id}&tireName=${this.data.tire.name}`
    })
  }
}) 