package com.carservice.vo;

import lombok.Data;

/**
 * 发送验证码请求参数
 */
@Data
public class SendCodeRequest {
    
    /**
     * 手机号
     */
    private String phone;
} 