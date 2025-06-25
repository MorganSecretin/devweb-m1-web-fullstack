package fr.ynov.devweb.services;

import fr.ynov.devweb.dtos.ApplicantDto;
import fr.ynov.devweb.dtos.PersonDto;
import fr.ynov.devweb.entities.Applicant;
import fr.ynov.devweb.entities.Person;
import fr.ynov.devweb.exceptions.DuplicateResourceException;
import fr.ynov.devweb.exceptions.ResourceNotFoundException;
import fr.ynov.devweb.exceptions.ValidationException;
import fr.ynov.devweb.repositories.ApplicantRepository;
import fr.ynov.devweb.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicantService {

    @Autowired
    private ApplicantRepository applicantRepository;

    @Autowired
    private PersonRepository personRepository;    // Créer un nouveau candidat
    public ApplicantDto createApplicant(ApplicantDto applicantDto) {
        // Validation des données
        if (applicantDto.getPerson() == null) {
            throw new ValidationException("Les informations de la personne sont obligatoires");
        }
        if (applicantDto.getPerson().getEmail() == null || applicantDto.getPerson().getEmail().trim().isEmpty()) {
            throw new ValidationException("L'email est obligatoire");
        }
        if (applicantDto.getPerson().getId() == null || applicantDto.getPerson().getId().trim().isEmpty()) {
            throw new ValidationException("L'ID de la personne est obligatoire");
        }
        if (applicantDto.getNote() != null && (applicantDto.getNote() < 0 || applicantDto.getNote() > 10)) {
            throw new ValidationException("La note doit être comprise entre 0 et 10");
        }

        try {
            // Vérifier si un candidat avec cet ID existe déjà
            if (applicantRepository.findById(applicantDto.getPerson().getId()).isPresent()) {
                throw new DuplicateResourceException("Un candidat avec cet ID existe déjà");
            }

            // Vérifier si une personne avec cet email existe déjà
            Optional<Person> existingPersonByEmail = personRepository.findByEmail(applicantDto.getPerson().getEmail());
            if (existingPersonByEmail.isPresent()) {
                throw new DuplicateResourceException("Une personne avec cet email existe déjà");
            }

            // Créer ou récupérer la personne
            Person person = convertPersonDtoToEntity(applicantDto.getPerson());
            person = personRepository.save(person);

            // Créer le candidat
            Applicant applicant = new Applicant();
            applicant.setId(person.getId());
            applicant.setNote(applicantDto.getNote());
            applicant.setDomain(applicantDto.getDomain());
            applicant.setInterviewDate(applicantDto.getInterviewDate());
            applicant.setComment(applicantDto.getComment());

            applicant = applicantRepository.save(applicant);
            
            // Récupérer les données complètes pour le retour
            PersonDto personDto = convertPersonToDto(person);
            ApplicantDto result = new ApplicantDto();
            result.setPerson(personDto);
            result.setNote(applicant.getNote());
            result.setDomain(applicant.getDomain());
            result.setInterviewDate(applicant.getInterviewDate());
            result.setComment(applicant.getComment());
            
            return result;
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null && e.getMessage().contains("EMAIL")) {
                throw new DuplicateResourceException("Un candidat avec cet email existe déjà");
            } else if (e.getMessage() != null && e.getMessage().contains("PRIMARY")) {
                throw new DuplicateResourceException("Un candidat avec cet ID existe déjà");
            }
            throw new ValidationException("Erreur de validation des données");
        }
    }

    // Lire tous les candidats
    public List<ApplicantDto> getAllApplicants() {
        return applicantRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }    // Lire un candidat par ID (Person)
    public ApplicantDto getApplicantById(String personId) {
        if (personId == null || personId.trim().isEmpty()) {
            throw new ValidationException("L'ID du candidat est obligatoire");
        }
        
        return applicantRepository.findById(personId)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Candidat non trouvé avec l'ID: " + personId));
    }    // Mettre à jour un candidat
    public ApplicantDto updateApplicant(String personId, ApplicantDto applicantDto) {
        if (personId == null || personId.trim().isEmpty()) {
            throw new ValidationException("L'ID du candidat est obligatoire");
        }
        if (applicantDto.getPerson() == null) {
            throw new ValidationException("Les informations de la personne sont obligatoires");
        }
        if (applicantDto.getPerson().getEmail() == null || applicantDto.getPerson().getEmail().trim().isEmpty()) {
            throw new ValidationException("L'email est obligatoire");
        }
        if (applicantDto.getNote() != null && (applicantDto.getNote() < 0 || applicantDto.getNote() > 10)) {
            throw new ValidationException("La note doit être comprise entre 0 et 10");
        }

        try {
            Applicant applicant = applicantRepository.findById(personId)
                    .orElseThrow(() -> new ResourceNotFoundException("Candidat non trouvé avec l'ID: " + personId));
            
            // Mettre à jour les données de la personne
            Person person = personRepository.findById(personId)
                    .orElseThrow(() -> new ResourceNotFoundException("Personne non trouvée avec l'ID: " + personId));
            
            // Vérifier si l'email est déjà utilisé par une autre personne
            Optional<Person> existingPersonByEmail = personRepository.findByEmail(applicantDto.getPerson().getEmail());
            if (existingPersonByEmail.isPresent() && !existingPersonByEmail.get().getId().equals(personId)) {
                throw new DuplicateResourceException("Une personne avec cet email existe déjà");
            }
            
            updatePersonFromDto(person, applicantDto.getPerson());
            personRepository.save(person);
            
            // Mettre à jour les données du candidat
            applicant.setNote(applicantDto.getNote());
            applicant.setDomain(applicantDto.getDomain());
            applicant.setInterviewDate(applicantDto.getInterviewDate());
            applicant.setComment(applicantDto.getComment());
            
            applicant = applicantRepository.save(applicant);
            return convertToDto(applicant);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage() != null && e.getMessage().contains("EMAIL")) {
                throw new DuplicateResourceException("Un candidat avec cet email existe déjà");
            }
            throw new ValidationException("Erreur de validation des données");
        }
    }

    // Supprimer un candidat
    public void deleteApplicant(String personId) {
        if (personId == null || personId.trim().isEmpty()) {
            throw new ValidationException("L'ID du candidat est obligatoire");
        }
        
        Applicant applicant = applicantRepository.findById(personId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidat non trouvé avec l'ID: " + personId));
        
        applicantRepository.delete(applicant);
    }    // Convertir Applicant vers ApplicantDto
    private ApplicantDto convertToDto(Applicant applicant) {
        Optional<Person> personOpt = personRepository.findById(applicant.getId());
        PersonDto personDto = personOpt.map(this::convertPersonToDto).orElse(null);
        
        return new ApplicantDto(
                personDto,
                applicant.getNote(),
                applicant.getDomain(),
                applicant.getInterviewDate(),
                applicant.getComment()
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
