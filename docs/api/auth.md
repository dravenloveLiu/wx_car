# 身份认证API文档

## 登录接口

### 微信登录

**接口地址**: `/api/auth/login`

**请求方式**: POST

**请求参数**:

```json
{
  "loginType": "wechat",
  "code": "微信授权code",
  "nickname": "用户昵称",
  "avatarUrl": "头像URL",
  "gender": 1
}
```

**响应结果**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "phone": null,
      "nickname": "张三",
      "avatar": "https://example.com/avatar.jpg",
      "gender": 1,
      "openId": "oX8wt5Fyk9gER_UGwvDCBa6c1F_I",
      "memberLevel": 0,
      "points": 0,
      "registerTime": "2023-04-05T10:30:45"
    },
    "isNewUser": false
  }
}
```

### 手机号登录

**接口地址**: `/api/auth/login`

**请求方式**: POST

**请求参数**:

```json
{
  "loginType": "phone",
  "phone": "13800138000",
  "verificationCode": "123456"
}
```

**响应结果**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "phone": "13800138000",
      "nickname": "用户8000",
      "avatar": null,
      "gender": 0,
      "openId": null,
      "memberLevel": 0,
      "points": 0,
      "registerTime": "2023-04-05T10:30:45"
    },
    "isNewUser": false
  }
}
```

## 如何使用JWT令牌

1. 登录成功后，系统会返回JWT令牌(token)，格式为：`Bearer {token内容}`

2. 后续所有需要认证的请求，都需要在请求头中携带此令牌：

   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. 令牌有效期为24小时，过期后需要重新登录获取新令牌

4. 如果请求返回401状态码，说明令牌已过期或无效，需要重新登录

## 前端示例代码

```javascript
// 保存token
function saveToken(token) {
  wx.setStorageSync('token', token);
}

// 添加请求拦截器，自动携带token
const request = (options) => {
  const token = wx.getStorageSync('token');
  if (token) {
    options.header = {
      ...options.header,
      'Authorization': token  // 已经包含Bearer前缀
    };
  }
  return wx.request(options);
};

// 响应拦截器示例：处理token过期
function handleResponse(res) {
  if (res.statusCode === 401) {
    // token过期，跳转到登录页
    wx.removeStorageSync('token');
    wx.navigateTo({
      url: '/pages/login/index'
    });
  }
  return res;
}
``` 