package com.Stay.Service;

import com.Stay.Entity.Alert;
import com.Stay.Entity.Category;
import com.Stay.Entity.Survey;
import com.Stay.Entity.User;
import com.Stay.Repository.AlertRepository;
import com.Stay.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    public void generateAlert(Survey survey, Category category, int dropoutRate, String description) {

        Alert alert = new Alert();
        alert.setSurvey(survey);
        alert.setCause("" + category);
        alert.setDescription(description);
        alert.setDropoutRate(dropoutRate);
        alert.setAlertDate(LocalDateTime.now());
        alert.setUser(survey.getUser());
        alertRepository.save(alert);
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public List<Alert> getAlertsByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            // Obtén las alertas relacionadas con el usuario
            return alertRepository.findByUser(user.orElse(null));
        } else {
            // Si el usuario no existe, devolver una lista vacía o manejar el error de acuerdo a tu lógica
            return new ArrayList<>();
        }
    }
}
