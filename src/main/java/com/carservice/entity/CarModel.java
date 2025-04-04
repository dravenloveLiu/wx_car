package com.carservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 汽车车型实体类
 */
@Data
@TableName("t_car_model")
public class CarModel {
    /**
     * 车型ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 品牌ID
     */
    private Long brandId;
    
    /**
     * 车型名称
     */
    private String name;
    
    /**
     * 车型图片
     */
    private String imageUrl;
    
    /**
     * 年份
     */
    private String year;
    
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