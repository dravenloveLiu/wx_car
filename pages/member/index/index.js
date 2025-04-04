const app = getApp()
const request = require('../../../utils/request.js')

Page({
  data: {
    userInfo: null,
    memberInfo: {
      points: 0,
      balance: 0,
      level: '普通会员',
      coupons: {
        unused: 0,
        expired: 0
      }
    },
    services: [
      {
        icon: 'points',
        name: '我的积分',
        url: '/pages/member/points/points'
      },
      {
        icon: 'coupon',
        name: '优惠券',
        url: '/pages/member/coupons/coupons'
      },
      {
        icon: 'wallet',
        name: '储值余额',
        url: '/pages/member/wallet/wallet'
      },
      {
        icon: 'gift',
        name: '积分商城',
        url: '/pages/member/mall/mall'
      }
    ]
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.loadMemberInfo()
  },

  onShow() {
    // 每次显示页面时重新加载会员信息
    this.loadMemberInfo()
  },

  onPullDownRefresh() {
    this.loadMemberInfo()
  },

  // 加载会员信息
  async loadMemberInfo() {
    try {
      wx.showLoading({
        title: '加载中...'
      })

      const result = await wx.cloud.callFunction({
        name: 'getMemberInfo'
      })

      wx.hideLoading()
      wx.stopPullDownRefresh()

      if (result.result && result.result.data) {
        this.setData({
          memberInfo: result.result.data
        })
      }
    } catch (error) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    }
  },

  // 导航到具体功能页面
  navigateTo(e) {
    const { url } = e.currentTarget.dataset
    wx.navigateTo({ url })
  },

  // 在线充值
  showRecharge() {
    wx.showActionSheet({
      itemList: ['充值100元', '充值200元', '充值500元', '充值1000元', '自定义金额'],
      success: (res) => {
        const amounts = [100, 200, 500, 1000]
        if (res.tapIndex < 4) {
          this.recharge(amounts[res.tapIndex])
        } else {
          this.showCustomRecharge()
        }
      }
    })
  },

  // 自定义充值金额
  showCustomRecharge() {
    wx.showModal({
      title: '自定义充值金额',
      editable: true,
      placeholderText: '请输入充值金额',
      success: (res) => {
        if (res.confirm && res.content) {
          const amount = parseFloat(res.content)
          if (isNaN(amount) || amount <= 0) {
            wx.showToast({
              title: '请输入有效金额',
              icon: 'none'
            })
            return
          }
          this.recharge(amount)
        }
      }
    })
  },

  // 执行充值
  async recharge(amount) {
    try {
      wx.showLoading({
        title: '处理中...'
      })

      const result = await wx.cloud.callFunction({
        name: 'recharge',
        data: { amount }
      })

      wx.hideLoading()

      if (result.result && result.result.success) {
        wx.showToast({
          title: '充值成功',
          icon: 'success'
        })
        // 重新加载会员信息
        this.loadMemberInfo()
      } else {
        throw new Error('充值失败')
      }
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '充值失败，请重试',
        icon: 'none'
      })
    }
  },
  
  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用退出登录接口
          request.post('/api/auth/logout').then(res => {
            // 清除本地token和用户信息
            app.logout();
            
            wx.showToast({
              title: '已退出登录',
              icon: 'success',
              duration: 1500
            });
            
            // 跳转到首页
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index'
              });
            }, 1500);
          }).catch(err => {
            console.error('登出失败:', err);
            // 即使接口失败，也本地退出
            app.logout();
            
            wx.showToast({
              title: '已退出登录',
              icon: 'success',
              duration: 1500
            });
            
            // 跳转到首页
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index'
              });
            }, 1500);
          });
        }
      }
    });
  }
}) 