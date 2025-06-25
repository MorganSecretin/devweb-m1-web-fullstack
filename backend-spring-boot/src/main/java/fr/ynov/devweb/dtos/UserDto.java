package fr.ynov.devweb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    @NotBlank(message = "Email obligatoire")
    @Email(message = "Format email invalide")
    private String email;
    
    @NotBlank(message = "Mot de passe obligatoire")
    @Size(min = 6, message = "Mot de passe doit faire au moins 6 caractères")
    private String password;
    
    @Size(max = 100, message = "Nom trop long")
    private String name;
}
