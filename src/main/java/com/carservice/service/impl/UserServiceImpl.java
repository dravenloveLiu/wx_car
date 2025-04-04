package com.carservice.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
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
                car.setIsDefault(1); // 第一辆车默认设为默认车辆
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
                    car.setIsDefault(1); // 第一辆车默认设为默认车辆
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
        
        // 首先查询默认车辆
        LambdaQueryWrapper<Car> defaultQuery = new LambdaQueryWrapper<>();
        defaultQuery.eq(Car::getUserId, userId);
        defaultQuery.eq(Car::getStatus, Constant.Status.ENABLED);
        defaultQuery.eq(Car::getIsDefault, 1);
        Car defaultCar = carMapper.selectOne(defaultQuery);
        
        // 如果有默认车辆，直接返回
        if (defaultCar != null) {
            return defaultCar;
        }
        
        // 没有默认车辆，查询最新添加的车辆
        LambdaQueryWrapper<Car> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Car::getUserId, userId);
        queryWrapper.eq(Car::getStatus, Constant.Status.ENABLED);
        queryWrapper.orderByDesc(Car::getCreateTime);
        queryWrapper.last("LIMIT 1");
        
        return carMapper.selectOne(queryWrapper);
    }
    
    @Override
    public List<Car> getUserCars() {
        // 获取当前用户ID
        Long userId = UserHolder.getUserId();
        if (userId == null) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "用户未登录");
        }
        
        // 查询用户的所有车辆
        LambdaQueryWrapper<Car> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Car::getUserId, userId);
        queryWrapper.eq(Car::getStatus, Constant.Status.ENABLED);
        queryWrapper.orderByDesc(Car::getIsDefault); // 默认车辆排在前面
        queryWrapper.orderByDesc(Car::getCreateTime); // 其次按创建时间倒序
        
        return carMapper.selectList(queryWrapper);
    }
    
    @Override
    public Car getCarById(Long id) {
        // 获取当前用户ID
        Long userId = UserHolder.getUserId();
        if (userId == null) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "用户未登录");
        }
        
        if (id == null) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "车辆ID不能为空");
        }
        
        // 查询指定车辆
        Car car = carMapper.selectById(id);
        
        // 验证车辆是否存在
        if (car == null) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "车辆不存在");
        }
        
        // 验证是否是当前用户的车辆
        if (!car.getUserId().equals(userId)) {
            throw new BusinessException(Constant.Code.FORBIDDEN, "无权查看此车辆");
        }
        
        return car;
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
    
    @Override
    @Transactional
    public Car saveUserCar(Car car) {
        // 获取当前用户ID
        Long userId = UserHolder.getUserId();
        if (userId == null) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "用户未登录");
        }
        
        // 验证必要参数
        if (car == null) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "车辆信息不能为空");
        }
        
        // 确保车辆属于当前用户
        car.setUserId(userId);
        
        // 设置时间和状态
        if (car.getId() == null) {
            // 新增车辆
            car.setCreateTime(LocalDateTime.now());
            car.setStatus(Constant.Status.ENABLED);
            carMapper.insert(car);
            log.info("新增车辆信息成功: {}", car);
        } else {
            // 更新车辆
            Car existingCar = carMapper.selectById(car.getId());
            if (existingCar == null) {
                throw new BusinessException(Constant.Code.PARAM_ERROR, "车辆不存在");
            }
            
            // 确保只能更新自己的车辆
            if (!existingCar.getUserId().equals(userId)) {
                throw new BusinessException(Constant.Code.FORBIDDEN, "无权操作此车辆");
            }
            
            car.setUpdateTime(LocalDateTime.now());
            carMapper.updateById(car);
            log.info("更新车辆信息成功: {}", car);
        }
        
        // 如果设置为默认车辆，则将其他车辆取消默认状态
        if (car.getIsDefault() != null && car.getIsDefault() == 1) {
            LambdaUpdateWrapper<Car> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(Car::getUserId, userId);
            updateWrapper.ne(Car::getId, car.getId());
            updateWrapper.eq(Car::getIsDefault, 1);
            
            Car updateCar = new Car();
            updateCar.setIsDefault(0);
            carMapper.update(updateCar, updateWrapper);
        }
        
        return car;
    }
    
    @Override
    @Transactional
    public Car setDefaultCar(Long id) {
        // 获取当前用户ID
        Long userId = UserHolder.getUserId();
        if (userId == null) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "用户未登录");
        }
        
        if (id == null) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "车辆ID不能为空");
        }
        
        // 查询指定车辆
        Car car = carMapper.selectById(id);
        
        // 验证车辆是否存在
        if (car == null) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "车辆不存在");
        }
        
        // 验证是否是当前用户的车辆
        if (!car.getUserId().equals(userId)) {
            throw new BusinessException(Constant.Code.FORBIDDEN, "无权操作此车辆");
        }
        
        // 先将所有车辆设为非默认
        LambdaUpdateWrapper<Car> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(Car::getUserId, userId);
        updateWrapper.eq(Car::getStatus, Constant.Status.ENABLED);
        
        Car updateCar = new Car();
        updateCar.setIsDefault(0);
        carMapper.update(updateCar, updateWrapper);
        
        // 将指定车辆设为默认
        car.setIsDefault(1);
        car.setUpdateTime(LocalDateTime.now());
        carMapper.updateById(car);
        
        return car;
    }
    
    @Override
    public boolean deleteCar(Long id) {
        // 获取当前用户ID
        Long userId = UserHolder.getUserId();
        if (userId == null) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "用户未登录");
        }
        
        if (id == null) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "车辆ID不能为空");
        }
        
        // 查询指定车辆
        Car car = carMapper.selectById(id);
        
        // 验证车辆是否存在
        if (car == null) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "车辆不存在");
        }
        
        // 验证是否是当前用户的车辆
        if (!car.getUserId().equals(userId)) {
            throw new BusinessException(Constant.Code.FORBIDDEN, "无权操作此车辆");
        }
        
        // 如果删除的是默认车辆，则尝试将另一辆车设为默认
        if (car.getIsDefault() != null && car.getIsDefault() == 1) {
            // 查询用户的其他车辆
            LambdaQueryWrapper<Car> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Car::getUserId, userId);
            queryWrapper.eq(Car::getStatus, Constant.Status.ENABLED);
            queryWrapper.ne(Car::getId, id);
            queryWrapper.orderByDesc(Car::getCreateTime);
            queryWrapper.last("LIMIT 1");
            
            Car anotherCar = carMapper.selectOne(queryWrapper);
            
            // 如果有其他车辆，将其设为默认
            if (anotherCar != null) {
                anotherCar.setIsDefault(1);
                anotherCar.setUpdateTime(LocalDateTime.now());
                carMapper.updateById(anotherCar);
            }
        }
        
        // 逻辑删除，将状态设为禁用
        car.setStatus(Constant.Status.DISABLED);
        car.setUpdateTime(LocalDateTime.now());
        int result = carMapper.updateById(car);
        
        return result > 0;
    }
    
    @Override
    public User findByOpenid(String openid) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("open_id", openid);
        return userMapper.selectOne(queryWrapper);
    }
    
    @Override
    public User findByPhone(String phone) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("phone", phone);
        return userMapper.selectOne(queryWrapper);
    }
    
    @Override
    public User saveUser(User user) {
        if (user.getId() == null) {
            // 新用户
            user.setRegisterTime(LocalDateTime.now());
            user.setMemberLevel(Constant.MemberLevel.NORMAL);
            user.setPoints(0);
            userMapper.insert(user);
            log.info("新用户创建成功: {}", user);
        } else {
            // 更新用户
            // 不更新注册时间
            userMapper.updateById(user);
            log.info("用户信息更新成功: {}", user);
        }
        
        return user;
    }
} 