const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    banners: [],
    services: [
      {
        id: 1,
        icon: '/images/service/tire.png',
        name: '换轮胎',
        url: '/pages/tire/tire'
      },
      {
        id: 2,
        icon: '/images/service/maintenance.png',
        name: '做保养',
        url: '/pages/service/service'
      },
      {
        id: 3,
        icon: '/images/service/battery.png',
        name: '换蓄电池',
        url: '/pages/service/service'
      },
      {
        id: 4,
        icon: '/images/service/waxing.png',
        name: '汽车打蜡',
        url: '/pages/service/service'
      },
      {
        id: 5,
        icon: '/images/service/upgrade.png',
        name: '爱车升级',
        url: '/pages/service/service'
      },
      {
        id: 6,
        icon: '/images/service/paint.png',
        name: '喷漆',
        url: '/pages/service/service'
      },
      {
        id: 7,
        icon: '/images/service/parts.png',
        name: '配件维修',
        url: '/pages/service/service'
      },
      {
        id: 8,
        icon: '/images/service/film.png',
        name: '隔热窗膜',
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