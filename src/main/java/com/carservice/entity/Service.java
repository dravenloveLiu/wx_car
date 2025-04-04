package com.carservice.entity;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 服务实体类
 */
@Data
@TableName("t_service")
public class Service {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 服务名称
     */
    private String name;
    
    /**
     * 价格
     */
    private BigDecimal price;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 服务时长(分钟)
     */
    private Integer duration;
    
    /**
     * 服务图片
     */
    private String imageUrl;
    
    /**
     * 是否推荐 0-否 1-是
     */
    private Integer isRecommended;
    
    /**
     * 状态 0-下架 1-上架
     */
    private Integer status;
    
    /**
     * 服务内容
     */
    private String content;
    
    /**
     * 背景颜色
     */
    private String backgroundColor;
} 