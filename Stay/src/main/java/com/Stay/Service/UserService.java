package com.Stay.Service;

import com.Stay.Entity.User;
import com.Stay.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public List<User> getAllStudents(){
        return userRepository.findAll();
    }

    public Optional<User> getStudent(Long userId){
        return userRepository.findById(userId);
    }

    public void saveUpdateStudent(@RequestBody User user){
        userRepository.save(user);
    }

    public void deleteStudent(Long userId){
        userRepository.deleteById(userId);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));
    }
}
