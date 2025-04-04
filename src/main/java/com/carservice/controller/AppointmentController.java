package com.carservice.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carservice.dto.AppointmentDTO;
import com.carservice.entity.Appointment;
import com.carservice.service.AppointmentService;
import com.carservice.vo.ResultVO;

/**
 * 预约控制器
 */
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    
    /**
     * 创建预约
     */
    @PostMapping("")
    public ResultVO<Appointment> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        Appointment appointment = appointmentService.createAppointment(appointmentDTO);
        return ResultVO.success(appointment);
    }
    
    /**
     * 获取当前用户的预约列表
     */
    @GetMapping("/user")
    public ResultVO<List<Appointment>> getUserAppointments() {
        List<Appointment> appointments = appointmentService.getUserAppointments();
        return ResultVO.success(appointments);
    }
} 