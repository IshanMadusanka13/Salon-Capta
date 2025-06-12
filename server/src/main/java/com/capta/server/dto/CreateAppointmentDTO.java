package com.capta.server.dto;

import com.capta.server.model.Appointment;
import com.capta.server.model.Employee;
import com.capta.server.model.Services;
import com.capta.server.model.User;
import com.capta.server.utils.enums.AppointmentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateAppointmentDTO {

    private int serviceId;
    private int userId;
    private int employeeId;
    private LocalDateTime timeSlot;
    private String notes;

    public Appointment DtoToEntity() {

        User user = new User();
        Employee employee = new Employee();
        Services service = new Services();

        user.setUserId(userId);
        employee.setEmployeeId(employeeId);
        service.setServiceId(serviceId);

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setEmployee(employee);
        appointment.setService(service);
        appointment.setNotes(notes);
        appointment.setTimeSlot(timeSlot);
        appointment.setStatus(AppointmentStatus.UPCOMING);

        return appointment;
    }

}
