const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    service: null,
    loading: true,
    id: null
  },

  onLoad(options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getServiceDetail(options.id)
    }
  },

  getServiceDetail(id) {
    // 模拟数据，实际开发中应该从API获取
    const serviceData = {
      id: id,
      name: id == 1 ? '节能环保机油' : 
            id == 2 ? '高性能刹车片' : 
            '空调清洗套餐',
      desc: id == 1 ? '5W-30 全合成机油，提供卓越的发动机保护' : 
            id == 2 ? '适用于多种车型，提供更佳制动性能' : 
            '彻底清除异味，杀菌消毒，恢复空调清新',
      price: id == 1 ? 329 : id == 2 ? 499 : 198,
      oldPrice: id == 1 ? 399 : id == 2 ? 599 : 258,
      description: id == 1 ? '采用先进技术研发的全合成机油，能有效减少发动机磨损，提高燃油效率，延长换油周期。适用于各种路况和气候条件，提供卓越的发动机保护。' :
                 id == 2 ? '采用高性能陶瓷材料，具有出色的制动性能和耐久性。低噪音、低粉尘设计，适用于多种车型，安装简便，提供更稳定的制动体验。' :
                 '专业设备深度清洁空调系统，去除细菌、霉菌和异味。使用环保清洁剂，对车内环境无害。包含空调滤芯更换，确保空气清新健康。',
      features: id == 1 ? [
        '优质全合成配方',
        '提供卓越的发动机保护',
        '提高燃油效率',
        '延长换油周期'
      ] : id == 2 ? [
        '高性能陶瓷材料',
        '低噪音、低粉尘设计',
        '出色的制动性能',
        '适用于多种车型'
      ] : [
        '深度清洁空调系统',
        '去除细菌、霉菌和异味',
        '使用环保清洁剂',
        '包含空调滤芯更换'
      ],
      specifications: id == 1 ? [
        {name: '类型', value: '全合成机油'},
        {name: '粘度等级', value: '5W-30'},
        {name: '容量', value: '4L'},
        {name: '适用发动机', value: '汽油/柴油发动机'}
      ] : id == 2 ? [
        {name: '材质', value: '高性能陶瓷'},
        {name: '适用位置', value: '前轮/后轮'},
        {name: '噪音等级', value: '低'},
        {name: '适用车型', value: '多种车型'}
      ] : [
        {name: '服务时长', value: '约60分钟'},
        {name: '清洁范围', value: '整个空调系统'},
        {name: '含滤芯更换', value: '是'},
        {name: '保修期', value: '3个月'}
      ],
      rating: 4.7,
      reviews: 156,
      soldCount: 521
    }

    // 模拟API请求延迟
    setTimeout(() => {
      this.setData({
        service: serviceData,
        loading: false
      })
    }, 500)
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
      url: `/pages/appointment/create/create?serviceId=${this.data.id}&serviceName=${this.data.service.name}`
    })
  }
}) 