package com.carservice.common;

/**
 * 认证相关常量
 */
public interface AuthConstant {
    
    /**
     * 短信验证码Redis前缀
     */
    String SMS_CODE_CACHE_PREFIX = "sms:code:";
    
    /**
     * JWT令牌请求头
     */
    String AUTHORIZATION_HEADER = "Authorization";
    
    /**
     * JWT令牌前缀
     */
    String TOKEN_PREFIX = "Bearer ";
    
    /**
     * 微信登录类型
     */
    String LOGIN_TYPE_WECHAT = "wechat";
    
    /**
     * 手机号登录类型
     */
    String LOGIN_TYPE_PHONE = "phone";
}
