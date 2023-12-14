package com.example.soa.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

import com.example.soa.models.Employee;

@Service
public class EmployeeService {

    private final List<Employee> employees;
    private static final String JSON_FILE_PATH = "employees.json";

    public EmployeeService() throws IOException {
        employees = new ArrayList<>();

        File jsonFile = new ClassPathResource(JSON_FILE_PATH).getFile();

        if (jsonFile.exists()) {
            // If the file exists, load data from it
            loadEmployeesFromJsonFile();
        } else {
            // If the file doesn't exist, generate default data and save it to the file
//            generateDefaultData();
            jsonFile.createNewFile();

            saveEmployeesToJsonFile();
        }
    }

    private void loadEmployeesFromJsonFile() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        ClassPathResource resource = new ClassPathResource(JSON_FILE_PATH);
        Employee[] loadedEmployees = objectMapper.readValue(resource.getInputStream(), Employee[].class);
        employees.addAll(Arrays.asList(loadedEmployees));
    }

    private void saveEmployeesToJsonFile() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        File jsonFile = new ClassPathResource(JSON_FILE_PATH).getFile();
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(jsonFile, employees);
    }

    public List<Employee> getAllEmployees() {
        return employees;
    }

    public Employee getEmployeeById(int employeeId) {
        return employees.stream()
                .filter(employee -> employee.getEmployeeID() == employeeId)
                .findFirst()
                .orElse(null);
    }

    public Employee createEmployee(Employee newEmployee) throws IOException {
        // Assign a new employee ID (for simplicity, not recommended for production)
        int newEmployeeId = employees.stream().mapToInt(Employee::getObjectId).max().orElse(0) + 1;
        newEmployee.setObjectId(newEmployeeId);

        employees.add(newEmployee);

        saveEmployeesToJsonFile();
        return newEmployee;
    }

    public Employee updateEmployee(int employeeId, Employee updatedEmployee) {
        Employee existingEmployee = getEmployeeById(employeeId);

        if (existingEmployee != null) {
            // Update employee details
            existingEmployee.setFirstName(updatedEmployee.getFirstName());
            existingEmployee.setLastName(updatedEmployee.getLastName());
            existingEmployee.setDesignation(updatedEmployee.getDesignation());
            existingEmployee.setKnownLanguages(updatedEmployee.getKnownLanguages());

            try {
                saveEmployeesToJsonFile();
            }catch (IOException e){
                return null;
            }
        }
        return existingEmployee;
    }

    public boolean deleteEmployee(int employeeId) {
        try {

            boolean isDeleted = employees.removeIf(employee -> employee.getEmployeeID() == employeeId);
            if (isDeleted) {
                saveEmployeesToJsonFile();
            }

            return isDeleted;

        }catch (IOException e){
            return false;
        }

    }
}
