const app = getApp()

Page({
  data: {
    stores: [],
    loading: true
  },

  onLoad(options) {
    this.getStores()
  },

  getStores() {
    // 模拟获取门店列表数据
    const storeData = [
      {
        id: 1,
        name: '北京海淀总店',
        address: '北京市海淀区西三环北路25号',
        phone: '010-12345678',
        hours: '09:00-18:00',
        distance: '1.5',
        latitude: 39.98123,
        longitude: 116.32123
      },
      {
        id: 2,
        name: '北京朝阳分店',
        address: '北京市朝阳区建国路88号',
        phone: '010-87654321',
        hours: '09:00-19:00',
        distance: '5.2',
        latitude: 39.90876,
        longitude: 116.46789
      },
      {
        id: 3,
        name: '北京丰台分店',
        address: '北京市丰台区丰台路6号',
        phone: '010-67891234',
        hours: '08:30-18:30',
        distance: '8.7',
        latitude: 39.85234,
        longitude: 116.30567
      },
      {
        id: 4,
        name: '北京昌平分店',
        address: '北京市昌平区回龙观东大街',
        phone: '010-56781234',
        hours: '09:00-18:00',
        distance: '15.3',
        latitude: 40.10987,
        longitude: 116.34321
      }
    ]

    // 模拟网络延迟
    setTimeout(() => {
      this.setData({
        stores: storeData,
        loading: false
      })
    }, 500)
  },

  // 点击门店导航
  navigateToStore(e) {
    const index = e.currentTarget.dataset.index
    const store = this.data.stores[index]
    // 使用微信内置地图导航
    wx.openLocation({
      latitude: store.latitude,
      longitude: store.longitude,
      name: store.name,
      address: store.address,
      scale: 18
    })
  },

  // 点击拨打电话
  callStore(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  }
}) 