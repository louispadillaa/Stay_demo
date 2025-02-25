package com.Stay.Service;

import com.Stay.Entity.Question;
import com.Stay.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    public QuestionRepository questionRepository;

    public List<Question>getAllQuestions(){
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestion(Long questionId){
        return questionRepository.findById(questionId);
    }

    public void saveUpdateQuestion(@RequestBody Question question){
        questionRepository.save(question);
    }

    public void deleteQuestion(Long questionId){
        questionRepository.deleteById(questionId);
    }
}
