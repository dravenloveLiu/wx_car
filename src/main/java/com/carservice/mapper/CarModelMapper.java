package com.carservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.carservice.entity.CarModel;
import org.apache.ibatis.annotations.Mapper;

/**
 * 汽车车型数据访问接口
 */
@Mapper
public interface CarModelMapper extends BaseMapper<CarModel> {
} 