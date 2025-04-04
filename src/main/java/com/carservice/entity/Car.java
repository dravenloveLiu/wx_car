package com.carservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 车辆实体类
 */
@Data
@TableName("t_car")
public class Car {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 品牌
     */
    private String brand;
    
    /**
     * 型号
     */
    private String model;
    
    /**
     * 车牌号
     */
    private String plateNumber;
    
    /**
     * 年份
     */
    private String year;
    
    /**
     * 行驶里程
     */
    private Integer mileage;
    
    /**
     * 车辆照片
     */
    private String imageUrl;
    
    /**
     * 发动机号
     */
    private String engineNumber;
    
    /**
     * 车架号
     */
    private String vinNumber;
    
    /**
     * 是否默认车辆 0-否 1-是
     */
    private Integer isDefault;
    
    /**
     * 车辆信息（简要描述）
     */
    private String info;
    
    /**
     * 状态 0-禁用 1-启用
     */
    private Integer status;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
} 