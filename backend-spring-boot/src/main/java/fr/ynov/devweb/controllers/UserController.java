package fr.ynov.devweb.controllers;

import fr.ynov.devweb.dtos.BaseResponseDto;
import fr.ynov.devweb.dtos.UserLoginDto;
import fr.ynov.devweb.entities.User;
import fr.ynov.devweb.services.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("register")
    public BaseResponseDto registerUser(@RequestBody User user) {
        if(userService.createUser(user)) {
            return new BaseResponseDto("success");
        }else{
            return new BaseResponseDto("failed");
        }
    }

    @PostMapping("login")
    public BaseResponseDto registerUser(@RequestBody UserLoginDto userLoginDto) {
        if(userService.checkUserNameExists(userLoginDto.getEmail())){
            if(userService.verifiyUser(userLoginDto.getEmail(), userLoginDto.getPassword())){
                Map<String, String> data = new HashMap<>();
                data.put("token", userService.generateToken(userLoginDto.getEmail(), userLoginDto.getPassword()));
                return new BaseResponseDto("success", data);
            }else{
                return new BaseResponseDto("password failed");
            }
        }else{
            return new BaseResponseDto("user not exist");
        }


    }
}
