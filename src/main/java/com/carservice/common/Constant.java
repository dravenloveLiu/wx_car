package com.carservice.common;

/**
 * 系统常量
 */
public interface Constant {
    
    /**
     * 状态码常量
     */
    interface Code {
        /**
         * 成功
         */
        Integer SUCCESS = 0;
        
        /**
         * 参数错误
         */
        Integer PARAM_ERROR = 400;
        
        /**
         * 未授权
         */
        Integer UNAUTHORIZED = 401;
        
        /**
         * 禁止访问
         */
        Integer FORBIDDEN = 403;
        
        /**
         * 资源不存在
         */
        Integer NOT_FOUND = 404;
        
        /**
         * 用户不存在
         */
        Integer USER_NOT_EXIST = 1001;
        
        /**
         * 服务器内部错误
         */
        Integer SERVER_ERROR = 500;
    }
    
    /**
     * 状态常量
     */
    interface Status {
        /**
         * 禁用
         */
        Integer DISABLED = 0;
        
        /**
         * 启用
         */
        Integer ENABLED = 1;
    }
    
    /**
     * 预约状态常量
     */
    interface AppointmentStatus {
        /**
         * 待确认
         */
        Integer PENDING = 0;
        
        /**
         * 已确认
         */
        Integer CONFIRMED = 1;
        
        /**
         * 已完成
         */
        Integer COMPLETED = 2;
        
        /**
         * 已取消
         */
        Integer CANCELED = 3;
    }
    
    /**
     * 会员等级常量
     */
    interface MemberLevel {
        /**
         * 普通用户
         */
        Integer NORMAL = 0;
        
        /**
         * 银卡会员
         */
        Integer SILVER = 1;
        
        /**
         * 金卡会员
         */
        Integer GOLD = 2;
        
        /**
         * 铂金会员
         */
        Integer PLATINUM = 3;
    }
} 