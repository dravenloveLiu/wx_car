package com.carservice.service.impl;

import com.carservice.common.AuthConstant;
import com.carservice.exception.BusinessException;
import com.carservice.config.WxProperties;
import com.carservice.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 认证服务实现类
 */
@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    @Autowired
    private WxProperties wxProperties;

    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    /**
     * 微信登录获取openid
     */
    @Override
    public Map<String, String> code2Session(String code) {
        if (!StringUtils.hasText(code)) {
            throw new BusinessException(400, "微信授权码不能为空");
        }

        try {
            // 构建请求URL
            String url = "https://api.weixin.qq.com/sns/jscode2session" +
                    "?appid=" + wxProperties.getAppid() +
                    "&secret=" + wxProperties.getAppSecret() +
                    "&js_code=" + code +
                    "&grant_type=authorization_code";

            // 发送请求并获取字符串响应
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            String responseBody = response.getBody();
            
            if (!StringUtils.hasText(responseBody)) {
                log.error("微信登录失败：返回结果为空");
                return null;
            }
            
            // 使用Jackson解析JSON字符串
            Map<String, Object> result = objectMapper.readValue(responseBody, Map.class);

            // 检查是否有错误
            if (result.containsKey("errcode") && !result.get("errcode").equals(0)) {
                log.error("微信登录失败：{} - {}", result.get("errcode"), result.get("errmsg"));
                return null;
            }

            // 获取openid和session_key
            String openid = (String) result.get("openid");
            String sessionKey = (String) result.get("session_key");

            if (!StringUtils.hasText(openid) || !StringUtils.hasText(sessionKey)) {
                log.error("微信登录失败：openid或session_key为空");
                return null;
            }

            // 封装结果
            Map<String, String> data = new HashMap<>();
            data.put("openid", openid);
            data.put("session_key", sessionKey);
            return data;
        } catch (Exception e) {
            log.error("微信登录异常", e);
            return null;
        }
    }

    /**
     * 验证短信验证码
     */
    @Override
    public boolean verifyCode(String phone, String code) {
        if (!StringUtils.hasText(phone) || !StringUtils.hasText(code)) {
            return false;
        }

        // 从Redis获取验证码
        String redisKey = AuthConstant.SMS_CODE_CACHE_PREFIX + phone;
        String storedCode = redisTemplate.opsForValue().get(redisKey);

        if (!StringUtils.hasText(storedCode)) {
            log.warn("验证码已过期或不存在, phone: {}", phone);
            return false;
        }

        // 验证码格式：code_timestamp
        String[] parts = storedCode.split("_");
        if (parts.length != 2) {
            log.error("验证码格式错误: {}", storedCode);
            return false;
        }

        String validCode = parts[0];
        
        // 验证码比对成功，删除验证码
        if (validCode.equals(code)) {
            redisTemplate.delete(redisKey);
            return true;
        }
        
        return false;
    }

    /**
     * 保存验证码
     */
    @Override
    public void saveCode(String phone, String code) {
        // 将验证码存入Redis，设置10分钟过期
        String cacheValue = code + "_" + System.currentTimeMillis();
        redisTemplate.opsForValue().set(
                AuthConstant.SMS_CODE_CACHE_PREFIX + phone,
                cacheValue,
                10,
                TimeUnit.MINUTES
        );
    }

    /**
     * 发送短信验证码
     */
    @Override
    public boolean sendSms(String phone, String code) {
        // 这里实际项目中需要调用短信API发送验证码
        // 本示例仅打印日志模拟发送过程
        log.info("向手机号 {} 发送验证码: {}", phone, code);
        
        // 模拟发送成功
        return true;
    }
} 