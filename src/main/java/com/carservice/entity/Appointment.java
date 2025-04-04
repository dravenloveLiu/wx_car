package com.carservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 预约实体类
 */
@Data
@TableName("t_appointment")
public class Appointment {
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
     * 服务ID
     */
    private Long serviceId;
    
    /**
     * 车辆ID
     */
    private Long carId;
    
    /**
     * 门店ID
     */
    private Long storeId;
    
    /**
     * 预约日期
     */
    private LocalDateTime appointmentTime;
    
    /**
     * 预约备注
     */
    private String remark;
    
    /**
     * 状态 0-待确认 1-已确认 2-已完成 3-已取消
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
    
    /**
     * 服务名称（冗余字段，便于查询）
     */
    private String serviceName;
    
    /**
     * 门店名称（冗余字段，便于查询）
     */
    private String storeName;
} 