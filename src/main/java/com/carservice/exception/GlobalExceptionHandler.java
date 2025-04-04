package com.carservice.exception;

import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import lombok.extern.slf4j.Slf4j;

import com.carservice.vo.ResultVO;
import com.carservice.common.Constant;

import java.sql.SQLException;

/**
 * 全局异常处理类
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public ResultVO handleBusinessException(BusinessException e) {
        log.error("业务异常: {}", e.getMessage());
        return ResultVO.error(e.getCode(), e.getMessage());
    }
    
    /**
     * 处理SQL异常和数据访问异常
     */
    @ExceptionHandler({SQLException.class, DataAccessException.class})
    public ResultVO handleSQLException(Exception e) {
        log.error("数据库异常:", e);
        return ResultVO.error(Constant.Code.SERVER_ERROR, "数据库操作异常，请联系管理员");
    }
    
    /**
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    public ResultVO handleRuntimeException(RuntimeException e) {
        log.error("运行时异常:", e);
        return ResultVO.error(Constant.Code.SERVER_ERROR, e.getMessage());
    }
    
    /**
     * 处理所有其他异常
     */
    @ExceptionHandler(Exception.class)
    public ResultVO handleException(Exception e) {
        log.error("系统异常:", e);
        return ResultVO.error(Constant.Code.SERVER_ERROR, "系统异常，请稍后再试");
    }
} 