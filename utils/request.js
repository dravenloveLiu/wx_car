const app = getApp()

const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        'Authorization': app.globalData.token ? `Bearer ${app.globalData.token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // token失效，需要重新登录
          wx.removeStorageSync('token')
          app.globalData.isLogin = false
          wx.navigateTo({
            url: '/pages/auth/auth'
          })
          reject(new Error('未登录或登录已过期'))
        } else {
          reject(res.data)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

const get = (url, data = {}) => {
  return request(url, 'GET', data)
}

const post = (url, data = {}) => {
  return request(url, 'POST', data)
}

const put = (url, data = {}) => {
  return request(url, 'PUT', data)
}

const del = (url, data = {}) => {
  return request(url, 'DELETE', data)
}

module.exports = {
  get,
  post,
  put,
  delete: del
} 