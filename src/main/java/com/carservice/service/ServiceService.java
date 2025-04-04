package com.carservice.service;

import java.util.List;
import com.carservice.entity.Service;

/**
 * 服务项目接口
 */
public interface ServiceService {
    /**
     * 获取推荐服务列表
     * @return 推荐服务列表
     */
    List<Service> listRecommendedServices();
    
    /**
     * 根据ID获取服务详情
     * @param id 服务ID
     * @return 服务详情
     */
    Service getServiceById(Long id);
} 