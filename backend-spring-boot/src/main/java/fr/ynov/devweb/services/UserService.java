package fr.ynov.devweb.services;

import fr.ynov.devweb.configs.jwts.JwtTokenProvider;
import fr.ynov.devweb.entities.User;
import fr.ynov.devweb.exceptions.DuplicateResourceException;
import fr.ynov.devweb.exceptions.InvalidCredentialsException;
import fr.ynov.devweb.exceptions.ResourceNotFoundException;
import fr.ynov.devweb.exceptions.ValidationException;
import fr.ynov.devweb.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Lazy
    @Autowired
    private AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Lazy
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé : " + username));
    }



    public boolean verifiyUser(String email, String password) {
        if (email == null || email.trim().isEmpty()) {
            throw new ValidationException("L'email est obligatoire");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new ValidationException("Le mot de passe est obligatoire");
        }
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé : " + email));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Mot de passe incorrect");
        }
        
        return true;
    }

    public boolean checkUserNameExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }


    public boolean createUser(User user) {
        if (user == null) {
            throw new ValidationException("Les données de l'utilisateur sont obligatoires");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new ValidationException("L'email est obligatoire");
        }
        if (!user.getEmail().contains("@")) {
            throw new ValidationException("Format d'email invalide");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new ValidationException("Le mot de passe est obligatoire");
        }
        
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Un utilisateur avec cet email existe déjà : " + user.getEmail());
        }
        
        System.out.println("---> Creating user: " + user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        System.out.println("---> User created successfully: " + user.getEmail());
        return true;
    }

    public User saveUser(User user) {
        if (user == null) {
            throw new ValidationException("Les données de l'utilisateur sont obligatoires");
        }
        if (user.getEmail() == null || !user.getEmail().contains("@")) {
            throw new ValidationException("Format d'email invalide : " + user.getEmail());
        }
        return userRepository.save(user);
    }

    public String generateToken(String email, String password) {
        if (email == null || email.trim().isEmpty()) {
            throw new ValidationException("L'email est obligatoire");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new ValidationException("Le mot de passe est obligatoire");
        }
        
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtTokenProvider.generateToken(authentication);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        if (id == null) {
            throw new ValidationException("L'ID de l'utilisateur est obligatoire");
        }
        return userRepository.findById(id);
    }

    public void deleteUserById(Long id) {
        if (id == null) {
            throw new ValidationException("L'ID de l'utilisateur est obligatoire");
        }
        
        if (!userRepository.findById(id).isPresent()) {
            throw new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + id);
        }
        
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User user) {
        if (id == null) {
            throw new ValidationException("L'ID de l'utilisateur est obligatoire");
        }
        if (user == null) {
            throw new ValidationException("Les données de l'utilisateur sont obligatoires");
        }
        
        if (!userRepository.findById(id).isPresent()) {
            throw new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + id);
        }
        
        user.setId(id);
        return userRepository.save(user);
    }
}
