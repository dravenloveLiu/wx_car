package com.carservice.vo;

import lombok.Data;
import com.carservice.entity.User;

/**
 * 登录返回对象
 */
@Data
public class LoginVO {
    /**
     * 用户token
     */
    private String token;
    
    /**
     * 用户信息
     */
    private User userInfo;
} 