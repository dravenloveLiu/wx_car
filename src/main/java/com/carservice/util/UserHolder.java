package com.carservice.util;

/**
 * 用户信息持有者，用于存储当前登录用户ID
 */
public class UserHolder {
    
    private static final ThreadLocal<Long> USER_ID = new ThreadLocal<>();
    
    /**
     * 设置用户ID
     */
    public static void setUserId(Long userId) {
        USER_ID.set(userId);
    }
    
    /**
     * 获取用户ID
     */
    public static Long getUserId() {
        return USER_ID.get();
    }
    
    /**
     * 清除用户ID
     */
    public static void removeUserId() {
        USER_ID.remove();
    }
} 