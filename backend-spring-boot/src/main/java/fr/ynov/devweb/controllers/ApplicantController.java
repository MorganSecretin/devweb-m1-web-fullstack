package fr.ynov.devweb.controllers;

import fr.ynov.devweb.dtos.ApplicantDto;
import fr.ynov.devweb.services.ApplicantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/applicants")
@CrossOrigin(origins = "*")
public class ApplicantController {

    @Autowired
    private ApplicantService applicantService;

    @GetMapping("/count")
    public ResponseEntity<Long> getApplicantCount() {
        long count = applicantService.getAllApplicants().size();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // Créer un nouveau candidat
    @PostMapping
    public ResponseEntity<ApplicantDto> createApplicant(@Valid @RequestBody ApplicantDto applicantDto) {
        ApplicantDto createdApplicant = applicantService.createApplicant(applicantDto);
        return new ResponseEntity<>(createdApplicant, HttpStatus.CREATED);
    }

    // Obtenir tous les candidats
    @GetMapping
    public ResponseEntity<List<ApplicantDto>> getAllApplicants() {
        List<ApplicantDto> applicants = applicantService.getAllApplicants();
        if (applicants.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(applicants, HttpStatus.OK);
    }

    // Obtenir un candidat par ID
    @GetMapping("/{id}")
    public ResponseEntity<ApplicantDto> getApplicantById(@PathVariable("id") String id) {
        ApplicantDto applicant = applicantService.getApplicantById(id);
        return new ResponseEntity<>(applicant, HttpStatus.OK);
    }

    // Mettre à jour un candidat
    @PutMapping("/{id}")
    public ResponseEntity<ApplicantDto> updateApplicant(@PathVariable("id") String id, @Valid @RequestBody ApplicantDto applicantDto) {
        ApplicantDto updatedApplicant = applicantService.updateApplicant(id, applicantDto);
        return new ResponseEntity<>(updatedApplicant, HttpStatus.OK);
    }

    // Supprimer un candidat
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteApplicant(@PathVariable("id") String id) {
        applicantService.deleteApplicant(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
