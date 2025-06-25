package fr.ynov.devweb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

import jakarta.annotation.Nullable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
    private PersonDto person;
    @Nullable()
    private String job;
    @Nullable()
    private Float salary;
    @Nullable()
    private LocalDate contractStart;
    @Nullable()
    private LocalDate contractEnd;
    @Nullable()
    private String comment;
}
