package com.carservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.dto.LoginDTO;
import com.carservice.entity.Car;
import com.carservice.entity.User;
import com.carservice.service.UserService;
import com.carservice.vo.LoginVO;
import com.carservice.vo.ResultVO;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResultVO<LoginVO> login(@RequestBody LoginDTO loginDTO) {
        LoginVO loginVO = userService.login(loginDTO);
        return ResultVO.success(loginVO);
    }
    
    /**
     * 获取用户信息
     */
    @GetMapping("/info")
    public ResultVO<User> getUserInfo() {
        User user = userService.getCurrentUser();
        return ResultVO.success(user);
    }
    
    /**
     * 获取用户车辆信息
     */
    @GetMapping("/car")
    public ResultVO<Car> getUserCar() {
        Car car = userService.getUserCar();
        return ResultVO.success(car);
    }
} 