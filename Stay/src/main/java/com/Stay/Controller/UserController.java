package com.Stay.Controller;


import com.Stay.Entity.User;
import com.Stay.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path="/api/users")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAll(){
        return userService.getAllStudents();
    }

    @GetMapping("/{userId}")
    public Optional<User> getById(@PathVariable("userId") Long userId){
        return userService.getStudent(userId);
    }

    @PostMapping
    public void saveUpdate(@RequestBody User user){
        userService.saveUpdateStudent(user);
    }

    @DeleteMapping("/{userId}")
    public void delete(@PathVariable("userId") Long userId){
        userService.deleteStudent(userId);
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<User> getUserProfile(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return user != null
                ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
