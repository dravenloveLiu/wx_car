package com.carservice.entity;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 轮胎实体类
 */
@Data
@TableName("t_tire")
public class Tire {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 轮胎名称
     */
    private String name;
    
    /**
     * 价格
     */
    private BigDecimal price;
    
    /**
     * 品牌
     */
    private String brand;
    
    /**
     * 型号
     */
    private String model;
    
    /**
     * 尺寸
     */
    private String size;
    
    /**
     * 速度等级
     */
    private String speedRating;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 特点
     */
    private String features;
    
    /**
     * 库存
     */
    private Integer stock;
    
    /**
     * 评分
     */
    private Double rating;
    
    /**
     * 销量
     */
    private Integer sales;
    
    /**
     * 是否热门 0-否 1-是
     */
    private Integer isHot;
    
    /**
     * 状态 0-下架 1-上架
     */
    private Integer status;
    
    /**
     * 轮胎图片，逗号分隔
     */
    private String images;
    
    /**
     * 背景颜色
     */
    private String backgroundColor;
} 