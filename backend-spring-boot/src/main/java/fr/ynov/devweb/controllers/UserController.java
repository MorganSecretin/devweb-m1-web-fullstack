package fr.ynov.devweb.controllers;

import fr.ynov.devweb.dtos.UserLoginDto;
import fr.ynov.devweb.entities.User;
import fr.ynov.devweb.services.UserService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody User user) {
        userService.createUser(user);
        return new ResponseEntity<>("Utilisateur créé avec succès", HttpStatus.CREATED);
    }

    @PostMapping("login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody UserLoginDto userLoginDto) {
        if (userService.checkUserNameExists(userLoginDto.getEmail())) {
            if (userService.verifiyUser(userLoginDto.getEmail(), userLoginDto.getPassword())) {
                String token = userService.generateToken(userLoginDto.getEmail(), userLoginDto.getPassword());
                System.out.println("Token généré : " + token);
                return new ResponseEntity<>(token, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>("Échec de la connexion", HttpStatus.UNAUTHORIZED);
    }
}
