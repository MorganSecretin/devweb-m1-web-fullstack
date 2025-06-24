package fr.ynov.devweb.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Entity
@Table(name = "applicants")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Applicant {
    @Id
    @Column(length = 4, unique = true, nullable = false)
    private String id; // Same as Person ID
    
    @OneToOne
    @JoinColumn(name = "id", referencedColumnName = "id", insertable = false, updatable = false)
    private Person person;

    @Min(0)
    @Max(10)
    @Column()
    private Integer note;

    @Column()
    private String domain;

    @Column()
    private LocalDate interviewDate;

    @Column()
    private String comment;
}