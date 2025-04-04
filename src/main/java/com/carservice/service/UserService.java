package com.carservice.service;

import com.carservice.dto.LoginDTO;
import com.carservice.entity.Car;
import com.carservice.entity.User;
import com.carservice.vo.LoginVO;

/**
 * 用户服务接口
 */
public interface UserService {
    /**
     * 用户登录
     * @param loginDTO 登录参数
     * @return 登录结果
     */
    LoginVO login(LoginDTO loginDTO);
    
    /**
     * 获取当前登录用户信息
     * @return 用户信息
     */
    User getCurrentUser();
    
    /**
     * 获取当前用户的车辆信息
     * @return 车辆信息
     */
    Car getUserCar();
    
    /**
     * 用户登出
     * @param userId 用户ID
     */
    void logout(Long userId);
} 