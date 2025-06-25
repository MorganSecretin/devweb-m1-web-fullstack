package fr.ynov.devweb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

import jakarta.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantDto {
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
    
    @Min(value = 0, message = "Note minimum 0")
    @Max(value = 10, message = "Note maximum 10")
    private Integer note;
    
    @Size(max = 100, message = "Domaine trop long")
    private String domain;
    
    private LocalDate interviewDate;
    
    @Size(max = 500, message = "Commentaire trop long")
    private String comment;
}
