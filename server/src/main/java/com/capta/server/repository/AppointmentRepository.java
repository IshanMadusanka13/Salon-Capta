package com.capta.server.repository;

import com.capta.server.model.Appointment;
import com.capta.server.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByUser_UserId(int customerId);

    List<Appointment> findByTimeSlot(LocalDateTime start);

    List<Appointment> findByEmployee_EmployeeIdAndTimeSlotBetween(int employeeId, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByTimeSlotBetween(LocalDateTime start, LocalDateTime end);

    List<Appointment> findTop10ByOrderByTimeSlotDesc();

    int countByEmployeeAndTimeSlotBetween(Employee employee, LocalDateTime timeSlot, LocalDateTime timeSlot2);
}

