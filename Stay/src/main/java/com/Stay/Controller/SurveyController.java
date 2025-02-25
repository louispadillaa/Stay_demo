package com.Stay.Controller;

import com.Stay.Entity.Response;
import com.Stay.Entity.Survey;
import com.Stay.Service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path="/api/surveys")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    @PostMapping
    public ResponseEntity<Survey> createSurvey(@RequestBody Survey survey){
        System.out.println("Survey: " + survey); // Agrega esto para depurar
        if(survey.getUser() == null || survey.getUser().getUsername() == null || survey.getResponses() == null || survey.getResponses().isEmpty()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Survey createdSurvey = surveyService.createSurvey(survey.getUser().getUsername(), survey.getResponses());
        return createdSurvey != null ? new ResponseEntity<>(createdSurvey, HttpStatus.CREATED) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @GetMapping("/{username}")
    public ResponseEntity<List<Survey>> getSurveyByUser(@PathVariable String username) {
        List<Survey> surveys = (List<Survey>) surveyService.getSurveysByUsername(username);
        return surveys != null && !surveys.isEmpty()
                ? new ResponseEntity<>(surveys, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/surveys/{surveyId}")
    public ResponseEntity<Survey> getSurveyById(@PathVariable Long surveyId) {
        Survey survey = surveyService.getSurveyById(surveyId);
        return survey != null
                ? new ResponseEntity<>(survey, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
