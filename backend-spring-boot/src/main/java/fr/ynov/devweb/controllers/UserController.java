package fr.ynov.devweb.controllers;

import fr.ynov.devweb.dtos.UserLoginDto;
import fr.ynov.devweb.entities.User;
import fr.ynov.devweb.services.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth/")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("register")
    public void registerUser(@RequestBody User user) {
        userService.createUser(user);
    }

    @PostMapping("login")
    public String registerUser(@RequestBody UserLoginDto userLoginDto) {
        if (userService.checkUserNameExists(userLoginDto.getEmail())) {
            if (userService.verifiyUser(userLoginDto.getEmail(), userLoginDto.getPassword())) {
                String token = userService.generateToken(userLoginDto.getEmail(), userLoginDto.getPassword());
                System.out.println("Token généré : " + token);
                return token;
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");

            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé");
        }
    }
}
