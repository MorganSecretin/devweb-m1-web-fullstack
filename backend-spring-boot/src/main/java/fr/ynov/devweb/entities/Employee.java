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
    private String id; // Same as Person ID
    
    @OneToOne
    @JoinColumn(name = "id", referencedColumnName = "id", insertable = false, updatable = false)
    private Person person;

    @Column()
    private String job;

    @Column()
    private float salary;

    @Column()
    private LocalDate contractStart;

    @Column()
    private LocalDate contractEnd;    @Column()
    private String comment;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vacation> vacations;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Absence> absences;
}