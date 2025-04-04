const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    banners: [],
    services: [
      {
        id: 1,
        icon: '/images/tire.png',
        name: '轮胎服务',
        url: '/pages/tire/tire'
      },
      {
        id: 2,
        icon: '/images/maintenance.png',
        name: '日常保养',
        url: '/pages/service/service'
      },
      {
        id: 3,
        icon: '/images/repair.png',
        name: '故障维修',
        url: '/pages/service/service'
      }
    ],
    hotTires: []
  },

  onLoad() {
    this.getBanners()
    this.getHotTires()
  },

  getBanners() {
    request.get('/api/banners').then(res => {
      this.setData({
        banners: res.data
      })
    })
  },

  getHotTires() {
    request.get('/api/tires/hot').then(res => {
      this.setData({
        hotTires: res.data
      })
    })
  },

  navigateTo(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url: url
      })
    }
  },

  makeAppointment() {
    if (!app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/appointment/appointment'
    })
  }
}) 