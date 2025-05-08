package com.capta.server.controller;

import com.capta.server.dto.CreateAppointmentDTO;
import com.capta.server.model.Appointment;
import com.capta.server.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> create(@RequestBody CreateAppointmentDTO appointment) {
        String appointmentId = appointmentService.createAppointment(appointment);
        Map<String, String> response = new HashMap<>();
        response.put("appointment", appointmentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> get(@PathVariable int id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getByUser(@PathVariable int userId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByUser(userId));
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Appointment>> getRecentAppointments() {
        return ResponseEntity.ok(appointmentService.getRecentAppointments());
    }

    @GetMapping("/slots/{userId}/{date}")
    public ResponseEntity<List<Appointment>> getSlots(@PathVariable int userId, @PathVariable String date) {
        return ResponseEntity.ok(appointmentService.loadAvailableSlots(userId, date));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> update(@PathVariable int id, @RequestBody Appointment updated) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable int id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
