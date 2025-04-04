package com.carservice.vo;

import lombok.Data;

/**
 * 登录请求VO
 */
@Data
public class LoginRequest {
    
    /**
     * 登录类型 wechat-微信登录 phone-手机号登录
     */
    private String loginType;
    
    /**
     * 手机号，phone登录方式使用
     */
    private String phone;
    
    /**
     * 验证码，phone登录方式使用
     */
    private String verificationCode;
    
    /**
     * 微信临时登录凭证，wechat登录方式使用
     */
    private String code;
    
    /**
     * 微信用户信息，wechat登录方式使用
     */
    private String nickname;
    
    /**
     * 微信头像，wechat登录方式使用
     */
    private String avatarUrl;
    
    /**
     * 性别，wechat登录方式使用 0-未知 1-男 2-女
     */
    private Integer gender;
} 