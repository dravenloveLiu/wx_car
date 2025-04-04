package com.carservice.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.entity.Banner;
import com.carservice.service.BannerService;
import com.carservice.vo.ResultVO;

/**
 * 轮播图控制器
 */
@RestController
@RequestMapping("/api/banners")
public class BannerController {

    @Autowired
    private BannerService bannerService;
    
    /**
     * 获取首页轮播图列表
     */
    @GetMapping("")
    public ResultVO<List<Banner>> getBanners() {
        List<Banner> banners = bannerService.listBanners();
        return ResultVO.success(banners);
    }
} 