package com.carservice.exception;

import lombok.Getter;

/**
 * 业务异常类
 */
@Getter
public class BusinessException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 错误码
     */
    private Integer code;
    
    /**
     * 错误信息
     */
    private String message;
    
    public BusinessException(String message) {
        this.code = 400;
        this.message = message;
    }
    
    public BusinessException(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
} 