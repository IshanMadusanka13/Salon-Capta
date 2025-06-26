package com.capta.server.service.serviceImpl;

import com.capta.server.model.Attendance;
import com.capta.server.model.Employee;
import com.capta.server.model.Salary;
import com.capta.server.repository.AppointmentRepository;
import com.capta.server.repository.AttendanceRepository;
import com.capta.server.service.EmployeeService;
import com.capta.server.service.SalaryService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
public class SalaryServiceImpl implements SalaryService {

    private final EmployeeService employeeService;
    private final AppointmentRepository appointmentRepository;
    private final AttendanceRepository attendanceRepository;

    @Autowired
    public SalaryServiceImpl(EmployeeService employeeService, AppointmentRepository appointmentRepository, AttendanceRepository attendanceRepository) {
        this.employeeService = employeeService;
        this.appointmentRepository = appointmentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public List<Salary> generateSalaries(LocalDate date) {
        log.info("Generating Salaries for month of: {}", date);
        List<Salary> salaries = new ArrayList<>();
        List<Employee> employees = employeeService.getAllEmployees();

        LocalDate firstDayOfMonth = date.withDayOfMonth(1);
        LocalDate lastDayOfMonth = date.withDayOfMonth(date.lengthOfMonth());

        for (Employee employee : employees) {
            double baseSalary = employee.getBaseSalary();

            int serviceCount = appointmentRepository.countByEmployeeAndTimeSlotBetween(
                    employee,
                    firstDayOfMonth.atStartOfDay(),
                    lastDayOfMonth.atTime(LocalTime.MAX)
            );

            List<Attendance> attendances = attendanceRepository.findByEmployee_EmployeeIdAndArrivalBetween(
                    employee.getEmployeeId(),
                    firstDayOfMonth.atStartOfDay(),
                    lastDayOfMonth.atTime(LocalTime.MAX)
            );

            int presentDays = 0, absentDays = 0, leaveDays = 0;
            for (Attendance attendance : attendances) {
                switch (attendance.getAttendanceStatus()) {
                    case PRESENT -> presentDays++;
                    case ABSENT -> absentDays++;
                    case LEAVE -> leaveDays++;
                }
            }

            int totalWorkingDays = calculateWorkingDays(firstDayOfMonth, lastDayOfMonth);

            double dailySalary = baseSalary / totalWorkingDays;

            double serviceBonus = serviceCount * 200;
            double attendanceBonus = presentDays * 200;

            double absenceDeduction = absentDays * (dailySalary * 0.5);
            double leaveDeduction = leaveDays * (dailySalary * 0.1);

            double grossSalary = baseSalary + serviceBonus + attendanceBonus;
            double totalDeductions = absenceDeduction + leaveDeduction;
            double totalSalary = grossSalary - totalDeductions;

            Salary salary = new Salary();
            salary.setBaseSalary(baseSalary);
            salary.setCommision(serviceBonus);
            salary.setPerformance(attendanceBonus - (absenceDeduction + leaveDeduction));
            salary.setServicesProvided(serviceCount);
            salary.setMonth(date);
            salary.setTotalSalary(totalSalary);
            salaries.add(salary);

        }

        return salaries;
    }

    private int calculateWorkingDays(LocalDate startDate, LocalDate endDate) {
        int workingDays = 0;
        LocalDate date = startDate;

        while (!date.isAfter(endDate)) {
            DayOfWeek day = date.getDayOfWeek();
            if (day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY) {
                workingDays++;
            }
            date = date.plusDays(1);
        }

        return workingDays;
    }

}
