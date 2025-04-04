const app = getApp()

/**
 * 显示请求错误提示
 * @param {string} message 错误信息
 */
const showError = (message) => {
  wx.showToast({
    title: message || '请求失败',
    icon: 'none',
    duration: 2000
  })
}

/**
 * 通用请求方法
 * @param {string} url 请求路径
 * @param {string} method 请求方法
 * @param {object} data 请求数据
 * @param {boolean} showLoading 是否显示加载提示
 * @param {boolean} showErrorToast 是否显示错误提示
 */
const request = (url, method, data, showLoading = true, showErrorToast = true) => {
  // 显示加载中
  if (showLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  }

  // 获取app实例
  const app = getApp()
  
  // 开发环境模拟数据代码已删除，使用真实API调用

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': app.globalData.token || ''
      },
      success: (res) => {
        if (showLoading) {
          wx.hideLoading()
        }
        
        // 处理HTTP状态码
        if (res.statusCode === 200) {
          // HTTP请求成功，再检查业务状态码
          // ResultVO格式: {code: 0, message: 'success', data: {...}}
          if (res.data.code === 0) {
            // 业务处理成功
            resolve(res.data)
          } else {
            // 业务处理失败
            if (showErrorToast) {
              wx.showToast({
                title: res.data.message || '业务处理失败',
                icon: 'none'
              })
            }
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // 未授权，需要登录
          if (showErrorToast) {
            wx.showToast({
              title: '请先登录',
              icon: 'none'
            })
          }
          // 清除登录状态
          app.globalData.isLogin = false
          app.globalData.token = ''
          
          // 跳转到登录页
          wx.navigateTo({
            url: '/pages/login/index'
          })
          
          reject(res)
        } else {
          // 其他HTTP错误
          if (showErrorToast) {
            wx.showToast({
              title: res.data.message || `请求失败(${res.statusCode})`,
              icon: 'none'
            })
          }
          reject(res)
        }
      },
      fail: (err) => {
        if (showLoading) {
          wx.hideLoading()
        }
        
        if (showErrorToast) {
          wx.showToast({
            title: '网络异常，请稍后再试',
            icon: 'none'
          })
        }
        
        reject(err)
      }
    })
  })
}

const get = (url, data = {}, showLoading = true, showErrorToast = true) => {
  return request(url, 'GET', data, showLoading, showErrorToast)
}

const post = (url, data = {}, showLoading = true, showErrorToast = true) => {
  return request(url, 'POST', data, showLoading, showErrorToast)
}

const put = (url, data = {}, showLoading = true, showErrorToast = true) => {
  return request(url, 'PUT', data, showLoading, showErrorToast)
}

const del = (url, data = {}, showLoading = true, showErrorToast = true) => {
  return request(url, 'DELETE', data, showLoading, showErrorToast)
}

// 上传文件
const upload = (url, filePath, name = 'file', formData = {}) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${app.globalData.baseUrl}${url}`,
      filePath: filePath,
      name: name,
      formData: formData,
      header: {
        'Authorization': app.globalData.token ? `Bearer ${app.globalData.token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 注意：wx.uploadFile返回的data是string类型，需要转换为对象
          const data = JSON.parse(res.data)
          resolve(data)
        } else if (res.statusCode === 401) {
          // token失效，需要重新登录
          wx.removeStorageSync('token')
          app.globalData.isLogin = false
          app.globalData.token = ''
          app.globalData.userInfo = null

          wx.showModal({
            title: '提示',
            content: '登录已过期，请重新登录',
            showCancel: false,
            success: () => {
              wx.navigateTo({
                url: '/pages/auth/auth'
              })
            }
          })
          reject(new Error('未登录或登录已过期'))
        } else {
          showError('上传失败')
          reject(res)
        }
      },
      fail: (err) => {
        showError('网络异常，请检查网络连接')
        reject(err)
      }
    })
  })
}

module.exports = {
  get,
  post,
  put,
  delete: del,
  upload
} 