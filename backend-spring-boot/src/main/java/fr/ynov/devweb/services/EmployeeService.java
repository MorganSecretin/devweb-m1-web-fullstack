package fr.ynov.devweb.services;

import fr.ynov.devweb.dtos.EmployeeDto;
import fr.ynov.devweb.entities.Employee;
import fr.ynov.devweb.exceptions.DuplicateResourceException;
import fr.ynov.devweb.exceptions.ResourceNotFoundException;
import fr.ynov.devweb.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
        return new EmployeeDto(
                employee.getId(), employee.getName(), employee.getBirth(),
                employee.getAddress(), employee.getEmail(), employee.getPhone(),
                employee.getJob(), employee.getSalary(), employee.getContractStart(),
                employee.getContractEnd(), employee.getComment()
        );
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