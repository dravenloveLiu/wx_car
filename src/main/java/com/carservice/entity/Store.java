package com.carservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 门店实体类
 */
@Data
@TableName("t_store")
public class Store {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 门店名称
     */
    private String name;
    
    /**
     * 门店地址
     */
    private String address;
    
    /**
     * 经度
     */
    private Double longitude;
    
    /**
     * 纬度
     */
    private Double latitude;
    
    /**
     * 营业时间
     */
    private String hours;
    
    /**
     * 联系电话
     */
    private String phone;
    
    /**
     * 是否为默认门店 0-否 1-是
     */
    private Integer isDefault;
    
    /**
     * 门店图片
     */
    private String imageUrl;
    
    /**
     * 状态 0-关闭 1-营业中
     */
    private Integer status;
} 