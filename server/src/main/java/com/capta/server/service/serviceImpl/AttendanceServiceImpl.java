package com.capta.server.service.serviceImpl;

import com.capta.server.model.Attendance;
import com.capta.server.repository.AttendanceRepository;
import com.capta.server.service.AttendanceService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Log4j2
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;

    @Autowired
    public AttendanceServiceImpl(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public String MarkAttendance(Attendance attendance) {
        log.info("Marking Attendance for Employee ID: {}", attendance.getEmployee().getEmployeeId());

        Attendance markedAttendance = attendanceRepository.save(attendance);
        log.info("Successfully marked Attendance with ID: {}", attendance.getEmployee().getEmployeeId());

        return String.valueOf(markedAttendance.getAttendanceId());
    }

    @Override
    public List<Attendance> getAllAttendance() {
        log.info("Getting All Attendances");
        List<Attendance> attendances = attendanceRepository.findAll();
        log.info("Successfully got All Attendances");
        return attendances;
    }

    @Override
    public List<Attendance> getAttendanceFiltered(Integer employeeId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching attendance records with filters - Employee ID: {}, DateRange: {} - {}", employeeId, startDate, endDate);

        List<Attendance> attendances;

        if (employeeId != 0 && !Objects.equals(startDate, LocalDate.of(1900, 1, 1))) {
            attendances = attendanceRepository.findByEmployee_EmployeeIdAndArrivalBetween(employeeId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
        } else if (employeeId != 0) {
            attendances = attendanceRepository.findByEmployee_EmployeeId(employeeId);
        } else if (!Objects.equals(startDate, LocalDate.of(1900, 1, 1))) {
            attendances = attendanceRepository.findByArrivalBetween(startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
        } else {
            attendances = attendanceRepository.findAll();
        }

        log.info("Found {} attendance records.", attendances.size());

        if (!attendances.isEmpty()) {
            log.debug("Attendance IDs: {}", attendances.stream()
                    .map(Attendance::getAttendanceId)
                    .collect(Collectors.toList()));
        }

        return attendances;
    }

}
