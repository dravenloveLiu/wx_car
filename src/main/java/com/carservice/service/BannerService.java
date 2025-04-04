package com.carservice.service;

import java.util.List;
import com.carservice.entity.Banner;

/**
 * 轮播图服务接口
 */
public interface BannerService {
    /**
     * 获取轮播图列表
     * @return 轮播图列表
     */
    List<Banner> listBanners();
} 