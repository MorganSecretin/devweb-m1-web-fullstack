package fr.ynov.devweb.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;


@Entity
@Table(name = "applicants")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Applicant {
    @Id
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Person person;

    @Min(0)
    @Max(10)
    @Column()
    private Integer note;

    @Column()
    private String domain;

    @Column()
    private Date interviewDate;

    @Column()
    private String comment;
}