package com.Stay.Controller;

import com.Stay.Entity.Question;
import com.Stay.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path="/api/question")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public List<Question> getAll(){
        return questionService.getAllQuestions();
    }

    @GetMapping("/{questionId}")
    public Optional<Question>getById(@PathVariable("questionId") Long questionId){
        return questionService.getQuestion(questionId);
    }

    @PostMapping
    public void saveUpdate(@RequestBody Question question){
        questionService.saveUpdateQuestion(question);
    }

    @DeleteMapping("/{questionId}")
    public void delete(@PathVariable("questionId") Long questionId){
        questionService.deleteQuestion(questionId);
    }



}
