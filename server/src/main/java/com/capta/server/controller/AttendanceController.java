package com.capta.server.controller;

import com.capta.server.model.Attendance;
import com.capta.server.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @Autowired
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> MarkAttendance(@RequestBody Attendance attendance) {
        String attendanceId = attendanceService.MarkAttendance(attendance);
        Map<String, String> response = new HashMap<>();
        response.put("attendance", attendanceId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/filter/{employeeId}/{startDate}/{endDate}")
    public ResponseEntity<List<Attendance>> getAttendanceFiltered(@PathVariable Integer employeeId, @PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getAttendanceFiltered(employeeId, startDate, endDate));
    }

}
