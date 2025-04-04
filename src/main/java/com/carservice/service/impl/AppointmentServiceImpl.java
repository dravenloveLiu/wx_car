package com.carservice.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.carservice.common.Constant;
import com.carservice.dto.AppointmentDTO;
import com.carservice.entity.Appointment;
import com.carservice.entity.Car;
import com.carservice.entity.Store;
import com.carservice.entity.User;
import com.carservice.exception.BusinessException;
import com.carservice.mapper.AppointmentMapper;
import com.carservice.mapper.CarMapper;
import com.carservice.mapper.ServiceMapper;
import com.carservice.mapper.StoreMapper;
import com.carservice.service.AppointmentService;
import com.carservice.service.UserService;

/**
 * 预约服务实现类
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentMapper appointmentMapper;
    
    @Autowired
    private ServiceMapper serviceMapper;
    
    @Autowired
    private StoreMapper storeMapper;
    
    @Autowired
    private CarMapper carMapper;
    
    @Autowired
    private UserService userService;
    
    @Override
    @Transactional
    public Appointment createAppointment(AppointmentDTO appointmentDTO) {
        // 验证参数
        if (appointmentDTO == null || appointmentDTO.getServiceId() == null || 
                appointmentDTO.getStoreId() == null || appointmentDTO.getCarId() == null ||
                appointmentDTO.getAppointmentTime() == null) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "预约参数不完整");
        }
        
        // 获取当前用户
        User user = userService.getCurrentUser();
        
        // 检查用户车辆
        Car car = carMapper.selectById(appointmentDTO.getCarId());
        if (car == null || !car.getUserId().equals(user.getId())) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "车辆信息不存在或不属于当前用户");
        }
        
        // 获取服务信息
        com.carservice.entity.Service service = serviceMapper.selectById(appointmentDTO.getServiceId());
        if (service == null || service.getStatus() != 1) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "所选服务不存在或已下架");
        }
        
        // 获取门店信息
        Store store = storeMapper.selectById(appointmentDTO.getStoreId());
        if (store == null || store.getStatus() != 1) {
            throw new BusinessException(Constant.Code.PARAM_ERROR, "所选门店不存在或未营业");
        }
        
        // 创建预约
        Appointment appointment = new Appointment();
        appointment.setUserId(user.getId());
        appointment.setServiceId(appointmentDTO.getServiceId());
        appointment.setCarId(appointmentDTO.getCarId());
        appointment.setStoreId(appointmentDTO.getStoreId());
        appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
        appointment.setRemark(appointmentDTO.getRemark());
        appointment.setStatus(Constant.AppointmentStatus.PENDING); // 待确认状态
        appointment.setCreateTime(LocalDateTime.now());
        appointment.setUpdateTime(LocalDateTime.now());
        
        // 添加冗余字段，便于查询展示
        appointment.setServiceName(service.getName());
        appointment.setStoreName(store.getName());
        
        appointmentMapper.insert(appointment);
        return appointment;
    }
    
    @Override
    public List<Appointment> getUserAppointments() {
        // 获取当前用户
        User user = userService.getCurrentUser();
        
        // 查询用户的预约列表
        LambdaQueryWrapper<Appointment> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Appointment::getUserId, user.getId());
        // 按时间倒序排列
        queryWrapper.orderByDesc(Appointment::getCreateTime);
        
        return appointmentMapper.selectList(queryWrapper);
    }
} 