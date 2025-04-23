package com.capta.server.service;

import com.capta.server.model.Payment;

import java.util.Optional;

public interface PaymentService {
    Payment createPayment(Payment payment);
    Optional<Payment> getPaymentById(int id);
    Optional<Payment> getPaymentByAppointmentId(int appointmentId);
    Payment updatePayment(int id, Payment payment);
}

