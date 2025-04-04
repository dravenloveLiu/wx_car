package com.carservice.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.carservice.mapper.ServiceMapper;
import com.carservice.service.ServiceService;

/**
 * 服务实现类
 */
@Service
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceMapper serviceMapper;
    
    @Override
    public List<com.carservice.entity.Service> listRecommendedServices() {
        LambdaQueryWrapper<com.carservice.entity.Service> queryWrapper = new LambdaQueryWrapper<>();
        // 只查询推荐且上架的服务
        queryWrapper.eq(com.carservice.entity.Service::getIsRecommended, 1);
        queryWrapper.eq(com.carservice.entity.Service::getStatus, 1);
        return serviceMapper.selectList(queryWrapper);
    }
    
    @Override
    public com.carservice.entity.Service getServiceById(Long id) {
        return serviceMapper.selectById(id);
    }
} 