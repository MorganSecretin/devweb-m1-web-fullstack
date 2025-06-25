package fr.ynov.devweb.controllers;

import fr.ynov.devweb.dtos.EmployeeDto;
import fr.ynov.devweb.dtos.AbsenceDto;
import fr.ynov.devweb.dtos.VacationDto;
import fr.ynov.devweb.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/count")
    public ResponseEntity<Long> getEmployeeCount() {
        long count = employeeService.getAllEmployees().size();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // Créer un nouvel employé
    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
        EmployeeDto createdEmployee = employeeService.createEmployee(employeeDto);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }

    // Obtenir tous les employés
    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> employees = employeeService.getAllEmployees();
        // Toujours retourner 200 OK avec la liste (même si elle est vide)
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    // Obtenir un employé par ID
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable("id") String id) {
        EmployeeDto employee = employeeService.getEmployeeById(id);
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    // Mettre à jour un employé
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable("id") String id, @Valid @RequestBody EmployeeDto employeeDto) {
        EmployeeDto updatedEmployee = employeeService.updateEmployee(id, employeeDto);
        return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
    }

    // Supprimer un employé
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteEmployee(@PathVariable("id") String id) {
        employeeService.deleteEmployee(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Ajouter une absence à un employé
    @PostMapping("/{id}/absences")
    public ResponseEntity<EmployeeDto> addAbsenceToEmployee(@PathVariable("id") String id, @Valid @RequestBody AbsenceDto absenceDto) {
        EmployeeDto updatedEmployee = employeeService.addAbsenceToEmployee(id, absenceDto);
        return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
    }

    // Ajouter un congé à un employé
    @PostMapping("/{id}/vacations")
    public ResponseEntity<EmployeeDto> addVacationToEmployee(@PathVariable("id") String id, @Valid @RequestBody VacationDto vacationDto) {
        EmployeeDto updatedEmployee = employeeService.addVacationToEmployee(id, vacationDto);
        return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
    }
}
