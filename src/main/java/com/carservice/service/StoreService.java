package com.carservice.service;

import com.carservice.entity.Store;

/**
 * 门店服务接口
 */
public interface StoreService {
    /**
     * 查找离指定坐标最近的门店
     * @param latitude 纬度
     * @param longitude 经度
     * @return 最近的门店
     */
    Store findNearestStore(Double latitude, Double longitude);
    
    /**
     * 获取默认门店
     * @return 默认门店
     */
    Store getDefaultStore();
} 