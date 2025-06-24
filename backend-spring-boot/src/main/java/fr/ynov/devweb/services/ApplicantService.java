package fr.ynov.devweb.services;

import fr.ynov.devweb.dtos.ApplicantDto;
import fr.ynov.devweb.dtos.PersonDto;
import fr.ynov.devweb.entities.Applicant;
import fr.ynov.devweb.entities.Person;
import fr.ynov.devweb.repositories.ApplicantRepository;
import fr.ynov.devweb.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    }

    // Lire tous les candidats
    public List<ApplicantDto> getAllApplicants() {
        return applicantRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }    // Lire un candidat par ID (Person)
    public Optional<ApplicantDto> getApplicantById(String personId) {
        return applicantRepository.findById(personId)
                .map(this::convertToDto);
    }    // Mettre à jour un candidat
    public Optional<ApplicantDto> updateApplicant(String personId, ApplicantDto applicantDto) {
        Optional<Applicant> applicantOpt = applicantRepository.findById(personId);
        if (applicantOpt.isPresent()) {
            Applicant applicant = applicantOpt.get();
            
            // Mettre à jour les données de la personne
            Optional<Person> personOpt = personRepository.findById(personId);
            if (personOpt.isPresent()) {
                Person person = personOpt.get();
                updatePersonFromDto(person, applicantDto.getPerson());
                personRepository.save(person);
            }
            
            // Mettre à jour les données du candidat
            applicant.setNote(applicantDto.getNote());
            applicant.setDomain(applicantDto.getDomain());
            applicant.setInterviewDate(applicantDto.getInterviewDate());
            applicant.setComment(applicantDto.getComment());
            
            applicant = applicantRepository.save(applicant);
            return Optional.of(convertToDto(applicant));
        }
        return Optional.empty();
    }

    // Supprimer un candidat
    public boolean deleteApplicant(String personId) {
        Optional<Applicant> applicant = applicantRepository.findById(personId);
        if (applicant.isPresent()) {
            applicantRepository.delete(applicant.get());
            return true;
        }
        return false;
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
