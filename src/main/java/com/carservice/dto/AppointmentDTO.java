package com.carservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 预约参数对象
 */
@Data
public class AppointmentDTO {
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
} 