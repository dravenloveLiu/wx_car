package com.carservice.service;

import java.util.Map;

/**
 * 认证服务接口
 */
public interface AuthService {
    
    /**
     * 微信登录 - 使用code换取用户openid和session_key
     * 
     * @param code 微信小程序登录时获取的code
     * @return 包含openid和session_key的Map
     */
    Map<String, String> code2Session(String code);
    
    /**
     * 验证短信验证码
     * 
     * @param phone 手机号
     * @param code 验证码
     * @return 是否验证通过
     */
    boolean verifyCode(String phone, String code);
    
    /**
     * 保存验证码
     * 
     * @param phone 手机号
     * @param code 验证码
     */
    void saveCode(String phone, String code);
    
    /**
     * 发送短信验证码
     * 
     * @param phone 手机号
     * @param code 验证码
     * @return 是否发送成功
     */
    boolean sendSms(String phone, String code);
} 