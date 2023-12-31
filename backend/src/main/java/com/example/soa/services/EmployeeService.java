package com.example.soa.services;

import com.example.soa.models.Employee;
import com.example.soa.models.Language;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final List<Employee> employees;
    private static final String JSON_FILE_PATH = "employees.json";

    public EmployeeService() throws IOException {
        employees = new ArrayList<>();
        try {
            File jsonFile = new ClassPathResource(JSON_FILE_PATH).getFile();

            if (jsonFile.exists()) {
                // If the file exists, load data from it
                loadEmployeesFromJsonFile();
            } else {
                // If the file doesn't exist, generate default data and save it to the file
//            generateDefaultData();


                boolean isCreated = jsonFile.createNewFile();

                if (isCreated) {
                    saveEmployeesToJsonFile();
                } else {
                    throw new IOException("Failed to create JSON file");
                }

            }
        } catch (FileNotFoundException e) {
            // Handle the file not found exception
            throw new IOException("JSON file not found", e);
        } catch (IOException e) {
            // Handle other IO exceptions
            throw new IOException("Error initializing EmployeeService", e);
        } catch (Exception e) {
            throw new IOException(e.getMessage());
        }
    }

    private void loadEmployeesFromJsonFile() throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        ClassPathResource resource = new ClassPathResource(JSON_FILE_PATH);

        try (InputStream inputStream = resource.getInputStream()) {
            Employee[] loadedEmployees = objectMapper.readValue(inputStream, Employee[].class);
            employees.addAll(Arrays.asList(loadedEmployees));
        }
    }

    private void saveEmployeesToJsonFile() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        ClassPathResource resource = new ClassPathResource(JSON_FILE_PATH);

        try (OutputStream outputStream = Files.newOutputStream(resource.getFile().toPath())) {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(outputStream, employees);
        }
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
//        int newEmployeeId = employees.stream().mapToInt(Employee::getObjectId).max().orElse(0) + 1;
//        newEmployee.setObjectId(newEmployeeId);

        employees.add(newEmployee);

        saveEmployeesToJsonFile();
        return newEmployee;
    }

    public Employee updateEmployee(int employeeId, Employee updatedEmployee) {
        Employee existingEmployee = getEmployeeById(employeeId);

        if (existingEmployee != null) {
            // Update employee details
            existingEmployee.setEmployeeID(updatedEmployee.getEmployeeID());
            existingEmployee.setFirstName(updatedEmployee.getFirstName());
            existingEmployee.setLastName(updatedEmployee.getLastName());
            existingEmployee.setDesignation(updatedEmployee.getDesignation());
            existingEmployee.setKnownLanguages(updatedEmployee.getKnownLanguages());

            try {
                saveEmployeesToJsonFile();
            } catch (IOException e) {
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

        } catch (IOException e) {
            return false;
        }

    }


    public List<Employee> sortEmployees(List<Employee> filteredEmployees, String sortKey) {


        switch (sortKey) {
            case "firstName":
                filteredEmployees.sort(Comparator.comparing(Employee::getFirstName));
                break;
            case "lastName":
                filteredEmployees.sort(Comparator.comparing(Employee::getLastName));
                break;
            case "designation":
                filteredEmployees.sort(Comparator.comparing(Employee::getDesignation));
                break;
            case "employeeID":
                filteredEmployees.sort(Comparator.comparingInt(Employee::getEmployeeID));
                break;
            default:

                boolean isLanguage = (employees.stream().anyMatch(employee -> hasLanguage(employee, sortKey)));

                if (isLanguage) {
                    filteredEmployees.sort(Comparator.comparingInt(employee -> {
                        // Find the sorted language in the knownLanguages list
                        Optional<Language> sortedLanguage = employee.getKnownLanguages().stream()
                                .filter(lang -> sortKey.equalsIgnoreCase(lang.getLanguageName()))
                                .findFirst();

                        // If found, return the score; otherwise, return a default value
                        return sortedLanguage.map(Language::getScoreOutof100).orElse(0);
                    }));
                }
                break;
        }


        return filteredEmployees;
    }

    public List<Employee> searchEmployees(String firstName, String lastName, Integer employeeId, String designation, String languageName, Integer minScore, Integer maxScore) {
        return employees.stream()
                .filter(employee -> isNullOrEqualsIgnoreCase(firstName, employee.getFirstName()))
                .filter(employee -> isNullOrEqualsIgnoreCase(lastName, employee.getLastName()))
                .filter(employee -> (employeeId == null || employeeId.equals(employee.getEmployeeID())))
                .filter(employee -> isNullOrEqualsIgnoreCase(designation, employee.getDesignation()))
                .filter(employee -> (languageName == null || hasLanguage(employee, languageName)))
                .filter(employee -> (minScore == null || maxScore == null || languageName == null || hasLanguageWithScoreInRange(employee, languageName, minScore, maxScore)))
                .collect(Collectors.toList());
    }

    private boolean isNullOrEqualsIgnoreCase(String value1, String value2) {
        return value1 == null || value2 != null && value2.equalsIgnoreCase(value1);
    }

    private boolean hasLanguage(Employee employee, String languageName) {
        return employee.getKnownLanguages().stream()
                .anyMatch(language -> language.getLanguageName().equalsIgnoreCase(languageName));
    }

    // Helper method to check if an employee has a language with a score in the specified range
    private boolean hasLanguageWithScoreInRange(Employee employee, String languageName, Integer minScore, Integer maxScore) {
        return employee.getKnownLanguages().stream()
                .anyMatch(language ->
                        language.getLanguageName().equalsIgnoreCase(languageName) &&
                                language.getScoreOutof100() >= minScore &&
                                language.getScoreOutof100() <= maxScore);
    }

}
