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
     * 用户登录
     *
     * @param loginDTO 登录信息
     * @return 登录结果
     */
    @PostMapping("/login")
    public ResultVO<LoginVO> login(@RequestBody LoginDTO loginDTO) {
        // 验证参数
        if (loginDTO == null || !StringUtils.hasText(loginDTO.getPhone())) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "登录参数不完整");
        }

        // 验证验证码
        if (!StringUtils.hasText(loginDTO.getCode())) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "验证码不能为空");
        }

        // 从内存中获取验证码记录
      //  String codeRecord = CODE_MAP.get(loginDTO.getPhone());
        String codeRecord = redisTemplate.opsForValue().get(AuthConstant.SMS_CODE_CACHE_PREFIX + loginDTO.getPhone());
        if (!StringUtils.hasText(codeRecord)) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "验证码已过期，请重新获取");
        }

//        // 解析验证码和发送时间
//        String[] parts = codeRecord.split(":");
//        String code = parts[0];
//        long sendTime = Long.parseLong(parts[1]);
//
//        // 验证码过期校验
//        if (System.currentTimeMillis() - sendTime > CODE_EXPIRE_TIME) {
//            CODE_MAP.remove(loginDTO.getPhone());
//            throw new BusinessException(Constant.Code.PARAM_ERROR, "验证码已过期，请重新获取");
//        }
//
//        // 验证码匹配校验
//        if (!code.equals(loginDTO.getCode())) {
//            throw new BusinessException(Constant.Code.PARAM_ERROR, "验证码不正确");
//        }
//
//        // 验证通过，移除验证码记录
//        CODE_MAP.remove(loginDTO.getPhone());
        redisTemplate.delete(AuthConstant.SMS_CODE_CACHE_PREFIX + loginDTO.getPhone());
        // 调用登录服务
        LoginVO loginVO = userService.login(loginDTO);

        return ResultVO.success(loginVO);
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