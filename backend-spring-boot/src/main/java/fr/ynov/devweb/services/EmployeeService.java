package fr.ynov.devweb.services;

import fr.ynov.devweb.dtos.EmployeeDto;
import fr.ynov.devweb.dtos.PersonDto;
import fr.ynov.devweb.entities.Employee;
import fr.ynov.devweb.entities.Person;
import fr.ynov.devweb.exceptions.DuplicateResourceException;
import fr.ynov.devweb.exceptions.ResourceNotFoundException;
import fr.ynov.devweb.exceptions.ValidationException;
import fr.ynov.devweb.repositories.EmployeeRepository;
import fr.ynov.devweb.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
        // Validation des données
        if (employeeDto.getPerson() == null) {
            throw new ValidationException("Les informations de la personne sont obligatoires");
        }
        if (employeeDto.getPerson().getEmail() == null || employeeDto.getPerson().getEmail().trim().isEmpty()) {
            throw new ValidationException("L'email est obligatoire");
        }
        if (employeeDto.getPerson().getId() == null || employeeDto.getPerson().getId().trim().isEmpty()) {
            throw new ValidationException("L'ID de la personne est obligatoire");
        }
        if (employeeDto.getSalary() != null && employeeDto.getSalary() < 0) {
            throw new ValidationException("Le salaire ne peut pas être négatif");
        }

        try {
            // Vérifier si un employé avec cet ID existe déjà
            if (employeeRepository.findById(employeeDto.getPerson().getId()).isPresent()) {
                throw new DuplicateResourceException("Un employé avec cet ID existe déjà");
            }

            // Vérifier si une personne avec cet email existe déjà
            Optional<Person> existingPersonByEmail = personRepository.findByEmail(employeeDto.getPerson().getEmail());
            if (existingPersonByEmail.isPresent()) {
                throw new DuplicateResourceException("Une personne avec cet email existe déjà");
            }

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
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null && e.getMessage().contains("EMAIL")) {
                throw new DuplicateResourceException("Un employé avec cet email existe déjà");
            } else if (e.getMessage() != null && e.getMessage().contains("PRIMARY")) {
                throw new DuplicateResourceException("Un employé avec cet ID existe déjà");
            }
            throw new ValidationException("Erreur de validation des données");
        }
    }

    // Lire tous les employés
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }    // Lire un employé par ID (Person)
    public EmployeeDto getEmployeeById(String personId) {
        if (personId == null || personId.trim().isEmpty()) {
            throw new ValidationException("L'ID de l'employé est obligatoire");
        }
        
        return employeeRepository.findById(personId)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'ID: " + personId));
    }    // Mettre à jour un employé
    public EmployeeDto updateEmployee(String personId, EmployeeDto employeeDto) {
        if (personId == null || personId.trim().isEmpty()) {
            throw new ValidationException("L'ID de l'employé est obligatoire");
        }
        if (employeeDto.getPerson() == null) {
            throw new ValidationException("Les informations de la personne sont obligatoires");
        }
        if (employeeDto.getPerson().getEmail() == null || employeeDto.getPerson().getEmail().trim().isEmpty()) {
            throw new ValidationException("L'email est obligatoire");
        }
        if (employeeDto.getSalary() != null && employeeDto.getSalary() < 0) {
            throw new ValidationException("Le salaire ne peut pas être négatif");
        }

        try {
            Employee employee = employeeRepository.findById(personId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'ID: " + personId));
            
            // Mettre à jour les données de la personne
            Person person = personRepository.findById(personId)
                    .orElseThrow(() -> new ResourceNotFoundException("Personne non trouvée avec l'ID: " + personId));
            
            // Vérifier si l'email est déjà utilisé par une autre personne
            Optional<Person> existingPersonByEmail = personRepository.findByEmail(employeeDto.getPerson().getEmail());
            if (existingPersonByEmail.isPresent() && !existingPersonByEmail.get().getId().equals(personId)) {
                throw new DuplicateResourceException("Une personne avec cet email existe déjà");
            }
            
            updatePersonFromDto(person, employeeDto.getPerson());
            personRepository.save(person);
            
            // Mettre à jour les données de l'employé
            employee.setJob(employeeDto.getJob());
            employee.setSalary(employeeDto.getSalary());
            employee.setContractStart(employeeDto.getContractStart());
            employee.setContractEnd(employeeDto.getContractEnd());
            employee.setComment(employeeDto.getComment());
            
            employee = employeeRepository.save(employee);
            return convertToDto(employee);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null && e.getMessage().contains("EMAIL")) {
                throw new DuplicateResourceException("Un employé avec cet email existe déjà");
            }
            throw new ValidationException("Erreur de validation des données");
        }
    }

    // Supprimer un employé
    public void deleteEmployee(String personId) {
        if (personId == null || personId.trim().isEmpty()) {
            throw new ValidationException("L'ID de l'employé est obligatoire");
        }
        
        Employee employee = employeeRepository.findById(personId)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'ID: " + personId));
        
        employeeRepository.delete(employee);
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
