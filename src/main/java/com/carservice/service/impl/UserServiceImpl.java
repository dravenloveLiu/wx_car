package com.carservice.service.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.carservice.common.Constant;
import com.carservice.dto.LoginDTO;
import com.carservice.entity.Car;
import com.carservice.entity.User;
import com.carservice.exception.BusinessException;
import com.carservice.mapper.CarMapper;
import com.carservice.mapper.UserMapper;
import com.carservice.service.UserService;
import com.carservice.util.UserHolder;
import com.carservice.vo.LoginVO;

import lombok.extern.slf4j.Slf4j;

/**
 * 用户服务实现类
 */
@Service
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private CarMapper carMapper;
    
    @Override
    public LoginVO login(LoginDTO loginDTO) {
        // 验证登录参数
        if (loginDTO == null || !StringUtils.hasText(loginDTO.getPhone())) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "登录参数不完整");
        }
        
        // 根据手机号查找用户
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getPhone, loginDTO.getPhone());
        User user = userMapper.selectOne(queryWrapper);
        
        // 用户不存在则注册新用户
        if (user == null) {
            user = new User();
            user.setPhone(loginDTO.getPhone());
            // 如果有微信登录信息，则保存
            if (StringUtils.hasText(loginDTO.getNickname())) {
                user.setNickname(loginDTO.getNickname());
                user.setAvatar(loginDTO.getAvatarUrl());
                // 保存实名信息
                if (StringUtils.hasText(loginDTO.getName())) {
                    user.setRealName(loginDTO.getName());
                }
                if (loginDTO.getGender() != null) {
                    user.setGender(loginDTO.getGender());
                }
            } else {
                user.setNickname("用户" + System.currentTimeMillis() % 10000);
            }
            user.setRegisterTime(LocalDateTime.now());
            user.setMemberLevel(Constant.MemberLevel.NORMAL);
            user.setPoints(0);
            
            userMapper.insert(user);
            log.info("新用户注册成功: {}", user);
            
            // 如果有车辆信息，则保存
            if (StringUtils.hasText(loginDTO.getCarInfo())) {
                Car car = new Car();
                car.setUserId(user.getId());
                car.setInfo(loginDTO.getCarInfo());
                car.setCreateTime(LocalDateTime.now());
                car.setStatus(Constant.Status.ENABLED);
                carMapper.insert(car);
                log.info("新用户车辆信息保存成功: {}", car);
            }
        } else {
            // 更新用户信息
            boolean needUpdate = false;
            
            // 如果有微信登录信息且用户之前未设置，则更新
            if (StringUtils.hasText(loginDTO.getNickname()) && !StringUtils.hasText(user.getNickname())) {
                user.setNickname(loginDTO.getNickname());
                needUpdate = true;
            }
            if (StringUtils.hasText(loginDTO.getAvatarUrl()) && !StringUtils.hasText(user.getAvatar())) {
                user.setAvatar(loginDTO.getAvatarUrl());
                needUpdate = true;
            }
            // 保存实名信息
            if (StringUtils.hasText(loginDTO.getName()) && !StringUtils.hasText(user.getRealName())) {
                user.setRealName(loginDTO.getName());
                needUpdate = true;
            }
            if (loginDTO.getGender() != null && user.getGender() == null) {
                user.setGender(loginDTO.getGender());
                needUpdate = true;
            }
            
            // 如果有车辆信息且用户之前未绑定车辆，则保存
            if (StringUtils.hasText(loginDTO.getCarInfo())) {
                // 查询用户是否已有车辆
                LambdaQueryWrapper<Car> carQuery = new LambdaQueryWrapper<>();
                carQuery.eq(Car::getUserId, user.getId());
                carQuery.eq(Car::getStatus, Constant.Status.ENABLED);
                Car existingCar = carMapper.selectOne(carQuery);
                
                if (existingCar == null) {
                    // 用户没有车辆，添加新车辆
                    Car car = new Car();
                    car.setUserId(user.getId());
                    car.setInfo(loginDTO.getCarInfo());
                    car.setCreateTime(LocalDateTime.now());
                    car.setStatus(Constant.Status.ENABLED);
                    carMapper.insert(car);
                    log.info("用户车辆信息保存成功: {}", car);
                } else if (!loginDTO.getCarInfo().equals(existingCar.getInfo())) {
                    // 用户已有车辆，但信息不同，更新车辆信息
                    existingCar.setInfo(loginDTO.getCarInfo());
                    existingCar.setUpdateTime(LocalDateTime.now());
                    carMapper.updateById(existingCar);
                    log.info("用户车辆信息更新成功: {}", existingCar);
                }
            }
        }
        
        // 生成token并更新用户信息
        String token = UUID.randomUUID().toString().replace("-", "");
        user.setToken(token);
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);
        
        // 返回登录结果
        LoginVO loginVO = new LoginVO();
        loginVO.setToken(token);
        loginVO.setUserInfo(user);
        return loginVO;
    }
    
    @Override
    public User getCurrentUser() {
        // 从ThreadLocal中获取当前用户ID
        Long userId = UserHolder.getUserId();
        if (userId == null) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "用户未登录");
        }
        
        // 查询用户信息
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(Constant.Code.USER_NOT_EXIST, "用户不存在");
        }
        
        return user;
    }
    
    @Override
    public Car getUserCar() {
        // 获取当前用户ID
        Long userId = UserHolder.getUserId();
        if (userId == null) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "用户未登录");
        }
        
        // 查询用户的车辆
        LambdaQueryWrapper<Car> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Car::getUserId, userId);
        queryWrapper.eq(Car::getStatus, Constant.Status.ENABLED);
        queryWrapper.orderByDesc(Car::getCreateTime);
        queryWrapper.last("LIMIT 1");
        
        return carMapper.selectOne(queryWrapper);
    }
    
    @Override
    public void logout(Long userId) {
        if (userId == null) {
            log.warn("登出失败：用户ID为空");
            return;
        }
        
        try {
            // 查询用户信息
            User user = userMapper.selectById(userId);
            if (user != null) {
                // 清除用户的token
                user.setToken(null);
                userMapper.updateById(user);
                log.info("用户成功登出，userId: {}", userId);
            } else {
                log.warn("登出失败：用户不存在，userId: {}", userId);
            }
            
            // 清除ThreadLocal中的用户信息
            UserHolder.removeUserId();
        } catch (Exception e) {
            log.error("用户登出异常，userId: {}", userId, e);
        }
    }
} 