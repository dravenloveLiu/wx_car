package com.carservice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.carservice.common.Constant;
import com.carservice.entity.CarBrand;
import com.carservice.entity.CarModel;
import com.carservice.mapper.CarBrandMapper;
import com.carservice.mapper.CarModelMapper;
import com.carservice.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 汽车服务实现类
 */
@Service
public class CarServiceImpl implements CarService {

    @Autowired
    private CarBrandMapper carBrandMapper;

    @Autowired
    private CarModelMapper carModelMapper;

    @Override
    public List<CarBrand> getAllBrands() {
        LambdaQueryWrapper<CarBrand> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CarBrand::getStatus, Constant.Status.ENABLED)
                .orderByAsc(CarBrand::getSort)
                .orderByAsc(CarBrand::getLetter);
        return carBrandMapper.selectList(queryWrapper);
    }

    @Override
    public List<CarModel> getModelsByBrandId(Long brandId) {
        LambdaQueryWrapper<CarModel> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CarModel::getBrandId, brandId)
                .eq(CarModel::getStatus, Constant.Status.ENABLED)
                .orderByAsc(CarModel::getSort)
                .orderByAsc(CarModel::getName);
        return carModelMapper.selectList(queryWrapper);
    }
} 