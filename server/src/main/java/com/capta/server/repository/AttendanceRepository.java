package com.capta.server.repository;

import com.capta.server.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    List<Attendance> findByEmployee_EmployeeId(int employeeId);

    List<Attendance> findByEmployee_EmployeeIdAndArrivalBetween(int employee_employeeId, LocalDateTime arrival, LocalDateTime departure);

    List<Attendance> findByArrivalBetween(LocalDateTime start, LocalDateTime end);

}
