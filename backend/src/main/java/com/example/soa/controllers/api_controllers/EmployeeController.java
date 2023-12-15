package com.example.soa.controllers.api_controllers;

import com.example.soa.models.Employee;
import com.example.soa.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin
@Validated
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Employee>> getEmployees() throws IOException {
        List<Employee> employees;
        employees = employeeService.getAllEmployees();
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable int employeeId) {
        Employee employee = employeeService.getEmployeeById(employeeId);
        if (employee != null) {
            return new ResponseEntity<>(employee, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) Integer employeeId,
            @RequestParam(required = false) String designation,
            @RequestParam(required = false) String languageName,
            @RequestParam(required = false,defaultValue = "0") Integer minScore,
            @RequestParam(required = false,defaultValue = "100") Integer maxScore,
            @RequestParam(required = false,defaultValue = "employeeID") String sortKey,
            @RequestParam(required = false, defaultValue = "asc") String sortBy) {

        List<Employee> matchedEmployees = employeeService.searchEmployees(firstName, employeeId, designation, languageName, minScore, maxScore);

        if (matchedEmployees.isEmpty()) {
            return new ResponseEntity<>(matchedEmployees, HttpStatus.NOT_FOUND);
        }

//        sort result
        List<Employee> sortedEmployees = employeeService.sortEmployees(matchedEmployees,sortKey);

        // Apply sorting order
        if ("desc".equalsIgnoreCase(sortBy)) {
            Collections.reverse(sortedEmployees);
        }

        return new ResponseEntity<>(sortedEmployees, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee newEmployee) throws IOException {
        Employee createdEmployee = employeeService.createEmployee(newEmployee);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }


    @PutMapping("/{employeeId}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable int employeeId, @RequestBody Employee updatedEmployee) {
        Employee updated = employeeService.updateEmployee(employeeId, updatedEmployee);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable int employeeId) {
        boolean deleted = employeeService.deleteEmployee(employeeId);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
