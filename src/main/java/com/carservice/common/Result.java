package com.carservice.common;

import lombok.Data;

import java.io.Serializable;

@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private String code;
    private String message;
    private T data;

    public static <T> Result<T> success() {
        return success(null);
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode("200");
        result.setMessage("操作成功");
        result.setData(data);
        return result;
    }

    public static <T> Result<T> error() {
        return error("500", "操作失败");
    }

    public static <T> Result<T> error(String message) {
        return error("500", message);
    }

    public static <T> Result<T> error(String code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }
} 