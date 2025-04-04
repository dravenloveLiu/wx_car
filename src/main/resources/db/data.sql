USE car_service;

-- 插入测试用户数据
INSERT INTO t_user (phone, nickname, avatar, gender, open_id, member_level, points, register_time, last_login_time)
VALUES
('13800138000', '测试用户1', 'https://example.com/avatar1.jpg', 1, 'wx_123456', 0, 100, NOW(), NOW()),
('13900139000', '测试用户2', 'https://example.com/avatar2.jpg', 2, 'wx_234567', 1, 500, NOW(), NOW()),
('13700137000', '测试用户3', 'https://example.com/avatar3.jpg', 1, 'wx_345678', 2, 1000, NOW(), NOW());

-- 插入测试车辆数据
INSERT INTO t_car (user_id, brand, model, plate_number, year, mileage, engine_number, vin_number, is_default, create_time, update_time)
VALUES
(1, '丰田', '卡罗拉', '京A12345', '2020', 15000, 'ENG123456', 'VIN123456789', 1, NOW(), NOW()),
(1, '本田', '思域', '京B67890', '2019', 25000, 'ENG234567', 'VIN234567890', 0, NOW(), NOW()),
(2, '大众', '帕萨特', '京C12345', '2021', 8000, 'ENG345678', 'VIN345678901', 1, NOW(), NOW()),
(3, '宝马', '3系', '京D67890', '2022', 5000, 'ENG456789', 'VIN456789012', 1, NOW(), NOW());

-- 插入测试轮播图数据
INSERT INTO t_banner (title, `desc`, background_color, link, image_url, sort, status)
VALUES
('夏季轮胎特惠', '畅享夏日驾驶乐趣，全场轮胎8折起', '#FF5733', '/pages/tire/list', 'https://example.com/banner1.jpg', 1, 1),
('免费检测活动', '预约免费检测，确保行车安全', '#33FF57', '/pages/service/detail?id=1', 'https://example.com/banner2.jpg', 2, 1),
('会员专享折扣', '成为会员即可享受专属优惠', '#3357FF', '/pages/member/index', 'https://example.com/banner3.jpg', 3, 1),
('新店开业', '新店盛大开业，预约有礼', '#FF33A8', '/pages/store/detail?id=2', 'https://example.com/banner4.jpg', 4, 1);

-- 插入测试轮胎数据
INSERT INTO t_tire (name, price, brand, model, size, speed_rating, description, features, stock, rating, sales, is_hot, status, images, background_color)
VALUES
('固特异 Eagle F1', 899.00, '固特异', 'Eagle F1', '215/55R17', 'W', '固特异旗舰系列轮胎，卓越的操控性和舒适性', '抓地力强,静音舒适,排水性能好', 100, 4.9, 320, 1, 1, 'https://example.com/tire1_1.jpg,https://example.com/tire1_2.jpg', '#E0F7FA'),
('米其林 Pilot Sport 4', 1099.00, '米其林', 'Pilot Sport 4', '225/45R18', 'Y', '米其林高性能运动轮胎，提供卓越的操控体验', '高速稳定性好,湿地抓地力强,耐久性高', 80, 4.8, 280, 1, 1, 'https://example.com/tire2_1.jpg,https://example.com/tire2_2.jpg', '#F9FBE7'),
('倍耐力 P Zero', 1299.00, '倍耐力', 'P Zero', '235/40R19', 'Y', '倍耐力顶级性能轮胎，为高性能车型设计', 'F1赛道技术,超高抓地力,极速操控', 50, 4.7, 220, 1, 1, 'https://example.com/tire3_1.jpg,https://example.com/tire3_2.jpg', '#FFF3E0'),
('普利司通 Potenza', 999.00, '普利司通', 'Potenza', '225/50R17', 'W', '普利司通高性能轮胎，平衡操控性和舒适性', '静音设计,精准操控,耐磨损', 120, 4.6, 300, 1, 1, 'https://example.com/tire4_1.jpg,https://example.com/tire4_2.jpg', '#E8F5E9'),
('马牌 UltraContact UC6', 799.00, '马牌', 'UltraContact UC6', '215/60R16', 'H', '马牌舒适系列轮胎，低噪音和出色的湿地制动', '超静音,舒适驾驶,省油节能', 150, 4.7, 350, 1, 1, 'https://example.com/tire5_1.jpg,https://example.com/tire5_2.jpg', '#E3F2FD'),
('韩泰 Ventus V12', 699.00, '韩泰', 'Ventus V12', '205/55R16', 'V', '韩泰性价比高性能轮胎，平稳驾驶体验', '高性价比,操控性好,耐磨', 200, 4.5, 400, 0, 1, 'https://example.com/tire6_1.jpg,https://example.com/tire6_2.jpg', '#F3E5F5'),
('邓禄普 SP Sport', 899.00, '邓禄普', 'SP Sport', '215/55R17', 'W', '邓禄普运动轮胎，提供卓越的抓地力和反馈', '湿地性能强,低噪音,操控精准', 90, 4.6, 270, 0, 1, 'https://example.com/tire7_1.jpg,https://example.com/tire7_2.jpg', '#FFFDE7'),
('锦湖 Ecsta PS71', 749.00, '锦湖', 'Ecsta PS71', '205/50R17', 'W', '锦湖高性能轮胎，良好的转向响应和制动性能', '高速稳定,低滚动阻力,耐用', 110, 4.4, 250, 0, 1, 'https://example.com/tire8_1.jpg,https://example.com/tire8_2.jpg', '#F1F8E9');

-- 插入测试服务数据
INSERT INTO t_service (name, price, description, duration, image_url, is_recommended, status, content, background_color)
VALUES
('轮胎更换', 50.00, '专业轮胎更换服务，包括拆卸、安装和动平衡', 60, 'https://example.com/service1.jpg', 1, 1, '1. 车辆检查\n2. 拆卸旧轮胎\n3. 安装新轮胎\n4. 动平衡调整\n5. 胎压检测和调整\n6. 质量检查和路试', '#EDE7F6'),
('四轮定位', 200.00, '专业四轮定位调整，解决车辆跑偏和轮胎异常磨损问题', 90, 'https://example.com/service2.jpg', 1, 1, '1. 车辆检查\n2. 轮胎气压调整\n3. 四轮定位测量\n4. 调整前束、外倾角等参数\n5. 调整后再次测量\n6. 路试检查', '#E8EAF6'),
('刹车系统检修', 150.00, '刹车系统全面检查与维修，确保行车安全', 120, 'https://example.com/service3.jpg', 1, 1, '1. 刹车系统全面检查\n2. 刹车片磨损检测\n3. 刹车盘检查\n4. 刹车油检查或更换\n5. 调整刹车系统\n6. 路试检查制动效果', '#E1F5FE'),
('发动机保养', 300.00, '全面发动机保养服务，包括机油和滤清器更换', 120, 'https://example.com/service4.jpg', 1, 1, '1. 更换发动机机油\n2. 更换机油滤清器\n3. 更换空气滤清器\n4. 更换汽油滤清器\n5. 检查皮带张力\n6. 清洗节气门\n7. 检查火花塞\n8. 发动机舱清洁', '#F9FBE7'),
('空调系统维护', 200.00, '空调系统检查与维护，保持良好的制冷效果', 90, 'https://example.com/service5.jpg', 0, 1, '1. 检查空调制冷效果\n2. 检查空调系统管路\n3. 清洗空调滤芯\n4. 检查空调压缩机\n5. 必要时添加制冷剂\n6. 出风口消毒清洗', '#E0F2F1'),
('全车检测', 100.00, '全车各系统的综合检测，及时发现潜在问题', 120, 'https://example.com/service6.jpg', 0, 1, '1. 底盘检查\n2. 悬挂系统检查\n3. 传动系统检查\n4. 刹车系统检查\n5. 转向系统检查\n6. 电子系统检查\n7. 灯光系统检查\n8. 出具详细检测报告', '#F3E5F5'),
('洗车美容', 80.00, '专业洗车美容服务，包括外部清洗和内饰清洁', 60, 'https://example.com/service7.jpg', 0, 1, '1. 车身外部清洗\n2. 车轮清洁\n3. 车内吸尘\n4. 仪表盘清洁\n5. 座椅清洁\n6. 玻璃清洁\n7. 轮胎上光\n8. 车身打蜡', '#FFF8E1'),
('底盘装甲', 500.00, '底盘防锈防腐处理，延长车辆使用寿命', 180, 'https://example.com/service8.jpg', 0, 1, '1. 底盘清洗\n2. 底盘检查\n3. 防锈剂喷涂\n4. 防护层施工\n5. 密封处理\n6. 最终检查', '#FFEBEE');

-- 插入测试门店数据
INSERT INTO t_store (name, address, longitude, latitude, hours, phone, is_default, image_url, status)
VALUES
('总店', '北京市海淀区西三环北路25号', 116.32123, 39.98123, '09:00-18:00', '010-12345678', 1, 'https://example.com/store1.jpg', 1),
('朝阳分店', '北京市朝阳区建国路88号', 116.46521, 39.90865, '09:00-20:00', '010-87654321', 0, 'https://example.com/store2.jpg', 1),
('丰台分店', '北京市丰台区丰台路20号', 116.28756, 39.85632, '09:00-19:00', '010-23456789', 0, 'https://example.com/store3.jpg', 1),
('昌平分店', '北京市昌平区回龙观西大街6号', 116.34126, 40.07652, '09:30-19:30', '010-34567890', 0, 'https://example.com/store4.jpg', 1);

-- 插入测试预约数据
INSERT INTO t_appointment (user_id, service_id, car_id, store_id, appointment_time, remark, status, create_time, update_time, service_name, store_name)
VALUES
(1, 1, 1, 1, DATE_ADD(NOW(), INTERVAL 2 DAY), '尽快处理，谢谢', 0, NOW(), NOW(), '轮胎更换', '总店'),
(1, 3, 1, 2, DATE_ADD(NOW(), INTERVAL 5 DAY), '刹车有异响', 1, NOW(), NOW(), '刹车系统检修', '朝阳分店'),
(2, 2, 3, 1, DATE_ADD(NOW(), INTERVAL 3 DAY), '方向盘有抖动', 1, NOW(), NOW(), '四轮定位', '总店'),
(3, 4, 4, 3, DATE_ADD(NOW(), INTERVAL 7 DAY), '常规保养', 2, NOW(), NOW(), '发动机保养', '丰台分店'); 