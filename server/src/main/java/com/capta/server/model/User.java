package com.capta.server.model;

import com.capta.server.utils.enums.UserType;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    private String name;

    private String email;

    private String mobile;

    @Enumerated(EnumType.STRING)
    @Column(name="user_type")
    private UserType userType = UserType.CUSTOMER;

    private String password;

}

