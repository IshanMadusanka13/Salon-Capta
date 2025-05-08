package com.capta.server.service;

import com.capta.server.model.Payment;

import java.util.Optional;

public interface PaymentService {

    void createPayment(String sessionId);

    Optional<Payment> getPaymentById(int id);

    Optional<Payment> getPaymentByAppointmentId(int appointmentId);

    Payment updatePayment(int id, Payment payment);

    String getStripePaymentUrl(String service, Long amount, int appointmentId);
}

