package com.carservice.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.entity.Tire;
import com.carservice.service.TireService;
import com.carservice.vo.ResultVO;

/**
 * 轮胎控制器
 */
@RestController
@RequestMapping("/api/tires")
public class TireController {

    @Autowired
    private TireService tireService;
    
    /**
     * 获取热门轮胎列表
     */
    @GetMapping("/hot")
    public ResultVO<List<Tire>> getHotTires() {
        List<Tire> tires = tireService.listHotTires();
        return ResultVO.success(tires);
    }
    
    /**
     * 获取轮胎详情
     */
    @GetMapping("/{id}")
    public ResultVO<Tire> getTireDetail(@PathVariable Long id) {
        Tire tire = tireService.getTireById(id);
        return ResultVO.success(tire);
    }
} 