package com.carservice.controller;

import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.entity.CarBrand;
import com.carservice.entity.CarModel;
import com.carservice.service.CarService;
import com.carservice.vo.ResultVO;

/**
 * 汽车相关控制器
 */
@RestController
@RequestMapping("/api/car")
public class CarController {
    
    @Autowired
    private CarService carService;
    
    /**
     * 获取汽车品牌列表
     * @return 品牌列表
     */
    @GetMapping("/brands")
    public ResultVO<List<Map<String, Object>>> getBrands() {
        // 从数据库获取品牌列表
        List<CarBrand> brands = carService.getAllBrands();
        
        // 转换为前端需要的格式
        List<Map<String, Object>> result = brands.stream().map(brand -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", brand.getId());
            map.put("name", brand.getName());
            map.put("letter", brand.getLetter());
            if (brand.getLogo() != null) {
                map.put("logo", brand.getLogo());
            }
            return map;
        }).collect(Collectors.toList());
        
        return ResultVO.success(result);
    }
    
    /**
     * 获取汽车车型列表
     * @param brandId 品牌ID
     * @return 车型列表
     */
    @GetMapping("/models")
    public ResultVO<List<Map<String, Object>>> getModels(@RequestParam Long brandId) {
        // 从数据库获取车型列表
        List<CarModel> models = carService.getModelsByBrandId(brandId);
        
        // 转换为前端需要的格式
        List<Map<String, Object>> result = models.stream().map(model -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", model.getId());
            map.put("name", model.getName());
            map.put("brandId", model.getBrandId());
            if (model.getImageUrl() != null) {
                map.put("imageUrl", model.getImageUrl());
            }
            if (model.getYear() != null) {
                map.put("year", model.getYear());
            }
            return map;
        }).collect(Collectors.toList());
        
        // 如果没有查询到数据，返回默认数据
        if (result.isEmpty()) {
            Map<String, Object> defaultModel = new HashMap<>();
            defaultModel.put("id", 999);
            defaultModel.put("name", "默认车型");
            defaultModel.put("brandId", brandId);
            result.add(defaultModel);
        }
        
        return ResultVO.success(result);
    }
} 