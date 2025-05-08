package com.capta.server.service.serviceImpl;

import com.capta.server.model.Appointment;
import com.capta.server.repository.AppointmentRepository;
import com.capta.server.service.ReminderService;
import com.capta.server.utils.SendNotification;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Log4j2
public class ReminderServiceImpl implements ReminderService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public ReminderServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
        log.info("ReminderService initialized with AppointmentRepository");
    }

    @Override
    @Scheduled(cron = "0 0 18 * * ?")
    public void sendEmailReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Appointment> bookings = appointmentRepository.findByTimeSlotBetween(tomorrow.atStartOfDay(), tomorrow.atTime(LocalTime.MAX));
    
        bookings.forEach(booking -> {
            try {
                String subject = "Salon Capta: Your Appointment Tomorrow";
                String body = String.format(
                    "Dear %s,\n\n" +
                    "This is a friendly reminder that you have an appointment scheduled tomorrow at Salon Capta.\n\n" +
                    "Appointment Details:\n" +
                    "- Service: %s\n" +
                    "- Stylist: %s\n" +
                    "- Date: %s\n" +
                    "- Time: %s\n\n" +
                    "If you need to reschedule, please contact us at least 24 hours in advance.\n\n" +
                    "We look forward to seeing you!\n\n" +
                    "Warm regards,\n" +
                    "The Salon Capta Team",
                    booking.getUser().getName(),
                    booking.getService().getName(),
                    booking.getEmployee().getName(),
                    booking.getTimeSlot().toLocalDate(),
                    booking.getTimeSlot().toLocalTime().format(java.time.format.DateTimeFormatter.ofPattern("hh:mm a"))
                );
                
                SendNotification.sendMail(booking.getUser().getEmail(), subject, body);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }
    
    @Override
    @Scheduled(cron = "0 0 6 * * ?")
    public void sendSmsReminders() {
        LocalDate today = LocalDate.now();
        List<Appointment> bookings = appointmentRepository.findByTimeSlotBetween(today.atStartOfDay(), today.atTime(LocalTime.MAX));
    
        bookings.forEach(booking -> {
            String message = String.format(
                "Salon Capta Reminder: You have an appointment today at %s with %s for %s. We look forward to seeing you! Call %s if you need assistance.",
                booking.getTimeSlot().toLocalTime().format(java.time.format.DateTimeFormatter.ofPattern("hh:mm a")),
                booking.getEmployee().getName(),
                booking.getService().getName(),
                "077-123-4567" // Replace with actual salon contact number
            );
            
            SendNotification.sendSMS(message);
        });
    }
    
}
