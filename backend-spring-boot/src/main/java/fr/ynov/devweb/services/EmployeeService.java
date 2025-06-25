package fr.ynov.devweb.services;

import fr.ynov.devweb.dtos.EmployeeDto;
import fr.ynov.devweb.dtos.AbsenceDto;
import fr.ynov.devweb.dtos.VacationDto;
import fr.ynov.devweb.entities.Employee;
import fr.ynov.devweb.entities.Absence;
import fr.ynov.devweb.entities.Vacation;
import fr.ynov.devweb.exceptions.DuplicateResourceException;
import fr.ynov.devweb.exceptions.ResourceNotFoundException;
import fr.ynov.devweb.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        checkDuplicates(employeeDto);
        return toDto(employeeRepository.save(fromDto(employeeDto)));
    }

    public EmployeeDto getEmployeeById(String id) {
        return employeeRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'ID: " + id));
    }

    public EmployeeDto updateEmployee(String id, EmployeeDto employeeDto) {
        checkEmailDuplicateForUpdate(employeeDto.getEmail(), id);
        employeeDto.setId(id);
        return toDto(employeeRepository.save(fromDto(employeeDto)));
    }

    public void deleteEmployee(String id) {
        employeeRepository.delete(findEmployeeById(id));
    }

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public EmployeeDto addAbsenceToEmployee(String employeeId, AbsenceDto absenceDto) {
        Employee employee = findEmployeeById(employeeId);
        
        Absence absence = new Absence();
        absence.setDate(absenceDto.getDate());
        absence.setDescription(absenceDto.getDescription());
        absence.setEmployee(employee);
        
        if (employee.getAbsences() == null) {
            employee.setAbsences(new ArrayList<>());
        }
        employee.getAbsences().add(absence);
        
        Employee savedEmployee = employeeRepository.save(employee);
        return toDto(savedEmployee);
    }

    public EmployeeDto addVacationToEmployee(String employeeId, VacationDto vacationDto) {
        Employee employee = findEmployeeById(employeeId);
        
        Vacation vacation = new Vacation();
        vacation.setStartDate(vacationDto.getStartDate());
        vacation.setEndDate(vacationDto.getEndDate());
        vacation.setEmployee(employee);
        
        if (employee.getVacations() == null) {
            employee.setVacations(new ArrayList<>());
        }
        employee.getVacations().add(vacation);
        
        Employee savedEmployee = employeeRepository.save(employee);
        return toDto(savedEmployee);
    }

    private void checkDuplicates(EmployeeDto dto) {
        if (employeeRepository.findById(dto.getId()).isPresent())
            throw new DuplicateResourceException("Employé avec cet ID existe déjà");
        if (employeeRepository.findByEmail(dto.getEmail()).isPresent())
            throw new DuplicateResourceException("Employé avec cet email existe déjà");
    }

    private void checkEmailDuplicateForUpdate(String email, String excludeId) {
        employeeRepository.findByEmail(email)
                .filter(employee -> !employee.getId().equals(excludeId))
                .ifPresent(employee -> {
                    throw new DuplicateResourceException("Employé avec cet email existe déjà");
                });
    }

    private Employee findEmployeeById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé: " + id));
    }

    private EmployeeDto toDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setBirth(employee.getBirth());
        dto.setAddress(employee.getAddress());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setJob(employee.getJob());
        dto.setSalary(employee.getSalary());
        dto.setContractStart(employee.getContractStart());
        dto.setContractEnd(employee.getContractEnd());
        dto.setComment(employee.getComment());
        
        // Convertir les vacations
        if (employee.getVacations() != null) {
            dto.setVacations(employee.getVacations().stream()
                .map(this::vacationToDto)
                .collect(Collectors.toList()));
        }
        
        // Convertir les absences
        if (employee.getAbsences() != null) {
            dto.setAbsences(employee.getAbsences().stream()
                .map(this::absenceToDto)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    private VacationDto vacationToDto(Vacation vacation) {
        VacationDto dto = new VacationDto();
        dto.setId(vacation.getId());
        dto.setStartDate(vacation.getStartDate());
        dto.setEndDate(vacation.getEndDate());
        return dto;
    }

    private AbsenceDto absenceToDto(Absence absence) {
        AbsenceDto dto = new AbsenceDto();
        dto.setId(absence.getId());
        dto.setDate(absence.getDate());
        dto.setDescription(absence.getDescription());
        return dto;
    }

    private Employee fromDto(EmployeeDto dto) {
        Employee employee = new Employee();
        employee.setId(dto.getId());
        employee.setName(dto.getName());
        employee.setBirth(dto.getBirth());
        employee.setAddress(dto.getAddress());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setJob(dto.getJob());
        employee.setSalary(dto.getSalary());
        employee.setContractStart(dto.getContractStart());
        employee.setContractEnd(dto.getContractEnd());
        employee.setComment(dto.getComment());
        return employee;
    }
}