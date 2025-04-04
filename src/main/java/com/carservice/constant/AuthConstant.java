package com.carservice.constant;

/**
 * 认证相关常量
 */
public class AuthConstant {
    
    /**
     * 短信验证码前缀
     */
    public static final String SMS_CODE_CACHE_PREFIX = "sms:code:";
    
    /**
     * 登录用户标识前缀
     */
    public static final String LOGIN_USER_KEY = "login:token:";
    
    /**
     * 登录用户token过期时间（30天）
     */
    public static final Long LOGIN_USER_TTL = 30L * 24 * 60 * 60;
} 