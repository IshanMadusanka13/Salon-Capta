package com.capta.server.model;

import com.capta.server.utils.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int appointmentId;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDateTime timeSlot;

    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name="status")
    private AppointmentStatus status;
}