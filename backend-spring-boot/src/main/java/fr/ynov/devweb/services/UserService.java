package fr.ynov.devweb.services;

import fr.ynov.devweb.configs.jwts.JwtTokenProvider;
import fr.ynov.devweb.entities.User;
import fr.ynov.devweb.exceptions.DuplicateResourceException;
import fr.ynov.devweb.exceptions.InvalidCredentialsException;
import fr.ynov.devweb.exceptions.ResourceNotFoundException;
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
        User user = findUserByEmail(email);
        validatePassword(password, user.getPassword());
        return true;
    }

    public boolean createUser(User user) {
        checkEmailDuplicate(user.getEmail());
        saveNewUser(user);
        return true;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public String generateToken(String email, String password) {
        Authentication auth = authenticate(email, password);
        return jwtTokenProvider.generateToken(auth);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUserById(Long id) {
        checkUserExists(id);
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User user) {
        checkUserExists(id);
        user.setId(id);
        return userRepository.save(user);
    }

    public boolean checkUserNameExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    private void checkEmailDuplicate(String email) {
        if (userRepository.findByEmail(email).isPresent())
            throw new DuplicateResourceException("Utilisateur avec cet email existe déjà");
    }

    private void checkUserExists(Long id) {
        if (!userRepository.findById(id).isPresent())
            throw new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + id);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé : " + email));
    }

    private void validatePassword(String password, String encodedPassword) {
        if (!passwordEncoder.matches(password, encodedPassword))
            throw new InvalidCredentialsException("Mot de passe incorrect");
    }

    private void saveNewUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    private Authentication authenticate(String email, String password) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(auth);
        return auth;
    }
}
