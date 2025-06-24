package fr.ynov.devweb.services;

import fr.ynov.devweb.dtos.EmployeeDto;
import fr.ynov.devweb.dtos.PersonDto;
import fr.ynov.devweb.entities.Employee;
import fr.ynov.devweb.entities.Person;
import fr.ynov.devweb.repositories.EmployeeRepository;
import fr.ynov.devweb.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PersonRepository personRepository;    // Créer un nouvel employé
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        // Créer ou récupérer la personne
        Person person = convertPersonDtoToEntity(employeeDto.getPerson());
        person = personRepository.save(person);

        // Créer l'employé
        Employee employee = new Employee();
        employee.setId(person.getId());
        employee.setJob(employeeDto.getJob());
        employee.setSalary(employeeDto.getSalary());
        employee.setContractStart(employeeDto.getContractStart());
        employee.setContractEnd(employeeDto.getContractEnd());
        employee.setComment(employeeDto.getComment());

        employee = employeeRepository.save(employee);
        
        // Récupérer les données complètes pour le retour
        PersonDto personDto = convertPersonToDto(person);
        EmployeeDto result = new EmployeeDto();
        result.setPerson(personDto);
        result.setJob(employee.getJob());
        result.setSalary(employee.getSalary());
        result.setContractStart(employee.getContractStart());
        result.setContractEnd(employee.getContractEnd());
        result.setComment(employee.getComment());
        
        return result;
    }

    // Lire tous les employés
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }    // Lire un employé par ID (Person)
    public Optional<EmployeeDto> getEmployeeById(String personId) {
        return employeeRepository.findById(personId)
                .map(this::convertToDto);
    }    // Mettre à jour un employé
    public Optional<EmployeeDto> updateEmployee(String personId, EmployeeDto employeeDto) {
        Optional<Employee> employeeOpt = employeeRepository.findById(personId);
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();
            
            // Mettre à jour les données de la personne
            Optional<Person> personOpt = personRepository.findById(personId);
            if (personOpt.isPresent()) {
                Person person = personOpt.get();
                updatePersonFromDto(person, employeeDto.getPerson());
                personRepository.save(person);
            }
            
            // Mettre à jour les données de l'employé
            employee.setJob(employeeDto.getJob());
            employee.setSalary(employeeDto.getSalary());
            employee.setContractStart(employeeDto.getContractStart());
            employee.setContractEnd(employeeDto.getContractEnd());
            employee.setComment(employeeDto.getComment());
            
            employee = employeeRepository.save(employee);
            return Optional.of(convertToDto(employee));
        }
        return Optional.empty();
    }

    // Supprimer un employé
    public boolean deleteEmployee(String personId) {
        Optional<Employee> employee = employeeRepository.findById(personId);
        if (employee.isPresent()) {
            employeeRepository.delete(employee.get());
            return true;
        }
        return false;
    }    // Convertir Employee vers EmployeeDto
    private EmployeeDto convertToDto(Employee employee) {
        Optional<Person> personOpt = personRepository.findById(employee.getId());
        PersonDto personDto = personOpt.map(this::convertPersonToDto).orElse(null);
        
        return new EmployeeDto(
                personDto,
                employee.getJob(),
                employee.getSalary(),
                employee.getContractStart(),
                employee.getContractEnd(),
                employee.getComment()
        );
    }

    // Convertir Person vers PersonDto
    private PersonDto convertPersonToDto(Person person) {
        return new PersonDto(
                person.getId(),
                person.getName(),
                person.getBirth(),
                person.getAddress(),
                person.getEmail(),
                person.getPhone()
        );
    }

    // Convertir PersonDto vers Person
    private Person convertPersonDtoToEntity(PersonDto personDto) {
        Person person = new Person();
        person.setId(personDto.getId());
        person.setName(personDto.getName());
        person.setBirth(personDto.getBirth());
        person.setAddress(personDto.getAddress());
        person.setEmail(personDto.getEmail());
        person.setPhone(personDto.getPhone());
        return person;
    }

    // Mettre à jour Person depuis PersonDto
    private void updatePersonFromDto(Person person, PersonDto personDto) {
        person.setName(personDto.getName());
        person.setBirth(personDto.getBirth());
        person.setAddress(personDto.getAddress());
        person.setEmail(personDto.getEmail());
        person.setPhone(personDto.getPhone());
    }
}
