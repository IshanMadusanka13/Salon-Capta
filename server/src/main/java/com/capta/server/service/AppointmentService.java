package com.capta.server.service;

import com.capta.server.dto.CreateAppointmentDTO;
import com.capta.server.model.Appointment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {
    String createAppointment(CreateAppointmentDTO appointment);

    List<Appointment> getAllAppointments();

    List<Appointment> getRecentAppointments();

    Optional<Appointment> getAppointmentById(int id);

    List<Appointment> getAppointmentsByUser(int userId);

    List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end);

    Appointment updateAppointment(int id, Appointment appointment);

    void cancelAppointment(int id);

    List<Appointment> loadAvailableSlots(int employeeId, String date);

    Appointment updateAppointmentStatus(int id, String status);
}
