package fr.ynov.devweb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

import jakarta.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
    @NotBlank(message = "ID obligatoire")
    @Size(min = 4, max = 4, message = "ID doit faire 4 caractères")
    private String id;
    
    @Size(max = 100, message = "Nom trop long")
    private String name;
    
    @Past(message = "Date de naissance doit être dans le passé")
    private LocalDate birth;
    
    @Size(max = 200, message = "Adresse trop longue")
    private String address;
    
    @NotBlank(message = "Email obligatoire")
    @Email(message = "Format email invalide")
    private String email;
    
    @Pattern(regexp = "\\d{10}", message = "Téléphone doit faire 10 chiffres")
    private String phone;
    
    @Size(max = 100, message = "Poste trop long")
    private String job;
    
    @PositiveOrZero(message = "Salaire ne peut pas être négatif")
    private Float salary;
    
    private LocalDate contractStart;
    
    private LocalDate contractEnd;
    
    @Size(max = 500, message = "Commentaire trop long")
    private String comment;
}
