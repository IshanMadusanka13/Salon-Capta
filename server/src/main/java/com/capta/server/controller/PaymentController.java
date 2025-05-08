package com.capta.server.controller;

import com.capta.server.model.Payment;
import com.capta.server.service.PaymentService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/stripe/{appointmentId}/{service}/{amount}")
    public ResponseEntity<Map<String, String>> getStripePaymentUrl(@PathVariable String service, @PathVariable Long amount, @PathVariable int appointmentId) {
        String url = paymentService.getStripePaymentUrl(service, amount, appointmentId);
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Payment> get(@PathVariable int id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Payment> getByAppointment(@PathVariable int appointmentId) {
        return paymentService.getPaymentByAppointmentId(appointmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> update(@PathVariable int id, @RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.updatePayment(id, payment));
    }

    @GetMapping("/success")
    public void handlePaymentSuccess(@RequestParam("session_id") String sessionId, HttpServletResponse response) {
        try {
            paymentService.createPayment(sessionId);

            response.sendRedirect("http://localhost:3000");
        } catch (Exception e) {
            try {
                response.sendRedirect("http://localhost:3000/error");
            } catch (IOException ioException) {
                ioException.printStackTrace();
            }
        }
    }


}
