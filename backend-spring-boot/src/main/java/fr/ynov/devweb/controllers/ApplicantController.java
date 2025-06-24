package fr.ynov.devweb.controllers;

import fr.ynov.devweb.dtos.ApplicantDto;
import fr.ynov.devweb.services.ApplicantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applicants")
@CrossOrigin(origins = "*")
public class ApplicantController {

    @Autowired
    private ApplicantService applicantService;

    // Créer un nouveau candidat
    @PostMapping
    public ResponseEntity<ApplicantDto> createApplicant(@RequestBody ApplicantDto applicantDto) {
        try {
            ApplicantDto createdApplicant = applicantService.createApplicant(applicantDto);
            return new ResponseEntity<>(createdApplicant, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtenir tous les candidats
    @GetMapping
    public ResponseEntity<List<ApplicantDto>> getAllApplicants() {
        try {
            List<ApplicantDto> applicants = applicantService.getAllApplicants();
            if (applicants.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(applicants, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtenir un candidat par ID
    @GetMapping("/{id}")
    public ResponseEntity<ApplicantDto> getApplicantById(@PathVariable("id") String id) {
        try {
            Optional<ApplicantDto> applicant = applicantService.getApplicantById(id);
            if (applicant.isPresent()) {
                return new ResponseEntity<>(applicant.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Mettre à jour un candidat
    @PutMapping("/{id}")
    public ResponseEntity<ApplicantDto> updateApplicant(@PathVariable("id") String id, @RequestBody ApplicantDto applicantDto) {
        try {
            Optional<ApplicantDto> updatedApplicant = applicantService.updateApplicant(id, applicantDto);
            if (updatedApplicant.isPresent()) {
                return new ResponseEntity<>(updatedApplicant.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Supprimer un candidat
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteApplicant(@PathVariable("id") String id) {
        try {
            boolean deleted = applicantService.deleteApplicant(id);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
