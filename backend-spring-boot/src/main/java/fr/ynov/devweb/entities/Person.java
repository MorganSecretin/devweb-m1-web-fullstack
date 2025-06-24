package fr.ynov.devweb.entities;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "persons")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    @Id
    @Column(length = 4, unique = true, nullable = false)
    private String id; // 2 letters min and 2 numbers

    @Column()
    private String name;

    @Column()
    private LocalDate birth;

    @Column()
    private String address;

    @Column()
    private String email;

    @Column(length = 10)
    private String phone; // 0644043030 format

    @OneToOne(mappedBy = "person", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Applicant applicant;

    @OneToOne(mappedBy = "person", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Employee employee;
}
