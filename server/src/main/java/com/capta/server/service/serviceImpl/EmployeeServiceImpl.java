package com.capta.server.service.serviceImpl;

import com.capta.server.model.Employee;
import com.capta.server.repository.EmployeeRepository;
import com.capta.server.service.EmployeeService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
        log.info("EmployeeService initialized with EmployeeRepository");
    }

    @Override
    public Employee createEmployee(Employee employee) {
        log.info("Creating new employee with email: {}", employee.getEmail());
        log.debug("Employee details - Name: {}, Phone: {}", employee.getName(), employee.getPhone());

        Employee createdEmployee = employeeRepository.save(employee);
        log.info("Successfully created employee with ID: {}", createdEmployee.getEmployeeId());
        return createdEmployee;
    }

    @Override
    public Optional<Employee> getEmployeeById(int id) {
        log.info("Fetching employee by ID: {}", id);
        Optional<Employee> employee = employeeRepository.findById(id);

        if (employee.isPresent()) {
            log.info("Found employee with ID: {} - Name: {}", id, employee.get().getName());
        } else {
            log.warn("No employee found with ID: {}", id);
        }
        return employee;
    }

    @Override
    public List<Employee> getAllEmployees() {
        log.info("Fetching all employees");
        List<Employee> employees = employeeRepository.findAll();

        log.info("Found {} employees", employees.size());
        if (!employees.isEmpty()) {
            log.debug("Employee IDs: {}",
                    employees.stream()
                            .map(Employee::getEmployeeId)
                            .collect(Collectors.toList()));
        }
        return employees;
    }

    @Override
    public Employee updateEmployee(int id, Employee updated) {
        log.info("Updating employee with ID: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Employee not found with ID: {}", id);
                    return new RuntimeException("Employee not found");
                });

        log.debug("Updating details - Old: Name={}, Email={}, Phone={} | New: Name={}, Email={}, Phone={}",
                employee.getName(), employee.getEmail(), employee.getPhone(),
                updated.getName(), updated.getEmail(), updated.getPhone());

        employee.setName(updated.getName());
        employee.setEmail(updated.getEmail());
        employee.setPhone(updated.getPhone());

        Employee savedEmployee = employeeRepository.save(employee);
        log.info("Successfully updated employee with ID: {}", id);
        return savedEmployee;
    }

    @Override
    public void deleteEmployee(int id) {
        log.info("Attempting to delete employee with ID: {}", id);
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            log.info("Successfully deleted employee with ID: {}", id);
        } else {
            log.warn("Delete failed - no employee found with ID: {}", id);
        }
    }
}