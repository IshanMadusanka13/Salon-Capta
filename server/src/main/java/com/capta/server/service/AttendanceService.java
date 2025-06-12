package com.capta.server.service;

import com.capta.server.model.Attendance;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    String MarkAttendance(Attendance attendance);

    List<Attendance> getAllAttendance();

    List<Attendance> getAttendanceFiltered(Integer employeeId, LocalDate startDate, LocalDate endDate);
}
