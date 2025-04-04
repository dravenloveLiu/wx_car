const request = require('../../utils/request.js')

Page({
  data: {
    brands: [],
    selectedBrand: null,
    carTypes: [],
    selectedCarType: null,
    tires: [],
    loading: false,
    page: 1,
    hasMore: true
  },

  onLoad() {
    this.getBrands()
    this.getCarTypes()
    this.getTires()
  },

  getBrands() {
    request.get('/api/tire/brands').then(res => {
      this.setData({
        brands: res.data
      })
    })
  },

  getCarTypes() {
    request.get('/api/car/types').then(res => {
      this.setData({
        carTypes: res.data
      })
    })
  },

  getTires(reset = false) {
    if (this.data.loading || (!this.data.hasMore && !reset)) return

    this.setData({ loading: true })
    
    const params = {
      page: reset ? 1 : this.data.page,
      brandId: this.data.selectedBrand ? this.data.selectedBrand.id : null,
      carTypeId: this.data.selectedCarType ? this.data.selectedCarType.id : null
    }

    request.get('/api/tires', params).then(res => {
      const tires = reset ? res.data.list : [...this.data.tires, ...res.data.list]
      this.setData({
        tires,
        loading: false,
        page: reset ? 2 : this.data.page + 1,
        hasMore: res.data.hasMore
      })
    }).catch(() => {
      this.setData({ loading: false })
    })
  },

  selectBrand(e) {
    const brand = e.currentTarget.dataset.brand
    this.setData({
      selectedBrand: this.data.selectedBrand?.id === brand.id ? null : brand
    })
    this.getTires(true)
  },

  selectCarType(e) {
    const carType = e.currentTarget.dataset.carType
    this.setData({
      selectedCarType: this.data.selectedCarType?.id === carType.id ? null : carType
    })
    this.getTires(true)
  },

  onReachBottom() {
    this.getTires()
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/tire/detail?id=${id}`
    })
  }
}) 