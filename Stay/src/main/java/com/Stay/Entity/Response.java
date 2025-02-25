package com.Stay.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long responseId;

    @Column(nullable = false)
    private boolean response;

    @ManyToOne
    @JoinColumn(name = "survey_id")
    @JsonIgnore
    private Survey survey;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name ="question_id")
    private Question question;

    public Long getResponseId() {
        return responseId;
    }

    public boolean isResponse() {
        return response;
    }

    public Question getQuestion() {
        return question;
    }

    public Survey getSurvey() {
        return survey;
    }
}
