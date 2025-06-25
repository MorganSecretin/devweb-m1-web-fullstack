package fr.ynov.devweb.entities;

import jakarta.annotation.Nullable;
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
    @JoinColumn(name = "id", referencedColumnName = "id", nullable = false)
    @MapsId
    private Person person;

    @Nullable()
    @Column()
    private String job;

    @Nullable()
    @Column()
    private Float salary;

    @Nullable()
    @Column()
    private LocalDate contractStart;

    @Nullable()
    @Column()
    private LocalDate contractEnd;
    
    @Nullable()
    @Column()
    private String comment;

    @Nullable()
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vacation> vacations;

    @Nullable()
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Absence> absences;
}