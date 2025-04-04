package com.carservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.carservice.entity.CarBrand;
import org.apache.ibatis.annotations.Mapper;

/**
 * 汽车品牌数据访问接口
 */
@Mapper
public interface CarBrandMapper extends BaseMapper<CarBrand> {
} 