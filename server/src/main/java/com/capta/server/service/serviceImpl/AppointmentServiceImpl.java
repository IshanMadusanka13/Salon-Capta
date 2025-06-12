package com.capta.server.service.serviceImpl;

import com.capta.server.dto.CreateAppointmentDTO;
import com.capta.server.model.Appointment;
import com.capta.server.repository.AppointmentRepository;
import com.capta.server.service.AppointmentService;
import com.capta.server.utils.enums.AppointmentStatus;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
        log.info("AppointmentService initialized with AppointmentRepository");
    }

    @Override
    public String createAppointment(CreateAppointmentDTO appointment) {
        log.info("Creating new appointment for user ID: {}", appointment.getUserId());

        Appointment createdAppointment = appointmentRepository.save(appointment.DtoToEntity());
        log.info("Successfully created appointment with ID: {}", createdAppointment.getAppointmentId());

        return String.valueOf(createdAppointment.getAppointmentId());
    }

    @Override
    public List<Appointment> getAllAppointments() {
        log.info("Getting All Appointments");
        List<Appointment> appointments = appointmentRepository.findAll();
        log.info("Successfully got All Appointments");
        return appointments;
    }

    @Override
    public List<Appointment> getRecentAppointments() {
        log.info("Getting appointments from today to 5 days ahead");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fiveDaysLater = now.plusDays(5);

        log.info(now);
        log.info(fiveDaysLater);

        List<Appointment> appointments = appointmentRepository
                .findByTimeSlotBetween(now, fiveDaysLater);

        log.info("Found {} upcoming appointments", appointments.size());
        return appointments;
    }

    @Override
    public Optional<Appointment> getAppointmentById(int id) {
        log.info("Fetching appointment by ID: {}", id);
        Optional<Appointment> appointment = appointmentRepository.findById(id);

        if (appointment.isPresent()) {
            log.info("Found appointment with ID: {} for user ID: {}",
                    id, appointment.get().getUser().getUserId());
        } else {
            log.warn("No appointment found with ID: {}", id);
        }
        return appointment;
    }

    @Override
    public List<Appointment> getAppointmentsByUser(int userId) {
        log.info("Fetching appointments for user ID: {}", userId);
        List<Appointment> appointments = appointmentRepository.findByUser_UserId(userId);

        log.info("Found {} appointments for user ID: {}", appointments.size(), userId);
        if (!appointments.isEmpty()) {
            log.debug("Appointment IDs: {}",
                    appointments.stream()
                            .map(Appointment::getAppointmentId)
                            .collect(Collectors.toList()));
        }
        return appointments;
    }

    @Override
    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        log.info("Fetching appointments between {} and {}", start, end);
        List<Appointment> appointments = appointmentRepository.findByTimeSlotBetween(start, end);

        log.info("Found {} appointments in date range", appointments.size());
        if (!appointments.isEmpty()) {
            log.debug("Appointment time range details: Earliest: {}, Latest: {}",
                    appointments.stream().map(Appointment::getTimeSlot).min(LocalDateTime::compareTo).orElse(null),
                    appointments.stream().map(Appointment::getTimeSlot).max(LocalDateTime::compareTo).orElse(null));
        }
        return appointments;
    }

    @Override
    public Appointment updateAppointment(int id, Appointment updatedAppointment) {
        log.info("Updating appointment with ID: {}", id);
        return appointmentRepository.findById(id).map(app -> {
            log.debug("Original appointment - Start: {}, Service: {}",
                    app.getTimeSlot(), app.getService().getName());
            log.debug("Updated appointment - Start: {}, Service: {}",
                    updatedAppointment.getTimeSlot(),
                    updatedAppointment.getService().getName());

            app.setTimeSlot(updatedAppointment.getTimeSlot());
            app.setService(updatedAppointment.getService());

            Appointment savedAppointment = appointmentRepository.save(app);
            log.info("Successfully updated appointment with ID: {}", id);
            return savedAppointment;
        }).orElseThrow(() -> {
            log.error("Failed to update - appointment not found with ID: {}", id);
            return new RuntimeException("Appointment not found");
        });
    }

    @Override
    public void cancelAppointment(int id) {
        log.info("Attempting to cancel appointment with ID: {}", id);
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            log.info("Successfully canceled appointment with ID: {}", id);
        } else {
            log.warn("Cancel failed - no appointment found with ID: {}", id);
        }
    }

    @Override
    public List<Appointment> loadAvailableSlots(int employeeId, String date) {
        log.info("Loading Available Slots");
        return appointmentRepository.findByEmployee_EmployeeIdAndTimeSlotBetween(employeeId,
                LocalDate.parse(date).atStartOfDay(), LocalDate.parse(date).atTime(LocalTime.MAX));
    }

    @Override
    public Appointment updateAppointmentStatus(int id, String status) {
        log.info("Updating appointment Status with ID: {}", id);
        String cleanStatus = status.replace("\"", "");

        return appointmentRepository.findById(id).map(app -> {
            app.setStatus(AppointmentStatus.valueOf(cleanStatus));
            Appointment savedAppointment = appointmentRepository.save(app);
            log.info("Successfully updated appointment status with ID: {}", id);
            return savedAppointment;
        }).orElseThrow(() -> {
            log.error("Failed to update - appointment not found with ID: {}", id);
            return new RuntimeException("Appointment not found");
        });
    }

}