package fr.ynov.devweb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
    private PersonDto person;
    private String job;
    private float salary;
    private LocalDate contractStart;
    private LocalDate contractEnd;
    private String comment;
}
