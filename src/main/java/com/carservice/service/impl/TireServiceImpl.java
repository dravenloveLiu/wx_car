package com.carservice.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.carservice.entity.Tire;
import com.carservice.mapper.TireMapper;
import com.carservice.service.TireService;

/**
 * 轮胎服务实现类
 */
@Service
public class TireServiceImpl implements TireService {

    @Autowired
    private TireMapper tireMapper;
    
    @Override
    public List<Tire> listHotTires() {
        LambdaQueryWrapper<Tire> queryWrapper = new LambdaQueryWrapper<>();
        // 只查询热门且上架的轮胎
        queryWrapper.eq(Tire::getIsHot, 1);
        queryWrapper.eq(Tire::getStatus, 1);
        // 按照销量倒序排序
        queryWrapper.orderByDesc(Tire::getSales);
        // 限制返回10条数据
        queryWrapper.last("LIMIT 10");
        return tireMapper.selectList(queryWrapper);
    }
    
    @Override
    public Tire getTireById(Long id) {
        return tireMapper.selectById(id);
    }
} 