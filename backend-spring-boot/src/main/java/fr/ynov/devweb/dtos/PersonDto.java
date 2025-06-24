package fr.ynov.devweb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonDto {
    private String id;
    private String name;
    private LocalDate birth;
    private String address;
    private String email;
    private String phone;
}
