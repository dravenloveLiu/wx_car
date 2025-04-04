-- 创建数据库
CREATE DATABASE IF NOT EXISTS car_service DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE car_service;

-- 用户表
CREATE TABLE IF NOT EXISTS `t_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(64) DEFAULT NULL COMMENT '用户名',
  `password` varchar(64) DEFAULT NULL COMMENT '密码',
  `name` varchar(64) DEFAULT NULL COMMENT '姓名',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `openid` varchar(64) DEFAULT NULL COMMENT '微信openid',
  `nickname` varchar(64) DEFAULT NULL COMMENT '微信昵称',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '微信头像URL',
  `gender` tinyint(4) DEFAULT '0' COMMENT '性别：0-未知，1-男，2-女',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
  `deleted` tinyint(4) DEFAULT '0' COMMENT '是否删除：0-否，1-是',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_phone` (`phone`) USING BTREE,
  UNIQUE KEY `idx_openid` (`openid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 车辆表
CREATE TABLE IF NOT EXISTS t_car (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    brand VARCHAR(50) COMMENT '品牌',
    model VARCHAR(50) COMMENT '型号',
    plate_number VARCHAR(20) COMMENT '车牌号',
    year VARCHAR(10) COMMENT '年份',
    mileage INT COMMENT '行驶里程',
    image_url VARCHAR(255) COMMENT '车辆照片',
    engine_number VARCHAR(50) COMMENT '发动机号',
    vin_number VARCHAR(50) COMMENT '车架号',
    is_default TINYINT DEFAULT 0 COMMENT '是否默认车辆 0-否 1-是',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '更新时间',
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='车辆表';

-- 轮播图表
CREATE TABLE IF NOT EXISTS t_banner (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    title VARCHAR(100) COMMENT '标题',
    `desc` VARCHAR(255) COMMENT '描述',
    background_color VARCHAR(20) COMMENT '背景颜色',
    link VARCHAR(255) COMMENT '跳转链接',
    image_url VARCHAR(255) COMMENT '图片URL',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 轮胎表
CREATE TABLE IF NOT EXISTS t_tire (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '轮胎名称',
    price DECIMAL(10,2) COMMENT '价格',
    brand VARCHAR(50) COMMENT '品牌',
    model VARCHAR(50) COMMENT '型号',
    size VARCHAR(50) COMMENT '尺寸',
    speed_rating VARCHAR(10) COMMENT '速度等级',
    description TEXT COMMENT '描述',
    features TEXT COMMENT '特点',
    stock INT DEFAULT 0 COMMENT '库存',
    rating DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
    sales INT DEFAULT 0 COMMENT '销量',
    is_hot TINYINT DEFAULT 0 COMMENT '是否热门 0-否 1-是',
    status TINYINT DEFAULT 1 COMMENT '状态 0-下架 1-上架',
    images VARCHAR(1000) COMMENT '轮胎图片，逗号分隔',
    background_color VARCHAR(20) COMMENT '背景颜色'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮胎表';

-- 服务表
CREATE TABLE IF NOT EXISTS t_service (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '服务名称',
    price DECIMAL(10,2) COMMENT '价格',
    description VARCHAR(500) COMMENT '描述',
    duration INT COMMENT '服务时长(分钟)',
    image_url VARCHAR(255) COMMENT '服务图片',
    is_recommended TINYINT DEFAULT 0 COMMENT '是否推荐 0-否 1-是',
    status TINYINT DEFAULT 1 COMMENT '状态 0-下架 1-上架',
    content TEXT COMMENT '服务内容',
    background_color VARCHAR(20) COMMENT '背景颜色'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务表';

-- 门店表
CREATE TABLE IF NOT EXISTS t_store (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '门店名称',
    address VARCHAR(255) COMMENT '门店地址',
    longitude DECIMAL(10,6) COMMENT '经度',
    latitude DECIMAL(10,6) COMMENT '纬度',
    hours VARCHAR(100) COMMENT '营业时间',
    phone VARCHAR(20) COMMENT '联系电话',
    is_default TINYINT DEFAULT 0 COMMENT '是否为默认门店 0-否 1-是',
    image_url VARCHAR(255) COMMENT '门店图片',
    status TINYINT DEFAULT 1 COMMENT '状态 0-关闭 1-营业中'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店表';

-- 预约表
CREATE TABLE IF NOT EXISTS t_appointment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    service_id BIGINT NOT NULL COMMENT '服务ID',
    car_id BIGINT NOT NULL COMMENT '车辆ID',
    store_id BIGINT NOT NULL COMMENT '门店ID',
    appointment_time DATETIME NOT NULL COMMENT '预约时间',
    remark VARCHAR(500) COMMENT '预约备注',
    status TINYINT DEFAULT 0 COMMENT '状态 0-待确认 1-已确认 2-已完成 3-已取消',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '更新时间',
    service_name VARCHAR(100) COMMENT '服务名称（冗余字段）',
    store_name VARCHAR(100) COMMENT '门店名称（冗余字段）',
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约表';

-- 汽车品牌表
CREATE TABLE IF NOT EXISTS `t_car_brand` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '品牌ID',
    `name` varchar(64) NOT NULL COMMENT '品牌名称',
    `letter` varchar(10) NOT NULL COMMENT '首字母(用于索引)',
    `logo` varchar(255) DEFAULT NULL COMMENT '品牌LOGO',
    `status` tinyint(4) DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `create_time` datetime DEFAULT NULL COMMENT '创建时间',
    `update_time` datetime DEFAULT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    INDEX `idx_letter` (`letter`),
    INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='汽车品牌表';

-- 汽车车型表
CREATE TABLE IF NOT EXISTS `t_car_model` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '车型ID',
    `brand_id` bigint(20) NOT NULL COMMENT '品牌ID',
    `name` varchar(64) NOT NULL COMMENT '车型名称',
    `image_url` varchar(255) DEFAULT NULL COMMENT '车型图片',
    `year` varchar(20) DEFAULT NULL COMMENT '年份',
    `status` tinyint(4) DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `create_time` datetime DEFAULT NULL COMMENT '创建时间',
    `update_time` datetime DEFAULT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    INDEX `idx_brand_id` (`brand_id`),
    INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='汽车车型表'; 