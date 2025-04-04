package com.carservice.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import com.carservice.common.AuthConstant;
import com.carservice.common.BizCodeEnume;
import com.carservice.util.R;
import com.carservice.util.SmsComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.dto.LoginDTO;
import com.carservice.entity.User;
import com.carservice.service.UserService;
import com.carservice.common.Constant;
import com.carservice.exception.BusinessException;
import com.carservice.vo.LoginVO;
import com.carservice.vo.ResultVO;
import com.carservice.util.UserHolder;
import com.carservice.service.AuthService;
import com.carservice.util.JwtUtil;
import com.carservice.vo.LoginRequest;
import com.carservice.vo.SendCodeRequest;

import lombok.extern.slf4j.Slf4j;

import javax.annotation.Resource;

/**
 * 认证相关控制器
 */
@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    @Autowired
    private UserService userService;

    @Resource
    SmsComponent smsComponent;

    @Autowired
    StringRedisTemplate redisTemplate;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    // 内存中存储验证码，实际项目建议使用Redis
    private static final Map<String, String> CODE_MAP = new ConcurrentHashMap<>();
    // 验证码有效期（毫秒）
    private static final long CODE_EXPIRE_TIME = 5 * 60 * 1000;
    // 验证码存储格式：验证码:发送时间

    /**
     * 发送验证码
     *
     * @param params 包含手机号的参数
     * @return 发送结果
     */
    @PostMapping("/send-code")
    public ResultVO<String> sendCode(@RequestBody Map<String, String> params) {
        String phone = params.get("phone");
        // 1.判断60秒间隔发送，防刷
        String _code = redisTemplate.opsForValue().get(AuthConstant.SMS_CODE_CACHE_PREFIX + phone);
        if (org.apache.commons.lang3.StringUtils.isNotBlank(_code) && System.currentTimeMillis() - Long.parseLong(_code.split("_")[1]) < 60000) {
            // 调用接口小于60秒间隔不允许重新发送新的验证码
            throw new BusinessException(Constant.Code.PARAM_ERROR, "60秒间隔不允许重新发送新的验证码");
        }
        // 验证手机号
        if (!StringUtils.hasText(phone) || !phone.matches("^1[3-9]\\d{9}$")) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "手机号格式不正确");
        }

        // 生成6位随机验证码
        String verificationCode = generateVerificationCode();

        // 将验证码存储到内存中
        // CODE_MAP.put(phone, verificationCode + ":" + System.currentTimeMillis());
        // 验证码缓存到redis中（并且记录当前时间戳）
        redisTemplate.opsForValue().set(AuthConstant.SMS_CODE_CACHE_PREFIX + phone, verificationCode + "_" + System.currentTimeMillis(), 10, TimeUnit.MINUTES);

        // 模拟发送验证码的过程，实际开发中需要调用短信API
        log.info("向手机号 {} 发送验证码: {}", phone, verificationCode);
        smsComponent.sendCode(phone, verificationCode);
        // 返回结果
        return ResultVO.success("验证码发送成功");
    }

    /**
     * 登录接口，同时支持微信登录和手机号登录
     */
    @PostMapping("/login")
    public ResultVO login(@RequestBody LoginRequest request) {
        // 根据loginType区分登录方式
        if ("wechat".equals(request.getLoginType())) {
            // 微信登录流程
            return handleWechatLogin(request);
        } else if ("phone".equals(request.getLoginType())) {
            // 手机号登录流程
            return handlePhoneLogin(request);
        } else {
            return ResultVO.error(Constant.Code.PARAM_ERROR, "不支持的登录方式");
        }
    }

    /**
     * 处理微信登录
     */
    private ResultVO handleWechatLogin(LoginRequest request) {
        String code = request.getCode();
        
        try {
            // 1. 调用微信API获取openid和session_key
            Map<String, String> wxResult = authService.code2Session(code);
            
            if (wxResult == null || !wxResult.containsKey("openid")) {
                return ResultVO.error(Constant.Code.PARAM_ERROR, "微信授权失败");
            }
            
            String openid = wxResult.get("openid");
            
            // 2. 根据openid查找用户
            User user = userService.findByOpenid(openid);
            boolean isNewUser = false;
            
            if (user == null) {
                // 3. 如果用户不存在，创建新用户
                user = new User();
                user.setOpenId(openid);
                user.setNickname(request.getNickname());
                user.setAvatar(request.getAvatarUrl());
                user.setGender(request.getGender());
                userService.saveUser(user);
                isNewUser = true;
            }
            
            // 4. 生成JWT token
            String token = jwtUtil.generateToken(user.getId().toString());
            
            // 5. 组装返回数据
            Map<String, Object> result = new HashMap<>();
            result.put("token", AuthConstant.TOKEN_PREFIX + token);
            result.put("userInfo", user);
            result.put("isNewUser", isNewUser);
            
            return ResultVO.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultVO.error(Constant.Code.PARAM_ERROR, "微信登录失败: " + e.getMessage());
        }
    }

    /**
     * 处理手机号登录
     */
    private ResultVO handlePhoneLogin(LoginRequest request) {
        String phone = request.getPhone();
        String code = request.getVerificationCode();
        
        // 1. 验证短信验证码
        boolean verified = authService.verifyCode(phone, code);
        if (!verified) {
            return ResultVO.error(Constant.Code.PARAM_ERROR, "验证码错误");
        }
        
        // 2. 根据手机号查找用户
        User user = userService.findByPhone(phone);
        boolean isNewUser = false;
        
        if (user == null) {
            // 3. 如果用户不存在，创建新用户
            user = new User();
            user.setPhone(phone);
            user.setNickname("用户" + phone.substring(phone.length() - 4));
            userService.saveUser(user);
            isNewUser = true;
        }
        
        // 4. 生成JWT token
        String token = jwtUtil.generateToken(user.getId().toString());
        
        // 5. 组装返回数据
        Map<String, Object> result = new HashMap<>();
        result.put("token", AuthConstant.TOKEN_PREFIX + token);
        result.put("userInfo", user);
        result.put("isNewUser", isNewUser);
        
        return ResultVO.success(result);
    }

    /**
     * 用户登出
     * @return 登出结果
     */
    @PostMapping("/logout")
    public ResultVO<String> logout() {
        try {
            // 从ThreadLocal中获取当前用户ID
            Long userId = UserHolder.getUserId();
            
            if (userId != null) {
                // 调用服务完成用户登出
                userService.logout(userId);
                log.info("用户登出成功, userId: {}", userId);
            }
            
            return ResultVO.success("登出成功");
        } catch (Exception e) {
            log.error("用户登出异常", e);
            return ResultVO.success("登出成功"); // 即使发生异常也返回成功，确保前端状态正确
        }
    }

    /**
     * 生成6位验证码
     */
    private String generateVerificationCode() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
} 