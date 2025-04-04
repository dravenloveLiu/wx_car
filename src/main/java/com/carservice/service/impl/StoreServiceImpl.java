package com.carservice.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.carservice.entity.Store;
import com.carservice.mapper.StoreMapper;
import com.carservice.service.StoreService;

/**
 * 门店服务实现类
 */
@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreMapper storeMapper;
    
    @Override
    public Store findNearestStore(Double latitude, Double longitude) {
        // 这里简化实现，实际应该计算距离找出最近的门店
        // 可以使用数据库的地理位置函数计算距离，或者在应用层计算
        
        // 先查出所有营业中的门店
        LambdaQueryWrapper<Store> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Store::getStatus, 1);
        List<Store> stores = storeMapper.selectList(queryWrapper);
        
        if (stores.isEmpty()) {
            return getDefaultStore();
        }
        
        // 找出最近的门店（这里使用简化的计算方法）
        Store nearestStore = null;
        double minDistance = Double.MAX_VALUE;
        
        for (Store store : stores) {
            // 使用直线距离公式计算（实际应使用更精确的地球表面距离计算）
            double distance = calculateDistance(latitude, longitude, store.getLatitude(), store.getLongitude());
            if (distance < minDistance) {
                minDistance = distance;
                nearestStore = store;
            }
        }
        
        return nearestStore != null ? nearestStore : getDefaultStore();
    }
    
    @Override
    public Store getDefaultStore() {
        LambdaQueryWrapper<Store> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Store::getIsDefault, 1);
        queryWrapper.eq(Store::getStatus, 1);
        Store store = storeMapper.selectOne(queryWrapper);
        
        if (store == null) {
            // 如果没有默认门店，返回第一个营业中的门店
            queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Store::getStatus, 1);
            queryWrapper.last("LIMIT 1");
            store = storeMapper.selectOne(queryWrapper);
        }
        
        return store;
    }
    
    /**
     * 计算两个坐标点之间的距离（简化版，使用欧氏距离）
     */
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return Double.MAX_VALUE;
        }
        
        // 实际应使用Haversine公式计算地球表面两点距离
        // 这里简化为欧氏距离
        double x = lat2 - lat1;
        double y = lon2 - lon1;
        return Math.sqrt(x * x + y * y);
    }
} 