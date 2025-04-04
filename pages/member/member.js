const app = getApp()

Page({
  data: {
    userInfo: null,
    memberInfo: {
      level: '普通会员',
      points: 0,
      coupons: 0,
      balance: '0.00'
    },
    services: [
      {
        id: 1,
        name: '维修记录',
        icon: '/images/services/repair.svg',
        url: '/pages/service/history/history'
      },
      {
        id: 2,
        name: '预约记录',
        icon: '/images/services/appointment.svg',
        url: '/pages/appointment/history/history'
      },
      {
        id: 3,
        name: '收藏商品',
        icon: '/images/services/favorite.svg',
        url: '/pages/mall/favorite/favorite'
      },
      {
        id: 4,
        name: '收货地址',
        icon: '/images/services/address.svg',
        url: '/pages/member/address/address'
      },
      {
        id: 5,
        name: '联系客服',
        icon: '/images/services/service.svg',
        url: '/pages/member/service/service'
      },
      {
        id: 6,
        name: '关于我们',
        icon: '/images/services/about.svg',
        url: '/pages/about/about'
      }
    ]
  },

  onLoad() {
    this.getUserInfo()
    this.getMemberInfo()
  },

  onShow() {
    // 每次显示页面时更新会员信息
    this.getMemberInfo()
  },

  onPullDownRefresh() {
    Promise.all([
      this.getUserInfo(),
      this.getMemberInfo()
    ]).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 获取用户信息
  async getUserInfo() {
    try {
      const userInfo = await wx.getStorageSync('userInfo')
      this.setData({ userInfo })
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  },

  // 获取会员信息
  async getMemberInfo() {
    try {
      // 这里应该调用后端接口获取会员信息
      // 目前使用模拟数据
      const memberInfo = {
        level: 'VIP会员',
        points: 1280,
        coupons: 3,
        balance: '520.00'
      }
      this.setData({ memberInfo })
    } catch (error) {
      console.error('获取会员信息失败', error)
      wx.showToast({
        title: '获取会员信息失败',
        icon: 'none'
      })
    }
  },

  // 登录
  async login() {
    try {
      await wx.getUserProfile({
        desc: '用于完善会员资料'
      }).then(res => {
        const userInfo = res.userInfo
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userInfo })
        
        // 这里应该调用后端登录接口
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
      })
    } catch (error) {
      console.error('登录失败', error)
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
    }
  },

  // 页面导航
  navigateTo(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({ url })
  }
}) 