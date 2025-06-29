package fr.ynov.devweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.ynov.devweb.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}
