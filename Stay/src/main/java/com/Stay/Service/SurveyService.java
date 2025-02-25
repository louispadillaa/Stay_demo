package com.Stay.Service;

import com.Stay.Entity.Response;
import com.Stay.Entity.Survey;
import com.Stay.Entity.User;
import com.Stay.Repository.SurveyRepository;
import com.Stay.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private ResponseService responseService;

    @Autowired
    private UserRepository userRepository;

    //Metodo para crear una objeto de encuesta si es diferente de nulo
    @Transactional
    public Survey createSurvey(String username, List<Response>responses){
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null){
            Survey survey = new Survey();
            survey.setUser(user);
            survey.setSurveyDate(LocalDateTime.now());

            //Guarda la encuesta
            Survey savedSurvey = surveyRepository.save(survey);

            //Registra y asocia las respuestas con la encuesta guardada
            responseService.registerResponses(savedSurvey, responses);

            //Configura las respuestas en el survey antes de devolverlo
            savedSurvey.setResponses(responses);

            return savedSurvey; //Guarda el survey con las respuestas asociadas
        }
        return null;
    }

    //Aqui podemos las encuestas por el Id
    public List<Survey> getSurveysByUsername(String username) {
        return surveyRepository.findByUserUsername(username);
    }

    public Survey getSurveyById(Long surveyId) {
        Optional<Survey> surveyOptional = surveyRepository.findById(surveyId);
        return surveyOptional.orElse(null);  // Retorna la encuesta si existe, sino retorna null
    }
}
