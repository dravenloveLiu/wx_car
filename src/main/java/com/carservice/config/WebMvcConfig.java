package com.carservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.carservice.interceptor.AuthInterceptor;

/**
 * Web MVC配置类
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Autowired
    private AuthInterceptor authInterceptor;
    
    /**
     * 添加拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 登录拦截器，拦截需要登录的接口
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**")          // 拦截所有接口
                .excludePathPatterns(                // 排除不需要登录的接口
                        "/api/user/login",           // 登录接口
                        "/api/auth/**",              // 认证相关接口
                        "/api/banners",              // 轮播图接口
                        "/api/tires/hot",            // 热门轮胎接口
                        "/api/services/recommended",  // 推荐服务接口
                        "/api/stores/**",            // 门店相关接口
                        "/api/car/**"                // 汽车品牌、车型相关接口
                );
    }
    
    /**
     * 跨域配置
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 更全面的跨域配置，支持小程序和Web端
        registry.addMapping("/**")
                .allowedOriginPatterns("*")  // 允许所有来源
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")  // 允许所有头部信息
                .allowCredentials(true)  // 允许发送Cookie
                .maxAge(3600);  // 预检请求有效期1小时
    }
    
    /**
     * 资源处理器
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Swagger和Knife4j相关资源
        registry.addResourceHandler("doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
        
        // 自定义静态资源目录
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }
} 