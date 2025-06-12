package com.capta.server.model;

import com.capta.server.utils.enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int attendanceId;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDateTime arrival;

    private LocalDateTime departure;

    @Enumerated(EnumType.STRING)
    @Column(name="attendance_status")
    private AttendanceStatus attendanceStatus;

}
