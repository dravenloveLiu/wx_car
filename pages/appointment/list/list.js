Page({
  data: {
    appointments: [],
    loading: true
  },

  onLoad() {
    this.loadAppointments()
  },

  onPullDownRefresh() {
    this.loadAppointments()
  },

  // 加载预约列表
  async loadAppointments() {
    try {
      this.setData({ loading: true })
      
      const result = await wx.cloud.callFunction({
        name: 'getAppointments'
      })

      if (result.result && result.result.data) {
        this.setData({
          appointments: result.result.data.sort((a, b) => {
            // 按日期时间倒序排序
            const dateA = new Date(`${a.date} ${a.time}`)
            const dateB = new Date(`${b.date} ${b.time}`)
            return dateB - dateA
          })
        })
      }
    } catch (error) {
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
    }
  },

  // 取消预约
  async cancelAppointment(e) {
    const { id } = e.currentTarget.dataset
    
    try {
      const res = await wx.showModal({
        title: '提示',
        content: '确定要取消这个预约吗？',
        confirmText: '确定取消'
      })

      if (res.confirm) {
        wx.showLoading({
          title: '取消中...'
        })

        const result = await wx.cloud.callFunction({
          name: 'updateAppointment',
          data: {
            id,
            status: '已取消'
          }
        })

        wx.hideLoading()

        if (result.result && result.result.success) {
          wx.showToast({
            title: '已取消预约',
            icon: 'success'
          })
          // 重新加载列表
          this.loadAppointments()
        } else {
          throw new Error('取消失败')
        }
      }
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      })
    }
  },

  // 获取状态对应的样式类
  getStatusClass(status) {
    const statusMap = {
      '待确认': 'status-pending',
      '已确认': 'status-confirmed',
      '已完成': 'status-completed',
      '已取消': 'status-cancelled'
    }
    return statusMap[status] || 'status-pending'
  }
}) 