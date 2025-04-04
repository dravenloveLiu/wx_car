// pages/tire/tire.js
const app = getApp()
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    tires: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadTires()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  loadTires() {
    // 模拟数据，实际开发中应该从API获取
    const tireData = [
      {
        id: 1,
        name: '米其林轮胎 PRIMACY 4 ST',
        spec: '215/55R17 94V',
        price: 688,
        oldPrice: 799,
        brand: '米其林',
        image: '',
        rating: 4.8,
        reviews: 245,
        sold: 612
      },
      {
        id: 2,
        name: '普利司通轮胎 TURANZA T005',
        spec: '225/45R17 91W',
        price: 599,
        oldPrice: 699,
        brand: '普利司通',
        image: '',
        rating: 4.7,
        reviews: 182,
        sold: 578
      },
      {
        id: 3,
        name: '固特异轮胎 EAGLE F1 ASYMMETRIC 5',
        spec: '225/45R17 91Y',
        price: 729,
        oldPrice: 899,
        brand: '固特异',
        image: '',
        rating: 4.9,
        reviews: 136,
        sold: 429
      },
      {
        id: 4,
        name: '马牌轮胎 UltraContact UC6',
        spec: '215/60R16 95V',
        price: 539,
        oldPrice: 639,
        brand: '马牌',
        image: '',
        rating: 4.7,
        reviews: 158,
        sold: 382
      },
      {
        id: 5,
        name: '倍耐力轮胎 P7 Cinturato',
        spec: '225/50R17 98Y',
        price: 659,
        oldPrice: 759,
        brand: '倍耐力',
        image: '',
        rating: 4.6,
        reviews: 112,
        sold: 296
      },
      {
        id: 6,
        name: '韩泰轮胎 Ventus S1 evo3',
        spec: '225/45R18 95Y',
        price: 499,
        oldPrice: 599,
        brand: '韩泰',
        image: '',
        rating: 4.5,
        reviews: 97,
        sold: 258
      }
    ]

    // 模拟API请求延迟
    setTimeout(() => {
      this.setData({
        tires: tireData,
        loading: false
      })
    }, 500)
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/tire/detail?id=${id}`
    })
  }
})