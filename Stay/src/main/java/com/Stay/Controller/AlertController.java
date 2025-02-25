package com.Stay.Controller;

import com.Stay.Entity.Alert;
import com.Stay.Service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path="api/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public ResponseEntity<List<Alert>> getAlerts(){
        List<Alert> alerts = alertService.getAllAlerts();
        return new ResponseEntity<>(alerts, HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<List<Alert>>getAlertsByUsername(@PathVariable("username") String username){
        List<Alert> alerts = alertService.getAlertsByUsername(username);
        return new ResponseEntity<>(alerts, HttpStatus.OK);
    }
}
