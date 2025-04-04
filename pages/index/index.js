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
        url: '/pages/service/detail?id=4'
      },
      {
        id: 3,
        name: '换蓄电池',
        iconColor: '#e74c3c',
        icon: '🔋',
        url: '/pages/service/detail?id=5'
      },
      {
        id: 4,
        name: '汽车打蜡',
        iconColor: '#f39c12',
        icon: '✨',
        url: '/pages/service/detail?id=6'
      },
      {
        id: 5,
        name: '爱车升级',
        iconColor: '#9b59b6',
        icon: '⬆️',
        url: '/pages/service/detail?id=7'
      },
      {
        id: 6,
        name: '喷漆',
        iconColor: '#3498db',
        icon: '🎨',
        url: '/pages/service/detail?id=8'
      },
      {
        id: 7,
        name: '配件维修',
        iconColor: '#27ae60',
        icon: '🔩',
        url: '/pages/service/detail?id=9'
      },
      {
        id: 8,
        name: '隔热窗膜',
        iconColor: '#e67e22',
        icon: '🪟',
        url: '/pages/service/detail?id=10'
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
    ],
    userCar: null,
    nearestStore: null
  },

  onLoad() {
    // 从后端API获取数据
    this.getBanners()
    this.getHotTires()
    this.getRecommendations()
    this.getUserCar()
    this.getNearestStore()
  },

  getBanners() {
    // 获取轮播图数据
    request.get('/api/banners').then(res => {
      // 后端返回的是ResultVO格式，data才是真正的数据数组
      if (res.data && res.data.length > 0) {
        this.setData({
          banners: res.data
        })
      }
    }).catch(err => {
      console.error('获取轮播图失败', err)
      // 请求失败时使用默认数据作为备选
      console.log('使用默认轮播图数据')
      // 保留默认数据，不修改this.data.banners
    })
  },

  getHotTires() {
    // 获取热门轮胎
    request.get('/api/tires/hot').then(res => {
      // 后端返回的是ResultVO格式，data才是真正的数据数组
      if (res.data && res.data.length > 0) {
        this.setData({
          hotTires: res.data
        })
      }
    }).catch(err => {
      console.error('获取热门轮胎失败', err)
      // 请求失败时使用默认数据作为备选
      console.log('使用默认热门轮胎数据')
      // 保留默认数据，不修改this.data.hotTires
    })
  },

  getRecommendations() {
    // 获取推荐服务
    request.get('/api/services/recommended').then(res => {
      // 后端返回的是ResultVO格式，data才是真正的数据数组
      if (res.data && res.data.length > 0) {
        this.setData({
          recommendations: res.data
        })
      }
    }).catch(err => {
      console.error('获取推荐服务失败', err)
      // 请求失败时使用默认数据作为备选
      console.log('使用默认推荐服务数据')
      // 保留默认数据，不修改this.data.recommendations
    })
  },

  getUserCar() {
    // 检查用户是否登录
    if (!app.globalData.isLogin) {
      return
    }

    // 检查是否已有车辆数据
    if (app.globalData.userCar) {
      this.setData({
        userCar: app.globalData.userCar
      })
      return
    }

    // 从API获取车辆数据
    request.get('/api/user/car', {}, true, false).then(res => {
      if (res.code === 0 && res.data) {
        this.setData({
          userCar: res.data
        })
        // 同时更新全局数据
        app.globalData.userCar = res.data
      }
    }).catch(err => {
      console.error('获取用户车辆信息失败', err)
    })
  },

  getNearestStore() {
    // 获取位置权限
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          // 已经授权，获取位置
          this.getLocation()
        } else {
          // 未授权，使用默认门店
          this.getDefaultStore()
        }
      }
    })
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res
        // 获取附近门店
        request.get('/api/stores/nearest', {
          latitude,
          longitude
        }, true, false).then(res => {
          if (res.code === 0 && res.data) {
            this.setData({
              nearestStore: res.data
            })
          } else {
            this.getDefaultStore()
          }
        }).catch(err => {
          console.error('获取最近门店失败', err)
          this.getDefaultStore()
        })
      },
      fail: () => {
        // 获取位置失败，使用默认门店
        this.getDefaultStore()
      }
    })
  },

  getDefaultStore() {
    request.get('/api/stores/default', {}, false, false).then(res => {
      if (res.code === 0 && res.data) {
        this.setData({
          nearestStore: res.data
        })
      }
    }).catch(err => {
      console.error('获取默认门店失败', err)
      // 使用本地默认数据
      this.setData({
        nearestStore: {
          id: 1,
          name: '总店',
          address: '北京市海淀区西三环北路25号',
          latitude: 39.98123,
          longitude: 116.32123,
          hours: '09:00-18:00',
          phone: '010-12345678'
        }
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
  },

  navigateToStore() {
    const store = this.data.nearestStore
    // 使用微信内置地图导航
    if (store) {
      wx.openLocation({
        latitude: store.latitude,
        longitude: store.longitude,
        name: store.name,
        address: store.address,
        scale: 18
      })
    }
  },

  // 跳转到搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
}) 