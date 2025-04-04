package com.carservice.controller;

import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.vo.ResultVO;

/**
 * 汽车相关控制器
 */
@RestController
@RequestMapping("/api/car")
public class CarController {
    
    /**
     * 获取汽车品牌列表
     * @return 品牌列表
     */
    @GetMapping("/brands")
    public ResultVO<List<Map<String, Object>>> getBrands() {
        // 常见汽车品牌数据
        List<Map<String, Object>> brands = new ArrayList<>();
        
        addBrand(brands, 1, "丰田", "F");
        addBrand(brands, 2, "本田", "B");
        addBrand(brands, 3, "大众", "D");
        addBrand(brands, 4, "福特", "F");
        addBrand(brands, 5, "宝马", "B");
        addBrand(brands, 6, "奔驰", "B");
        addBrand(brands, 7, "奥迪", "A");
        addBrand(brands, 8, "现代", "X");
        addBrand(brands, 9, "起亚", "Q");
        addBrand(brands, 10, "雪佛兰", "X");
        addBrand(brands, 11, "别克", "B");
        addBrand(brands, 12, "日产", "R");
        addBrand(brands, 13, "马自达", "M");
        addBrand(brands, 14, "雷克萨斯", "L");
        addBrand(brands, 15, "沃尔沃", "W");
        addBrand(brands, 16, "斯巴鲁", "S");
        addBrand(brands, 17, "三菱", "S");
        addBrand(brands, 18, "标致", "B");
        addBrand(brands, 19, "雪铁龙", "X");
        addBrand(brands, 20, "英菲尼迪", "Y");
        
        return ResultVO.success(brands);
    }
    
    /**
     * 添加汽车品牌
     */
    private void addBrand(List<Map<String, Object>> brands, Integer id, String name, String letter) {
        Map<String, Object> brand = new HashMap<>();
        brand.put("id", id);
        brand.put("name", name);
        brand.put("letter", letter);
        brands.add(brand);
    }
    
    /**
     * 获取汽车车型列表
     * @return 车型列表
     */
    @GetMapping("/models")
    public ResultVO<List<Map<String, Object>>> getModels(@RequestParam Long brandId) {
        // 根据品牌ID返回不同的车型列表
        List<Map<String, Object>> models = new ArrayList<>();
        
        if (brandId == 1) { // 丰田
            addModel(models, 1, "卡罗拉", 1L);
            addModel(models, 2, "凯美瑞", 1L);
            addModel(models, 3, "RAV4", 1L);
            addModel(models, 4, "普拉多", 1L);
            addModel(models, 5, "汉兰达", 1L);
        } else if (brandId == 2) { // 本田
            addModel(models, 6, "思域", 2L);
            addModel(models, 7, "雅阁", 2L);
            addModel(models, 8, "CR-V", 2L);
            addModel(models, 9, "飞度", 2L);
        } else if (brandId == 3) { // 大众
            addModel(models, 10, "高尔夫", 3L);
            addModel(models, 11, "帕萨特", 3L);
            addModel(models, 12, "途观", 3L);
            addModel(models, 13, "途安", 3L);
        } else { // 其他品牌
            addModel(models, 14, "默认车型1", brandId);
            addModel(models, 15, "默认车型2", brandId);
            addModel(models, 16, "默认车型3", brandId);
        }
        
        return ResultVO.success(models);
    }
    
    /**
     * 添加汽车车型
     */
    private void addModel(List<Map<String, Object>> models, Integer id, String name, Long brandId) {
        Map<String, Object> model = new HashMap<>();
        model.put("id", id);
        model.put("name", name);
        model.put("brandId", brandId);
        models.add(model);
    }
} 