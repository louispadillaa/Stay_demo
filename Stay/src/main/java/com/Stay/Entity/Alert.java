package com.Stay.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    private String cause;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name="dropout_rate")
    private int dropoutRate;

    @Column(name="alert_datetime")
    private LocalDateTime alertDate;

    @ManyToOne
    @JoinColumn(name = "survey_id")
    private Survey survey;

    @ManyToOne // Asegúrate de que sea una relación de muchos a uno
    @JoinColumn(name = "user_id", nullable = false) // El campo no debe ser nulo
    private User user;
}
