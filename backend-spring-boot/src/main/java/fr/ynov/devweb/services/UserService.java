package fr.ynov.devweb.services;

import fr.ynov.devweb.configs.jwts.JwtTokenProvider;
import fr.ynov.devweb.entities.User;
import fr.ynov.devweb.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé : " + username));
    }



    public boolean verifiyUser(String email, String password) {
        return userRepository.findByEmail(email).map(user -> passwordEncoder.matches(password, user.getPassword())).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé : " + email)
        );
    }

    public boolean checkUserNameExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }


    public boolean createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists : " + user.getEmail());
        }
        System.out.println("---> Creating user: " + user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        System.out.println("---> User created successfully: " + user.getEmail());
        return true;
    }

    public User saveUser(User user) {
        if (!user.getEmail().contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email format: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    public String generateToken(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtTokenProvider.generateToken(authentication);

    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUserById(Long id) {
        if(userRepository.findById(id).isPresent()){
            userRepository.deleteById(id);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
        }
    }

    public User updateUser(Long id, User user) {
        if (userRepository.findById(id).isPresent()) {
            user.setId(id);
            return userRepository.save(user);
        }else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id);
        }
    }
}
