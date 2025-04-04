package com.carservice.service;

import java.util.List;

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
     * 获取当前用户的默认车辆信息
     * @return 车辆信息
     */
    Car getUserCar();
    
    /**
     * 用户登出
     * @param userId 用户ID
     */
    void logout(Long userId);
    
    /**
     * 保存或更新用户车辆信息
     * @param car 车辆信息
     * @return 保存后的车辆信息
     */
    Car saveUserCar(Car car);
    
    /**
     * 获取当前用户的所有车辆信息
     * @return 车辆列表
     */
    List<Car> getUserCars();
    
    /**
     * 获取指定车辆的详细信息
     * @param id 车辆ID
     * @return 车辆信息
     */
    Car getCarById(Long id);
    
    /**
     * 设置默认车辆
     * @param id 车辆ID
     * @return 设置为默认的车辆信息
     */
    Car setDefaultCar(Long id);
    
    /**
     * 删除车辆
     * @param id 车辆ID
     * @return 操作结果
     */
    boolean deleteCar(Long id);
} 