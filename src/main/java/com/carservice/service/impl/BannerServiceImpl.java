package com.carservice.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.carservice.entity.Banner;
import com.carservice.mapper.BannerMapper;
import com.carservice.service.BannerService;
import com.carservice.common.Constant;

/**
 * 轮播图服务实现类
 */
@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerMapper bannerMapper;
    
    @Override
    public List<Banner> listBanners() {
        LambdaQueryWrapper<Banner> queryWrapper = new LambdaQueryWrapper<>();
        // 只查询状态为启用的轮播图，确保使用正确的字段名status而非statu
        queryWrapper.eq(Banner::getStatus, Constant.Status.ENABLED);
        // 按照排序字段正序排列
        queryWrapper.orderByAsc(Banner::getSort);
        return bannerMapper.selectList(queryWrapper);
    }
} 