const app = getApp()
const request = require('../../utils/request.js')

Page({
  data: {
    keyword: '',
    searchHistory: [],
    searchResults: [],
    showHistory: true,
    hotKeywords: ['轮胎', '机油', '保养', '电池', '空调'],
    searching: false,
    noResult: false
  },

  onLoad: function() {
    // 加载本地存储的搜索历史
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({
      searchHistory: history
    })
  },

  // 输入关键词
  inputKeyword: function(e) {
    const keyword = e.detail.value
    this.setData({
      keyword: keyword,
      showHistory: keyword.length === 0
    })
  },
  
  // 清空关键词
  clearKeyword: function() {
    this.setData({
      keyword: '',
      showHistory: true
    })
  },

  // 搜索
  search: function(e) {
    let keyword = this.data.keyword
    
    // 如果是点击历史记录或热门关键词
    if (e && e.currentTarget && e.currentTarget.dataset.keyword) {
      keyword = e.currentTarget.dataset.keyword
      this.setData({
        keyword: keyword
      })
    }
    
    if (!keyword || keyword.trim() === '') {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      })
      return
    }
    
    // 显示搜索中
    this.setData({
      searching: true,
      showHistory: false,
      noResult: false
    })
    
    // 添加到搜索历史
    this.addToHistory(keyword)
    
    // 调用搜索API
    request.get('/api/search', {
      keyword: keyword
    }, true, false).then(res => {
      if (res.code === 0) {
        this.setData({
          searchResults: res.data,
          searching: false,
          noResult: res.data.length === 0
        })
      } else {
        this.handleSearchError()
      }
    }).catch(err => {
      console.error('搜索失败', err)
      this.handleSearchError()
    })
  },
  
  // 处理搜索错误
  handleSearchError: function() {
    this.setData({
      searching: false,
      noResult: true
    })
    wx.showToast({
      title: '搜索失败，请重试',
      icon: 'none'
    })
  },
  
  // 添加到搜索历史
  addToHistory: function(keyword) {
    let history = this.data.searchHistory
    
    // 如果已存在，先移除
    history = history.filter(item => item !== keyword)
    
    // 添加到最前面
    history.unshift(keyword)
    
    // 限制最多保存10条历史记录
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    
    // 更新页面数据和本地存储
    this.setData({
      searchHistory: history
    })
    wx.setStorageSync('searchHistory', history)
  },
  
  // 清空历史记录
  clearHistory: function() {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            searchHistory: []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
    })
  },
  
  // 跳转到搜索结果详情
  goToDetail: function(e) {
    const item = e.currentTarget.dataset.item
    if (!item || !item.type || !item.id) return
    
    let url = ''
    
    // 根据不同类型跳转到不同页面
    switch(item.type) {
      case 'service':
        url = `/pages/service/detail?id=${item.id}`
        break
      case 'tire':
        url = `/pages/tire/detail?id=${item.id}`
        break
      case 'store':
        url = `/pages/store/detail?id=${item.id}`
        break
      default:
        return
    }
    
    wx.navigateTo({
      url: url
    })
  }
}) 