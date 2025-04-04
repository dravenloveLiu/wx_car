package com.carservice.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final String code;

    public BusinessException(String message) {
        super(message);
        this.code = "500";
    }

    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }
} 