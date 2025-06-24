package fr.ynov.devweb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantDto {
    private PersonDto person;
    private Integer note;
    private String domain;
    private LocalDate interviewDate;
    private String comment;
}
