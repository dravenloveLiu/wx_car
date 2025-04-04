package com.carservice.dto;

import lombok.Data;

/**
 * 登录参数对象
 */
@Data
public class LoginDTO {
    /**
     * 手机号
     */
    private String phone;
    
    /**
     * 验证码
     */
    private String code;
    
    /**
     * 微信code，用于获取openId
     */
    private String wxCode;
    
    /**
     * 微信昵称
     */
    private String nickname;
    
    /**
     * 微信头像URL
     */
    private String avatarUrl;
    
    /**
     * 姓名
     */
    private String name;
    
    /**
     * 性别，0：未知，1：男，2：女
     */
    private Integer gender;
    
    /**
     * 车辆信息
     */
    private String carInfo;
} 