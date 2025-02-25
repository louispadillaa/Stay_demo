package com.Stay.Controller;

import com.Stay.Entity.Response;
import com.Stay.Entity.Survey;
import com.Stay.Service.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path="/api/responses")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @PostMapping
    public ResponseEntity<Void> registerResponses(@RequestParam Survey survey, @RequestBody List<Response> responses){
        responseService.registerResponses(survey, responses);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
