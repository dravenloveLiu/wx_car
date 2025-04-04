package com.carservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 轮播图实体类
 */
@Data
@TableName("t_banner")
public class Banner {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 背景颜色
     */
    private String backgroundColor;
    
    /**
     * 跳转链接
     */
    private String link;
    
    /**
     * 图片URL
     */
    private String imageUrl;
    
    /**
     * 排序
     */
    private Integer sort;
    
    /**
     * 状态 0-禁用 1-启用
     */
    private Integer status;
} 