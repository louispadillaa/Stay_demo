package com.Stay.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Permanence {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long permanenceId;

    @Column(name="programName")
    private String programName;

    private boolean underObservation;

    @Column(name = "permanence_datetime")
    private LocalDate permanenceDate;

    private String cause;

    @ManyToOne
    @JoinColumn(name = "alerta_id", nullable = false)
    private Alert alert;  // Relación con la entidad Alerta


}
