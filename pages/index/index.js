const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    banners: [
      {
        id: 1,
        title: '专业汽车保养',
        desc: '让您的爱车保持最佳状态',
        backgroundColor: '#1296db',
        link: '/pages/service/service'
      },
      {
        id: 2,
        title: '品牌轮胎专售',
        desc: '米其林、普利司通等品牌轮胎',
        backgroundColor: '#2ecc71',
        link: '/pages/tire/tire'
      },
      {
        id: 3,
        title: '在线预约服务',
        desc: '快捷方便的预约体验',
        backgroundColor: '#e74c3c',
        link: '/pages/appointment/create/create'
      }
    ],
    services: [
      {
        id: 1,
        name: '轮胎服务',
        url: '/pages/tire/tire',
        backgroundColor: '#1296db'
      },
      {
        id: 2,
        name: '日常保养',
        url: '/pages/service/service',
        backgroundColor: '#2ecc71'
      },
      {
        id: 3,
        name: '故障维修',
        url: '/pages/service/service',
        backgroundColor: '#e74c3c'
      }
    ],
    hotTires: [
      {
        id: 1,
        name: '米其林轮胎 PRIMACY 4 ST 215/55R17 94V',
        price: 688,
        backgroundColor: '#f8f8f8'
      },
      {
        id: 2,
        name: '普利司通轮胎 TURANZA T005 225/45R17 91W',
        price: 599,
        backgroundColor: '#f8f8f8'
      },
      {
        id: 3,
        name: '固特异轮胎 EAGLE F1 ASYMMETRIC 5 225/45R17 91Y',
        price: 729,
        backgroundColor: '#f8f8f8'
      }
    ]
  },

  onLoad() {
    // 暂时注释掉网络请求，等后端准备好再打开
    // this.getBanners()
    // this.getHotTires()
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
      if (url.includes('/appointment/') && !app.globalData.isLogin) {
        wx.navigateTo({
          url: '/pages/auth/auth'
        })
        return
      }
      wx.navigateTo({
        url: url
      })
    }
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
      url: '/pages/appointment/create/create'
    })
  }
}) 