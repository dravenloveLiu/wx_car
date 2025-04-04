package com.carservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 汽车品牌实体类
 */
@Data
@TableName("t_car_brand")
public class CarBrand {
    /**
     * 品牌ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 品牌名称
     */
    private String name;
    
    /**
     * 首字母(用于索引)
     */
    private String letter;
    
    /**
     * 品牌LOGO
     */
    private String logo;
    
    /**
     * 状态 0-禁用 1-启用
     */
    private Integer status;
    
    /**
     * 排序
     */
    private Integer sort;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
} 