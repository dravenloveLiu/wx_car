package com.carservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.dto.LoginDTO;
import com.carservice.entity.Car;
import com.carservice.entity.User;
import com.carservice.service.UserService;
import com.carservice.util.UserHolder;
import com.carservice.vo.LoginVO;
import com.carservice.vo.ResultVO;

/**
 * 用户相关控制器
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    /**
     * 用户登录
     * @param loginDTO 登录信息
     * @return 登录结果
     */
    @PostMapping("/login")
    public ResultVO<LoginVO> login(@RequestBody LoginDTO loginDTO) {
        LoginVO loginVO = userService.login(loginDTO);
        return ResultVO.success(loginVO);
    }
    
    /**
     * 获取当前登录用户信息
     * @return 用户信息
     */
    @GetMapping("/info")
    public ResultVO<User> getUserInfo() {
        User user = userService.getCurrentUser();
        return ResultVO.success(user);
    }
    
    /**
     * 获取当前用户的默认车辆信息
     * @return 车辆信息
     */
    @GetMapping("/car")
    public ResultVO<Car> getUserCar() {
        Car car = userService.getUserCar();
        return ResultVO.success(car);
    }
    
    /**
     * 获取当前用户的所有车辆信息
     * @return 车辆列表
     */
    @GetMapping("/cars")
    public ResultVO<List<Car>> getUserCars() {
        List<Car> cars = userService.getUserCars();
        return ResultVO.success(cars);
    }
    
    /**
     * 获取指定车辆的详细信息
     * @param id 车辆ID
     * @return 车辆信息
     */
    @GetMapping("/car/{id}")
    public ResultVO<Car> getCarById(@PathVariable Long id) {
        Car car = userService.getCarById(id);
        return ResultVO.success(car);
    }
    
    /**
     * 添加或更新用户车辆信息
     * @param car 车辆信息
     * @return 更新后的车辆信息
     */
    @PostMapping("/car")
    public ResultVO<Car> saveUserCar(@RequestBody Car car) {
        // 设置当前用户ID
        Long userId = UserHolder.getUserId();
        car.setUserId(userId);
        
        // 保存车辆信息
        Car savedCar = userService.saveUserCar(car);
        
        return ResultVO.success(savedCar);
    }
    
    /**
     * 更新用户车辆信息
     * @param id 车辆ID
     * @param car 车辆信息
     * @return 更新后的车辆信息
     */
    @PutMapping("/car/{id}")
    public ResultVO<Car> updateUserCar(@PathVariable Long id, @RequestBody Car car) {
        // 设置ID和当前用户ID
        car.setId(id);
        car.setUserId(UserHolder.getUserId());
        
        // 更新车辆信息
        Car updatedCar = userService.saveUserCar(car);
        
        return ResultVO.success(updatedCar);
    }
    
    /**
     * 设置默认车辆
     * @param id 车辆ID
     * @return 设置为默认的车辆信息
     */
    @PutMapping("/car/{id}/default")
    public ResultVO<Car> setDefaultCar(@PathVariable Long id) {
        Car car = userService.setDefaultCar(id);
        return ResultVO.success(car);
    }
    
    /**
     * 删除车辆
     * @param id 车辆ID
     * @return 操作结果
     */
    @DeleteMapping("/car/{id}")
    public ResultVO<Boolean> deleteCar(@PathVariable Long id) {
        boolean result = userService.deleteCar(id);
        return ResultVO.success(result);
    }
} 