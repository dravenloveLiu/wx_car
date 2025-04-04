const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    keyword: '',
    searching: false,
    results: [],
    historySearches: [],
    hotSearches: ['轮胎更换', '机油保养', '刹车片', '空调清洗', '汽车打蜡']
  },

  onLoad() {
    this.getHistorySearches()
  },

  // 获取历史搜索记录
  getHistorySearches() {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({
      historySearches: history
    })
  },

  // 输入搜索关键词
  onInput(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  // 清空输入框
  clearInput() {
    this.setData({
      keyword: '',
      results: []
    })
  },

  // 执行搜索
  doSearch() {
    const { keyword } = this.data
    if (!keyword.trim()) {
      return
    }

    // 记录搜索历史
    this.saveSearchHistory(keyword)

    // 显示加载状态
    this.setData({
      searching: true
    })

    // 模拟搜索请求
    setTimeout(() => {
      // 模拟搜索结果
      const results = this.getSearchResults(keyword)
      
      this.setData({
        results,
        searching: false
      })
    }, 500)
  },

  // 点击搜索历史或热门搜索
  tapSearch(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({
      keyword
    }, () => {
      this.doSearch()
    })
  },

  // 保存搜索历史
  saveSearchHistory(keyword) {
    let history = wx.getStorageSync('searchHistory') || []
    
    // 如果已存在相同关键词，先移除
    history = history.filter(item => item !== keyword)
    
    // 添加到开头
    history.unshift(keyword)
    
    // 限制历史记录数量，最多保存10条
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    
    wx.setStorageSync('searchHistory', history)
    
    this.setData({
      historySearches: history
    })
  },

  // 清空搜索历史
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空搜索历史？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory')
          this.setData({
            historySearches: []
          })
        }
      }
    })
  },

  // 模拟获取搜索结果
  getSearchResults(keyword) {
    // 实际应用中应该调用后端API进行搜索
    const services = [
      { id: 1, type: 'service', name: '机油更换服务', price: 329, desc: '全合成机油更换，专业服务' },
      { id: 2, type: 'service', name: '轮胎更换服务', price: 150, desc: '专业轮胎安装，动平衡调整' },
      { id: 3, type: 'service', name: '刹车系统保养', price: 499, desc: '刹车片更换，刹车油检查' },
      { id: 4, type: 'service', name: '空调系统清洗', price: 198, desc: '空调系统深度清洁，除菌除异味' }
    ]
    
    const tires = [
      { id: 1, type: 'tire', name: '米其林轮胎 PRIMACY 4 ST', price: 688, spec: '215/55R17 94V' },
      { id: 2, type: 'tire', name: '普利司通轮胎 TURANZA T005', price: 599, spec: '225/45R17 91W' },
      { id: 3, type: 'tire', name: '固特异轮胎 EAGLE F1', price: 729, spec: '225/45R17 91Y' }
    ]
    
    const parts = [
      { id: 1, type: 'part', name: '博世刹车片', price: 499, spec: '适用多种车型' },
      { id: 2, type: 'part', name: '壳牌全合成机油', price: 329, spec: '5W-30 4L装' },
      { id: 3, type: 'part', name: '曼牌空气滤清器', price: 89, spec: '适用大众、奥迪系列' }
    ]
    
    // 合并所有数据并根据关键词筛选
    const allData = [...services, ...tires, ...parts]
    
    return allData.filter(item => 
      item.name.toLowerCase().includes(keyword.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(keyword.toLowerCase())) ||
      (item.spec && item.spec.toLowerCase().includes(keyword.toLowerCase()))
    )
  },

  // 点击搜索结果
  tapResult(e) {
    const { id, type } = e.currentTarget.dataset.item
    
    // 根据类型和ID跳转到不同页面
    let url = ''
    
    if (type === 'service') {
      url = `/pages/service/detail?id=${id}`
    } else if (type === 'tire') {
      url = `/pages/tire/detail?id=${id}`
    } else if (type === 'part') {
      url = `/pages/part/detail?id=${id}`
    }
    
    if (url) {
      wx.navigateTo({
        url
      })
    }
  }
}) 