package com.capta.server.service.serviceImpl;

import com.capta.server.model.Payment;
import com.capta.server.repository.PaymentRepository;
import com.capta.server.service.PaymentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Log4j2
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
        log.info("PaymentServiceImpl initialized with PaymentRepository");
    }

    @Override
    public Payment createPayment(Payment payment) {
        log.info("Creating new payment for appointment ID: {}", payment.getAppointment().getAppointmentId());
        Payment createdPayment = paymentRepository.save(payment);
        log.info("Successfully created payment with ID: {} for amount: {}",
                createdPayment.getPaymentId(), createdPayment.getAmount());
        return createdPayment;
    }

    @Override
    public Optional<Payment> getPaymentById(int id) {
        log.info("Fetching payment by ID: {}", id);
        Optional<Payment> payment = paymentRepository.findById(id);
        if (payment.isPresent()) {
            log.info("Found payment with ID: {} for amount: {}", id, payment.get().getAmount());
        } else {
            log.warn("No payment found with ID: {}", id);
        }
        return payment;
    }

    @Override
    public Optional<Payment> getPaymentByAppointmentId(int appointmentId) {
        log.info("Fetching payment for appointment ID: {}", appointmentId);
        Optional<Payment> payment = paymentRepository.findByAppointment_AppointmentId(appointmentId);
        if (payment.isPresent()) {
            log.info("Found payment with ID: {} for appointment ID: {}",
                    payment.get().getPaymentId(), appointmentId);
        } else {
            log.warn("No payment found for appointment ID: {}", appointmentId);
        }
        return payment;
    }

    @Override
    public Payment updatePayment(int id, Payment updatedPayment) {
        log.info("Attempting to update payment with ID: {}", id);
        return paymentRepository.findById(id).map(payment -> {
            log.debug("Updating payment amount from {} to {}",
                    payment.getAmount(), updatedPayment.getAmount());
            payment.setAmount(updatedPayment.getAmount());

            Payment savedPayment = paymentRepository.save(payment);
            log.info("Successfully updated payment with ID: {}", id);
            return savedPayment;
        }).orElseThrow(() -> {
            log.error("Payment not found with ID: {}", id);
            return new RuntimeException("Payment not found");
        });
    }
}