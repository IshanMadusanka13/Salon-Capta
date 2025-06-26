package com.capta.server.service;

import com.capta.server.model.Salary;

import java.time.LocalDate;
import java.util.List;

public interface SalaryService {
    List<Salary> generateSalaries(LocalDate date);
}
