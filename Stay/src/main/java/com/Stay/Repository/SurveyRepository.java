package com.Stay.Repository;

import com.Stay.Entity.Alert;
import com.Stay.Entity.Survey;
import com.Stay.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey,Long> {

    List<Survey> findByUserUsername(String username);
}
