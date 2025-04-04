package com.carservice.service;

import com.carservice.entity.CarBrand;
import com.carservice.entity.CarModel;
import java.util.List;

/**
 * 汽车服务接口
 */
public interface CarService {
    
    /**
     * 获取所有汽车品牌
     * @return 品牌列表
     */
    List<CarBrand> getAllBrands();
    
    /**
     * 根据品牌ID获取车型列表
     * @param brandId 品牌ID
     * @return 车型列表
     */
    List<CarModel> getModelsByBrandId(Long brandId);
} 