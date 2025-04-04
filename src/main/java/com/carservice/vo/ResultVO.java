package com.carservice.vo;

import lombok.Data;

/**
 * 统一返回结果
 */
@Data
public class ResultVO<T> {
    /**
     * 状态码，0表示成功
     */
    private Integer code;
    
    /**
     * 返回信息
     */
    private String message;
    
    /**
     * 返回数据
     */
    private T data;
    
    /**
     * 成功返回结果
     */
    public static <T> ResultVO<T> success(T data) {
        ResultVO<T> resultVO = new ResultVO<>();
        resultVO.setCode(0);
        resultVO.setMessage("success");
        resultVO.setData(data);
        return resultVO;
    }
    
    /**
     * 成功返回结果
     */
    public static <T> ResultVO<T> success(String message, T data) {
        ResultVO<T> resultVO = new ResultVO<>();
        resultVO.setCode(0);
        resultVO.setMessage(message);
        resultVO.setData(data);
        return resultVO;
    }
    
    /**
     * 失败返回结果
     */
    public static <T> ResultVO<T> error(Integer code, String message) {
        ResultVO<T> resultVO = new ResultVO<>();
        resultVO.setCode(code);
        resultVO.setMessage(message);
        return resultVO;
    }
} 