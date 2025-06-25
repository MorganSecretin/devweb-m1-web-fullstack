package fr.ynov.devweb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

import jakarta.annotation.Nullable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantDto {
    private PersonDto person;
    @Nullable()
    private Integer note;
    @Nullable()
    private String domain;
    @Nullable()
    private LocalDate interviewDate;
    @Nullable()
    private String comment;
}
