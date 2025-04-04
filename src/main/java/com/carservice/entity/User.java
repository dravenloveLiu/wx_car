package com.carservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体类
 */
@Data
@TableName("t_user")
public class User {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 手机号
     */
    private String phone;
    
    /**
     * 昵称
     */
    private String nickname;
    
    /**
     * 头像
     */
    private String avatar;
    
    /**
     * 性别 0-未知 1-男 2-女
     */
    private Integer gender;
    
    /**
     * 微信openId
     */
    private String openId;
    
    /**
     * 用户token
     */
    private String token;
    
    /**
     * 真实姓名
     */
    private String realName;
    
    /**
     * 会员等级 0-普通用户 1-银卡会员 2-金卡会员 3-铂金会员
     */
    private Integer memberLevel;
    
    /**
     * 会员积分
     */
    private Integer points;
    
    /**
     * 注册时间
     */
    private LocalDateTime registerTime;
    
    /**
     * 最后登录时间
     */
    private LocalDateTime lastLoginTime;
    
    /**
     * 微信头像URL
     */
    private String avatarUrl;
} 