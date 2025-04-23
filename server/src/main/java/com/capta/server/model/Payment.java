package com.capta.server.model;

import java.time.LocalDateTime;

import com.capta.server.utils.enums.PaymentType;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(name="payment_type")
    private PaymentType paymentType;

    private String stripePaymentId;

    private LocalDateTime transactionDate;
}

