package com.carservice.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.carservice.common.Constant;
import com.carservice.entity.User;
import com.carservice.exception.BusinessException;
import com.carservice.mapper.UserMapper;
import com.carservice.util.UserHolder;

/**
 * 身份验证拦截器
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 如果是OPTIONS请求，直接放行
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }
        
        // 获取请求头中的token
        String token = request.getHeader("Authorization");
        
        // 验证token是否为空
        if (!StringUtils.hasText(token)) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "请先登录");
        }
        
        // 查询用户信息
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getToken, token);
        User user = userMapper.selectOne(queryWrapper);
        
        // 验证用户是否存在
        if (user == null) {
            throw new BusinessException(Constant.Code.UNAUTHORIZED, "登录已过期，请重新登录");
        }
        
        // 将用户ID保存到ThreadLocal中
        UserHolder.setUserId(user.getId());
        
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 请求结束后，移除ThreadLocal中的用户ID，防止内存泄漏
        UserHolder.removeUserId();
    }
} 