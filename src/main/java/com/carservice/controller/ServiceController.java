package com.carservice.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.entity.Service;
import com.carservice.service.ServiceService;
import com.carservice.vo.ResultVO;

/**
 * 服务控制器
 */
@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;
    
    /**
     * 获取推荐服务列表
     */
    @GetMapping("/recommended")
    public ResultVO<List<Service>> getRecommendedServices() {
        List<Service> services = serviceService.listRecommendedServices();
        return ResultVO.success(services);
    }
    
    /**
     * 获取服务详情
     */
    @GetMapping("/{id}")
    public ResultVO<Service> getServiceDetail(@PathVariable Long id) {
        Service service = serviceService.getServiceById(id);
        return ResultVO.success(service);
    }
} 