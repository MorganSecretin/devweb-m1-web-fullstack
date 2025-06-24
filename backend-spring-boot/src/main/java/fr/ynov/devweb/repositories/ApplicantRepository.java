package fr.ynov.devweb.repositories;

import fr.ynov.devweb.entities.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, String> {
}
