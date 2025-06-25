package fr.ynov.devweb.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "employees")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
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
    private String job;

    @Column()
    private Float salary;

    @Column()
    private LocalDate contractStart;

    @Column()
    private LocalDate contractEnd;
    
    @Column()
    private String comment;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vacation> vacations;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Absence> absences;
}
