package com.carservice.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import com.carservice.common.AuthConstant;
import com.carservice.common.Constant;
import com.carservice.entity.User;
import com.carservice.exception.BusinessException;
import com.carservice.mapper.UserMapper;
import com.carservice.util.JwtUtil;
import com.carservice.util.UserHolder;

import lombok.extern.slf4j.Slf4j;

/**
 * 认证验证拦截器
 */
@Slf4j
@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 如果是OPTIONS请求，直接放行
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        // 获取请求头中的token
        String authHeader = request.getHeader(AuthConstant.AUTHORIZATION_HEADER);

        // 验证token是否为空
        if (!StringUtils.hasText(authHeader)) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "请先登录");
        }
        
        // 验证token格式（Bearer开头）
        if (!authHeader.startsWith(AuthConstant.TOKEN_PREFIX)) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "无效的认证令牌");
        }
        
        try {
            // 提取实际的token值（去掉Bearer前缀）
            String token = authHeader.substring(AuthConstant.TOKEN_PREFIX.length());
            
            // 从token中提取用户ID
            String userId = jwtUtil.extractUserId(token);
            
            if (!StringUtils.hasText(userId)) {
                throw new BusinessException(Constant.Code.UNAUTHORIZED, "无效的认证令牌");
            }
            
            // 查询用户是否存在
            User user = userMapper.selectById(userId);
            if (user == null) {
                throw new BusinessException(Constant.Code.UNAUTHORIZED, "用户不存在，请重新登录");
            }
            
            // 将用户ID保存到ThreadLocal中
            UserHolder.setUserId(user.getId());
            log.debug("用户认证成功: {}", userId);
            
            return true;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("认证失败", e);
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "登录已过期，请重新登录");
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 请求结束后，移除ThreadLocal中的用户ID，防止内存泄漏
        UserHolder.removeUserId();
    }
} 