package com.carservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.entity.Store;
import com.carservice.service.StoreService;
import com.carservice.vo.ResultVO;

/**
 * 门店控制器
 */
@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;
    
    /**
     * 获取最近的门店
     */
    @GetMapping("/nearest")
    public ResultVO<Store> getNearestStore(@RequestParam Double latitude, @RequestParam Double longitude) {
        Store store = storeService.findNearestStore(latitude, longitude);
        return ResultVO.success(store);
    }
    
    /**
     * 获取默认门店
     */
    @GetMapping("/default")
    public ResultVO<Store> getDefaultStore() {
        Store store = storeService.getDefaultStore();
        return ResultVO.success(store);
    }
} 