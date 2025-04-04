const app = getApp()

Page({
  data: {
    // 筛选相关
    activeFilter: null,
    searchKey: '',
    selectedBrand: null,
    selectedBrandName: '',
    selectedWidth: null,
    selectedRatio: null,
    selectedDiameter: null,
    selectedPrice: null,
    selectedPriceLabel: '',
    selectedSeason: null,
    selectedSeasonLabel: '',
    selectedType: null,
    selectedTypeLabel: '',
    selectedFiltersCount: 0,

    // 轮胎列表
    tires: [],
    loading: true,
    showBackToTop: false,
    page: 1,
    hasMore: true,

    // 轮胎品牌
    brands: [
      { id: 1, name: '米其林', logo: '/images/brands/michelin.png' },
      { id: 2, name: '普利司通', logo: '/images/brands/bridgestone.png' },
      { id: 3, name: '固特异', logo: '/images/brands/goodyear.png' },
      { id: 4, name: '倍耐力', logo: '/images/brands/pirelli.png' },
      { id: 5, name: '马牌', logo: '/images/brands/continental.png' },
      { id: 6, name: '韩泰', logo: '/images/brands/hankook.png' },
      { id: 7, name: '邓禄普', logo: '/images/brands/dunlop.png' },
      { id: 8, name: '横滨', logo: '/images/brands/yokohama.png' }
    ],

    // 尺寸选项
    widthOptions: [175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295],
    ratioOptions: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
    diameterOptions: [14, 15, 16, 17, 18, 19, 20, 21, 22],

    // 价格选项
    priceOptions: [
      { value: '0-399', label: '399元以下' },
      { value: '400-599', label: '400-599元' },
      { value: '600-799', label: '600-799元' },
      { value: '800-999', label: '800-999元' },
      { value: '1000-1499', label: '1000-1499元' },
      { value: '1500-1999', label: '1500-1999元' },
      { value: '2000-2999', label: '2000-2999元' },
      { value: '3000-', label: '3000元以上' }
    ],

    // 季节选项
    seasonOptions: [
      { value: 'summer', label: '夏季胎' },
      { value: 'winter', label: '冬季胎' },
      { value: 'all-season', label: '四季胎' }
    ],

    // 类型选项
    typeOptions: [
      { value: 'performance', label: '性能轮胎' },
      { value: 'touring', label: '舒适型轮胎' },
      { value: 'suv', label: 'SUV/越野轮胎' },
      { value: 'economy', label: '经济型轮胎' }
    ],

    // 显示用的映射
    seasonMap: {
      'summer': '夏季胎',
      'winter': '冬季胎',
      'all-season': '四季胎'
    },
    typeMap: {
      'performance': '性能轮胎',
      'touring': '舒适型轮胎',
      'suv': 'SUV/越野轮胎',
      'economy': '经济型轮胎'
    }
  },

  onLoad(options) {
    // 如果有搜索参数，直接设置
    if (options.searchKey) {
      this.setData({ searchKey: options.searchKey })
    }
    
    // 如果有品牌参数，直接设置
    if (options.brand) {
      const brandId = parseInt(options.brand)
      this.setData({ 
        selectedBrand: brandId,
        selectedBrandName: this.getBrandNameById(brandId)
      })
      this.updateSelectedFiltersCount()
    }

    // 获取轮胎列表
    this.loadTires()
  },

  onShow() {
    // 如有必要，可以在这里刷新数据
  },

  onPullDownRefresh() {
    // 重置页码并重新加载数据
    this.setData({
      page: 1,
      hasMore: true,
      tires: []
    })
    this.loadTires().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreTires()
    }
  },

  onPageScroll(e) {
    // 滚动超过500px显示回到顶部按钮
    const showBackToTop = e.scrollTop > 500
    if (showBackToTop !== this.data.showBackToTop) {
      this.setData({ showBackToTop })
    }
  },

  // 加载轮胎列表
  async loadTires() {
    try {
      this.setData({ loading: true })
      
      // 模拟接口调用
      await this.mockLoadTires()
      
      // 真实接口调用
      // const result = await wx.cloud.callFunction({
      //   name: 'getTires',
      //   data: this.getFilterParams()
      // })
      // 
      // const { tires, hasMore } = result.result
      // this.setData({
      //   tires,
      //   hasMore,
      //   loading: false
      // })
    } catch (error) {
      console.error('加载轮胎失败', error)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    }
  },

  // 加载更多轮胎
  async loadMoreTires() {
    if (this.data.loading || !this.data.hasMore) return
    
    try {
      this.setData({
        loading: true,
        page: this.data.page + 1
      })
      
      // 模拟接口调用
      await this.mockLoadMoreTires()
      
      // 真实接口调用
      // const result = await wx.cloud.callFunction({
      //   name: 'getTires',
      //   data: {
      //     ...this.getFilterParams(),
      //     page: this.data.page
      //   }
      // })
      // 
      // const { tires, hasMore } = result.result
      // this.setData({
      //   tires: [...this.data.tires, ...tires],
      //   hasMore,
      //   loading: false
      // })
    } catch (error) {
      console.error('加载更多轮胎失败', error)
      this.setData({
        loading: false,
        page: this.data.page - 1
      })
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    }
  },

  // 获取筛选参数
  getFilterParams() {
    return {
      searchKey: this.data.searchKey,
      brand: this.data.selectedBrand,
      width: this.data.selectedWidth,
      ratio: this.data.selectedRatio,
      diameter: this.data.selectedDiameter,
      price: this.data.selectedPrice,
      season: this.data.selectedSeason,
      type: this.data.selectedType,
      page: this.data.page
    }
  },

  // 模拟加载轮胎数据
  mockLoadTires() {
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟数据
        const mockTires = [
          {
            id: 1,
            brand: '米其林',
            name: 'PRIMACY 4 浩悦四代',
            width: 225,
            ratio: 45,
            diameter: 18,
            loadIndex: '95',
            speedIndex: 'W',
            description: '静音舒适，操控稳定，排水性能优异',
            season: 'summer',
            type: 'touring',
            price: 899,
            originalPrice: 1099,
            image: '/images/tires/michelin-primacy4.png'
          },
          {
            id: 2,
            brand: '普利司通',
            name: 'TURANZA T005 泰然者',
            width: 225,
            ratio: 55,
            diameter: 17,
            loadIndex: '97',
            speedIndex: 'V',
            description: '专为豪华轿车定制，提供卓越的舒适性和安静性能',
            season: 'all-season',
            type: 'touring',
            price: 749,
            originalPrice: 899,
            image: '/images/tires/bridgestone-t005.png'
          },
          {
            id: 3,
            brand: '固特异',
            name: 'EAGLE F1 ASYMMETRIC 5 鹰驰F1',
            width: 245,
            ratio: 40,
            diameter: 19,
            loadIndex: '98',
            speedIndex: 'Y',
            description: '高性能运动轮胎，提供极致操控体验',
            season: 'summer',
            type: 'performance',
            price: 1499,
            originalPrice: 1799,
            image: '/images/tires/goodyear-eagle-f1.png'
          },
          {
            id: 4,
            brand: '倍耐力',
            name: 'P ZERO PZ4 倍耐力零系列',
            width: 255,
            ratio: 35,
            diameter: 20,
            loadIndex: '97',
            speedIndex: 'Y',
            description: '为顶级豪华跑车设计，提供极致的性能体验',
            season: 'summer',
            type: 'performance',
            price: 2499,
            originalPrice: null,
            image: '/images/tires/pirelli-pzero.png'
          },
          {
            id: 5,
            brand: '马牌',
            name: 'UltraContact UC6 德国马牌UC6',
            width: 215,
            ratio: 60,
            diameter: 16,
            loadIndex: '95',
            speedIndex: 'V',
            description: '平稳舒适，湿地性能优异',
            season: 'all-season',
            type: 'touring',
            price: 549,
            originalPrice: 699,
            image: '/images/tires/continental-uc6.png'
          }
        ]

        this.setData({
          tires: mockTires,
          hasMore: true,
          loading: false
        })
        resolve()
      }, 1000) // 模拟网络延迟
    })
  },

  // 模拟加载更多轮胎数据
  mockLoadMoreTires() {
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟第二页数据
        const page2Tires = [
          {
            id: 6,
            brand: '韩泰',
            name: 'VENTUS S1 EVO3 K127 韩泰S1 EVO3',
            width: 235,
            ratio: 45,
            diameter: 18,
            loadIndex: '94',
            speedIndex: 'Y',
            description: '兼顾性能与舒适性的高端轮胎',
            season: 'summer',
            type: 'performance',
            price: 799,
            originalPrice: 999,
            image: '/images/tires/hankook-s1evo3.png'
          },
          {
            id: 7,
            brand: '邓禄普',
            name: 'SPORT MAXX 050+ 邓禄普极速50+',
            width: 245,
            ratio: 45,
            diameter: 19,
            loadIndex: '98',
            speedIndex: 'Y',
            description: '专为高性能运动轿车设计，提供卓越的操控性',
            season: 'summer',
            type: 'performance',
            price: 1099,
            originalPrice: 1299,
            image: '/images/tires/dunlop-sportmaxx.png'
          },
          {
            id: 8,
            brand: '横滨',
            name: 'ADVAN SPORT V105 横滨V105',
            width: 265,
            ratio: 40,
            diameter: 19,
            loadIndex: '102',
            speedIndex: 'Y',
            description: '为顶级性能车型设计，提供极致的抓地力和操控响应',
            season: 'summer',
            type: 'performance',
            price: 1799,
            originalPrice: 2099,
            image: '/images/tires/yokohama-v105.png'
          }
        ]

        this.setData({
          tires: [...this.data.tires, ...page2Tires],
          hasMore: false, // 第二页后没有更多数据
          loading: false
        })
        resolve()
      }, 1000) // 模拟网络延迟
    })
  },

  // 搜索相关方法
  onSearchInput(e) {
    this.setData({ searchKey: e.detail.value })
  },

  onSearch() {
    this.resetTiresAndSearch()
  },

  clearSearch() {
    this.setData({ searchKey: '' })
    this.resetTiresAndSearch()
  },

  // 筛选相关方法
  toggleFilter(e) {
    const filter = e.currentTarget.dataset.filter
    const { activeFilter } = this.data
    
    // 如果点击当前筛选项，则关闭面板；否则打开对应筛选项
    this.setData({
      activeFilter: activeFilter === filter ? null : filter
    })
  },

  // 品牌筛选
  selectBrand(e) {
    const id = e.currentTarget.dataset.id
    const isDeselecting = this.data.selectedBrand === id
    const selectedBrand = isDeselecting ? null : id
    const selectedBrandName = isDeselecting ? '' : this.getBrandNameById(id)
    
    this.setData({
      selectedBrand,
      selectedBrandName
    })
  },

  // 根据品牌ID获取品牌名称
  getBrandNameById(id) {
    const brand = this.data.brands.find(b => b.id === id)
    return brand ? brand.name : ''
  },

  // 尺寸筛选 - 宽度
  selectWidth(e) {
    const width = e.currentTarget.dataset.width
    this.setData({
      selectedWidth: this.data.selectedWidth === width ? null : width
    })
  },

  // 尺寸筛选 - 扁平比
  selectRatio(e) {
    const ratio = e.currentTarget.dataset.ratio
    this.setData({
      selectedRatio: this.data.selectedRatio === ratio ? null : ratio
    })
  },

  // 尺寸筛选 - 直径
  selectDiameter(e) {
    const diameter = e.currentTarget.dataset.diameter
    this.setData({
      selectedDiameter: this.data.selectedDiameter === diameter ? null : diameter
    })
  },

  // 价格筛选
  selectPrice(e) {
    const price = e.currentTarget.dataset.price
    const isDeselecting = this.data.selectedPrice === price
    const selectedPrice = isDeselecting ? null : price
    const selectedPriceLabel = isDeselecting ? '' : this.getPriceLabelByValue(price)
    
    this.setData({
      selectedPrice,
      selectedPriceLabel
    })
  },

  // 根据价格值获取价格标签
  getPriceLabelByValue(value) {
    const option = this.data.priceOptions.find(p => p.value === value)
    return option ? option.label : ''
  },

  // 季节筛选
  selectSeason(e) {
    const season = e.currentTarget.dataset.season
    const isDeselecting = this.data.selectedSeason === season
    const selectedSeason = isDeselecting ? null : season
    const selectedSeasonLabel = isDeselecting ? '' : this.getSeasonLabelByValue(season)
    
    this.setData({
      selectedSeason,
      selectedSeasonLabel
    })
  },

  // 根据季节值获取季节标签
  getSeasonLabelByValue(value) {
    const option = this.data.seasonOptions.find(s => s.value === value)
    return option ? option.label : ''
  },

  // 类型筛选
  selectType(e) {
    const type = e.currentTarget.dataset.type
    const isDeselecting = this.data.selectedType === type
    const selectedType = isDeselecting ? null : type
    const selectedTypeLabel = isDeselecting ? '' : this.getTypeLabelByValue(type)
    
    this.setData({
      selectedType,
      selectedTypeLabel
    })
  },

  // 根据类型值获取类型标签
  getTypeLabelByValue(value) {
    const option = this.data.typeOptions.find(t => t.value === value)
    return option ? option.label : ''
  },

  // 重置当前筛选
  resetFilter() {
    const { activeFilter } = this.data
    
    // 根据当前活动的筛选类型重置相应的筛选条件
    switch (activeFilter) {
      case 'brand':
        this.setData({ 
          selectedBrand: null,
          selectedBrandName: ''
        })
        break
      case 'size':
        this.setData({
          selectedWidth: null,
          selectedRatio: null,
          selectedDiameter: null
        })
        break
      case 'price':
        this.setData({ 
          selectedPrice: null,
          selectedPriceLabel: ''
        })
        break
      case 'season':
        this.setData({ 
          selectedSeason: null,
          selectedSeasonLabel: ''
        })
        break
      case 'type':
        this.setData({ 
          selectedType: null,
          selectedTypeLabel: ''
        })
        break
    }
  },

  // 确认筛选
  confirmFilter() {
    // 更新标签显示名称
    if (this.data.selectedBrand !== null) {
      this.setData({
        selectedBrandName: this.getBrandNameById(this.data.selectedBrand)
      })
    }
    
    if (this.data.selectedPrice !== null) {
      this.setData({
        selectedPriceLabel: this.getPriceLabelByValue(this.data.selectedPrice)
      })
    }
    
    if (this.data.selectedSeason !== null) {
      this.setData({
        selectedSeasonLabel: this.getSeasonLabelByValue(this.data.selectedSeason)
      })
    }
    
    if (this.data.selectedType !== null) {
      this.setData({
        selectedTypeLabel: this.getTypeLabelByValue(this.data.selectedType)
      })
    }
    
    // 更新筛选条件数量
    this.updateSelectedFiltersCount()
    
    // 关闭筛选面板
    this.setData({ activeFilter: null })
    
    // 重置列表并应用筛选条件
    this.resetTiresAndSearch()
  },

  // 清除单个筛选条件
  clearBrand() {
    this.setData({ 
      selectedBrand: null,
      selectedBrandName: ''
    })
    this.updateSelectedFiltersCount()
    this.resetTiresAndSearch()
  },

  clearWidth() {
    this.setData({ selectedWidth: null })
    this.updateSelectedFiltersCount()
    this.resetTiresAndSearch()
  },

  clearRatio() {
    this.setData({ selectedRatio: null })
    this.updateSelectedFiltersCount()
    this.resetTiresAndSearch()
  },

  clearDiameter() {
    this.setData({ selectedDiameter: null })
    this.updateSelectedFiltersCount()
    this.resetTiresAndSearch()
  },

  clearPrice() {
    this.setData({ 
      selectedPrice: null,
      selectedPriceLabel: ''
    })
    this.updateSelectedFiltersCount()
    this.resetTiresAndSearch()
  },

  clearSeason() {
    this.setData({ 
      selectedSeason: null,
      selectedSeasonLabel: ''
    })
    this.updateSelectedFiltersCount()
    this.resetTiresAndSearch()
  },

  clearType() {
    this.setData({ 
      selectedType: null,
      selectedTypeLabel: ''
    })
    this.updateSelectedFiltersCount()
    this.resetTiresAndSearch()
  },

  // 清除所有筛选条件
  clearAllFilters() {
    this.setData({
      selectedBrand: null,
      selectedBrandName: '',
      selectedWidth: null,
      selectedRatio: null,
      selectedDiameter: null,
      selectedPrice: null,
      selectedPriceLabel: '',
      selectedSeason: null,
      selectedSeasonLabel: '',
      selectedType: null,
      selectedTypeLabel: '',
      selectedFiltersCount: 0
    })
    this.resetTiresAndSearch()
  },

  // 更新已选筛选条件数量
  updateSelectedFiltersCount() {
    const {
      selectedBrand,
      selectedWidth,
      selectedRatio,
      selectedDiameter,
      selectedPrice,
      selectedSeason,
      selectedType
    } = this.data
    
    let count = 0
    if (selectedBrand !== null) count++
    if (selectedWidth !== null) count++
    if (selectedRatio !== null) count++
    if (selectedDiameter !== null) count++
    if (selectedPrice !== null) count++
    if (selectedSeason !== null) count++
    if (selectedType !== null) count++
    
    this.setData({ selectedFiltersCount: count })
  },

  // 重置轮胎列表并搜索
  resetTiresAndSearch() {
    this.setData({
      page: 1,
      tires: [],
      hasMore: true
    })
    this.loadTires()
  },

  // 导航到轮胎详情页
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/tire/detail/detail?id=${id}`
    })
  },

  // 回到顶部
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
}) 