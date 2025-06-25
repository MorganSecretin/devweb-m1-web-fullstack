package fr.ynov.devweb.entities;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "applicants")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Applicant {
    @Id
    @Column(length = 4, unique = true, nullable = false)
    private String id;

    @Column()
    private String name;

    @Column()
    private LocalDate birth;

    @Column()
    private String address;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(length = 10)
    private String phone;

    @Column()
    private Integer note;

    @Column()
    private String domain;

    @Column()
    private LocalDate interviewDate;

    @Column()
    private String comment;
}
