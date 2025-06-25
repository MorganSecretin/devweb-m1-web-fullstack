package fr.ynov.devweb.services;

import fr.ynov.devweb.dtos.ApplicantDto;
import fr.ynov.devweb.entities.Applicant;
import fr.ynov.devweb.exceptions.DuplicateResourceException;
import fr.ynov.devweb.exceptions.ResourceNotFoundException;
import fr.ynov.devweb.repositories.ApplicantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicantService {

    @Autowired
    private ApplicantRepository applicantRepository;

    public ApplicantDto createApplicant(ApplicantDto applicantDto) {
        System.out.println("Creating applicant: " + applicantDto);
        checkDuplicates(applicantDto);
        return toDto(applicantRepository.save(fromDto(applicantDto)));
    }

    public ApplicantDto getApplicantById(String id) {
        return applicantRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Candidat non trouvé avec l'ID: " + id));
    }

    public ApplicantDto updateApplicant(String id, ApplicantDto applicantDto) {
        checkEmailDuplicateForUpdate(applicantDto.getEmail(), id);
        applicantDto.setId(id);
        return toDto(applicantRepository.save(fromDto(applicantDto)));
    }

    public void deleteApplicant(String id) {
        applicantRepository.delete(findApplicantById(id));
    }

    public List<ApplicantDto> getAllApplicants() {
        return applicantRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private void checkDuplicates(ApplicantDto dto) {
        if (applicantRepository.findById(dto.getId()).isPresent())
            throw new DuplicateResourceException("Candidat avec cet ID existe déjà");
        if (applicantRepository.findByEmail(dto.getEmail()).isPresent())
            throw new DuplicateResourceException("Candidat avec cet email existe déjà");
    }

    private void checkEmailDuplicateForUpdate(String email, String excludeId) {
        applicantRepository.findByEmail(email)
                .filter(applicant -> !applicant.getId().equals(excludeId))
                .ifPresent(applicant -> {
                    throw new DuplicateResourceException("Candidat avec cet email existe déjà");
                });
    }

    private Applicant findApplicantById(String id) {
        return applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidat non trouvé: " + id));
    }

    private ApplicantDto toDto(Applicant applicant) {
        return new ApplicantDto(
                applicant.getId(), applicant.getName(), applicant.getBirth(),
                applicant.getAddress(), applicant.getEmail(), applicant.getPhone(),
                applicant.getNote(), applicant.getDomain(), applicant.getInterviewDate(), 
                applicant.getComment()
        );
    }

    private Applicant fromDto(ApplicantDto dto) {
        Applicant applicant = new Applicant();
        applicant.setId(dto.getId());
        applicant.setName(dto.getName());
        applicant.setBirth(dto.getBirth());
        applicant.setAddress(dto.getAddress());
        applicant.setEmail(dto.getEmail());
        applicant.setPhone(dto.getPhone());
        applicant.setNote(dto.getNote());
        applicant.setDomain(dto.getDomain());
        applicant.setInterviewDate(dto.getInterviewDate());
        applicant.setComment(dto.getComment());
        return applicant;
    }
}