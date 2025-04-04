package com.carservice.service;

import java.util.List;
import com.carservice.entity.Tire;

/**
 * 轮胎服务接口
 */
public interface TireService {
    /**
     * 获取热门轮胎列表
     * @return 热门轮胎列表
     */
    List<Tire> listHotTires();
    
    /**
     * 根据ID获取轮胎详情
     * @param id 轮胎ID
     * @return 轮胎详情
     */
    Tire getTireById(Long id);
} 