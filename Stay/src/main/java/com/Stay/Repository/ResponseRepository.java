package com.Stay.Repository;

import com.Stay.Entity.Response;
import com.Stay.Entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {

    List<Response>findBySurveyAndResponseTrue(Survey survey);
}
