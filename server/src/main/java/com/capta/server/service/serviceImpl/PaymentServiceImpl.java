package com.capta.server.service.serviceImpl;

import com.capta.server.model.Appointment;
import com.capta.server.model.Payment;
import com.capta.server.repository.PaymentRepository;
import com.capta.server.service.PaymentService;
import com.capta.server.utils.SendNotification;
import com.capta.server.utils.enums.PaymentType;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    public void createPayment(String sessionId) {
        log.info("Creating new payment");

        try {
            Session session = Session.retrieve(sessionId);
            String email = "mirangabandara8@gmail.com";// session.getCustomerDetails().getEmail();
            Long amount = session.getAmountTotal();
            String paymentIntent = session.getPaymentIntent();
            String appointmentId = session.getMetadata().get("appointmentId");
            String serviceName = session.getMetadata().get("serviceName");
            String smsMessage = "";

            Appointment appointment = new Appointment();
            appointment.setAppointmentId(Integer.parseInt(appointmentId));

            Payment payment = new Payment();
            payment.setAppointment(appointment);
            payment.setAmount((amount.doubleValue()) / 100);
            payment.setStripePaymentId(paymentIntent);
            payment.setTransactionDate(LocalDateTime.now());
            if (serviceName.equals("Tip")) {
                payment.setPaymentType(PaymentType.TIP);
                smsMessage = String.format(
                        "Thank You for the tip for Appointment with ID: %s. Amount paid: LKR %.2f",
                        appointmentId, (amount.doubleValue()) / 100);

            } else {
                payment.setPaymentType(PaymentType.PAYMENT);
                smsMessage = String.format(
                        "Successfully Booked an Appointment with ID: %s for %s service. Amount paid: LKR %.2f",
                        appointmentId, serviceName, (amount.doubleValue()) / 100);

            }
            Payment createdPayment = paymentRepository.save(payment);

            SendNotification.sendSMS(smsMessage);
            SendNotification.sendMail(email, "Booking Confirmed", smsMessage);

            log.info("Successfully created payment with ID: {} for amount: {}",
                    createdPayment.getPaymentId(), createdPayment.getAmount());

        } catch (Exception e) {
            e.printStackTrace();
            log.error(e);
        }
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

    @Override
    public String getStripePaymentUrl(String service, Long amount, int appointmentId) {
        log.info("Creating new payment for appointment ID");

        Stripe.apiKey = "sk_test_51RH39tQOKgNvdt7i19OzAaWaMqCeNlZRcKg5r4EzVIO6MV9HgpgXCpF35qN9wa1az4kUlOgF5vmukqxJDrm9xEJi00ztV7rjhA";

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("lkr")
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(service)
                                                                    .build())
                                                    .setUnitAmount(amount * 100)
                                                    .build())
                                    .setQuantity(1L)
                                    .build())
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:8080/api/payments/success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl("http://localhost:3000/cancel.html")
                    .putMetadata("appointmentId", String.valueOf(appointmentId))
                    .putMetadata("serviceName", service)
                    .build();
            Session session = Session.create(params);
            return session.getUrl();
        } catch (Exception e) {
            log.warn("Stripe URL generation failed : {}", e.getMessage());
            return null;
        }

    }

}