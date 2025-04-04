package com.carservice.service;

import java.util.List;
import com.carservice.dto.AppointmentDTO;
import com.carservice.entity.Appointment;

/**
 * 预约服务接口
 */
public interface AppointmentService {
    /**
     * 创建预约
     * @param appointmentDTO 预约参数
     * @return 预约信息
     */
    Appointment createAppointment(AppointmentDTO appointmentDTO);
    
    /**
     * 获取当前用户的预约列表
     * @return 预约列表
     */
    List<Appointment> getUserAppointments();
} 