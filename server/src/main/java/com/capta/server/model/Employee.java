package com.capta.server.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int employeeId;

    private String name;

    private LocalDate dob;

    private String gender;

    private String address;

    private String phone;

    private String nic;

    private String email;

    private LocalDate joinDate;
}
