package com.capta.server.service;

import com.capta.server.model.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    Employee createEmployee(Employee employee);
    Optional<Employee> getEmployeeById(int id);
    List<Employee> getAllEmployees();
    Employee updateEmployee(int id, Employee employee);
    void deleteEmployee(int id);
}
