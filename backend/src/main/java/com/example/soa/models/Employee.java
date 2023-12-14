package com.example.soa.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class Employee {
    @JsonIgnore
    private int objectId;
    private String firstName;
    private String lastName;

    @NotNull(message = "Employee ID cannot be null")
    @Min(value = 1, message = "Employee ID must be a positive integer")
    private int employeeID;
    private String designation;
    private List<Language> knownLanguages;

    public Employee() {
        this.objectId = 0;
        this.employeeID = 0;
        this.firstName = "";
        this.designation = "";
        this.lastName = "";
        this.knownLanguages = new ArrayList<>();
    }

    public int getObjectId() {
        return objectId;
    }

    public void setObjectId(int objectId) {
        this.objectId = objectId;
    }

    public Employee(int employeeID, String firstName, String lastName, String designation, List<Language> knownLanguages) {
        this.employeeID = employeeID;
        this.firstName = firstName;
        this.designation = designation;
        this.lastName = lastName;
        this.knownLanguages = knownLanguages;
    }

    public Employee(Employee newEmployee) {
//        this.employeeID = 0;
        this.objectId = 0;
        setFirstName(newEmployee.getFirstName());
        setDesignation(newEmployee.getDesignation());
        setLastName(newEmployee.getLastName());
        setKnownLanguages(newEmployee.getKnownLanguages());
    }

    // Getters and setters


    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public void setEmployeeID(int employeeID) {
        this.employeeID = employeeID;
    }

    public void setKnownLanguages(List<Language> knownLanguages) {
        this.knownLanguages = knownLanguages;
    }

    public int getEmployeeID() {
        return employeeID;
    }

    public String getDesignation() {
        return designation;
    }

    public List<Language> getKnownLanguages() {
        return knownLanguages;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", employeeID=" + employeeID +
                ", designation='" + designation + '\'' +
                ", knownLanguages=" + knownLanguages +
                '}';
    }
}
