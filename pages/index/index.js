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
        name: '换轮胎',
        iconColor: '#1296db',
        icon: '🛞',
        url: '/pages/tire/tire'
      },
      {
        id: 2,
        name: '做保养',
        iconColor: '#2ecc71',
        icon: '🔧',
        url: '/pages/service/service'
      },
      {
        id: 3,
        name: '换蓄电池',
        iconColor: '#e74c3c',
        icon: '🔋',
        url: '/pages/service/service'
      },
      {
        id: 4,
        name: '汽车打蜡',
        iconColor: '#f39c12',
        icon: '✨',
        url: '/pages/service/service'
      },
      {
        id: 5,
        name: '爱车升级',
        iconColor: '#9b59b6',
        icon: '⬆️',
        url: '/pages/service/service'
      },
      {
        id: 6,
        name: '喷漆',
        iconColor: '#3498db',
        icon: '🎨',
        url: '/pages/service/service'
      },
      {
        id: 7,
        name: '配件维修',
        iconColor: '#27ae60',
        icon: '🔩',
        url: '/pages/service/service'
      },
      {
        id: 8,
        name: '隔热窗膜',
        iconColor: '#e67e22',
        icon: '🪟',
        url: '/pages/service/service'
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
    ],
    recommendations: [
      {
        id: 1,
        name: '节能环保机油',
        desc: '5W-30 全合成机油，提供卓越的发动机保护',
        price: 329,
        image: '/images/products/oil.png',
        url: '/pages/service/detail?id=1'
      },
      {
        id: 2,
        name: '高性能刹车片',
        desc: '适用于多种车型，提供更佳制动性能',
        price: 499,
        image: '/images/products/brake.png',
        url: '/pages/service/detail?id=2'
      },
      {
        id: 3,
        name: '空调清洗套餐',
        desc: '彻底清除异味，杀菌消毒，恢复空调清新',
        price: 198,
        image: '/images/products/ac.png',
        url: '/pages/service/detail?id=3'
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
    const url = e.currentTarget.dataset.url;
    console.log('Navigating to:', url);
    
    // 检查URL是否为轮胎详情页或服务详情页
    if (url && (url.startsWith('/pages/tire/detail') || url.startsWith('/pages/service/detail'))) {
      wx.navigateTo({
        url: url
      });
      return;
    }
    
    // 检查URL是否为预约相关页面
    if (url && url.includes('/appointment/')) {
      // 未登录时跳转到登录页
      if (!app.globalData.isLoggedIn) {
        wx.navigateTo({
          url: '/pages/login/login'
        });
        return;
      }
    }
    
    // 其他页面正常跳转
    if (url) {
      wx.navigateTo({
        url: url
      });
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