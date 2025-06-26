package com.capta.server.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "pos_transactions")
public class PosTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transactionId;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = true)
    private Appointment appointment;

    @OneToMany(mappedBy = "serviceId", cascade = CascadeType.ALL)
    private List<Services> services = new ArrayList<>();

    @OneToMany(mappedBy = "productId", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();

    private String customer;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDateTime transactionTime;

    private double totalAmount;

    private String paymentMethod;

}
