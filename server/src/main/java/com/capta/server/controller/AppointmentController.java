package com.capta.server.controller;

import com.capta.server.dto.CreateAppointmentDTO;
import com.capta.server.model.Appointment;
import com.capta.server.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Appointment> create(@RequestBody CreateAppointmentDTO appointment) {
        return ResponseEntity.ok(appointmentService.createAppointment(appointment));
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
