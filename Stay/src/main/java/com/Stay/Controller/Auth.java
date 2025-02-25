package com.Stay.Controller;

import com.Stay.DTO.DtoAuthResponse;
import com.Stay.DTO.DtoLogin;
import com.Stay.DTO.DtoRegister;
import com.Stay.Entity.Role;
import com.Stay.Entity.User;
import com.Stay.Repository.RoleRepository;
import com.Stay.Repository.UserRepository;
import com.Stay.Security.JwtGenerator;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.NoSuchElementException;
import java.util.Set;

@RestController
@RequestMapping(path="/api/auth/")
public class Auth {
    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;
    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private JwtGenerator jwtGenerator;


    @Autowired
    public Auth(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, RoleRepository roleRepository, UserRepository userRepository, JwtGenerator jwtGenerator) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.jwtGenerator = jwtGenerator;
    }

    //Metodo para poder registrar usuarios con rol Student
    @PostMapping("register")
    public ResponseEntity<String>register(@RequestBody DtoRegister dtoRegister){
        if(userRepository.existsByUsername(dtoRegister.getUsername())){
            return new ResponseEntity<>("Usuario ya existe, intenta con otro", HttpStatus.BAD_REQUEST);
        }
        User user = new User();
        user.setUsername(dtoRegister.getUsername());
        user.setFirstName(dtoRegister.getFirstName());
        user.setLastName(dtoRegister.getLastName());
        user.setPassword(passwordEncoder.encode(dtoRegister.getPassword()));
        user.setAge(dtoRegister.getAge());
        user.setCareer(dtoRegister.getCareer());
        user.setPhone(dtoRegister.getPhone());
        user.setSemester(dtoRegister.getSemester());
        user.setGender(dtoRegister.getGender());
        Role role = roleRepository.findByRoleName("STUDENT")
                .orElseThrow(() -> new NoSuchElementException("Rol 'STUDENT' no encontrado"));
        user.setRoles(Collections.singletonList(role));
        userRepository.save(user);
        return new ResponseEntity<>("Registro de Usuario exitoso",HttpStatus.OK);
    }


    //Metodo para poder registrar usuarios con rol ADMIN
    @PostMapping("registerAdmin")
    public ResponseEntity<String>registerAdmin(@RequestBody DtoRegister dtoRegister){
        if(userRepository.existsByUsername(dtoRegister.getUsername())){
            return new ResponseEntity<>("Usuario ya existe, intenta con otro", HttpStatus.BAD_REQUEST);
        }
        User user = new User();
        user.setUsername(dtoRegister.getUsername());
        user.setFirstName(dtoRegister.getFirstName());
        user.setLastName(dtoRegister.getLastName());
        user.setPassword(passwordEncoder.encode(dtoRegister.getPassword()));

        Role role = roleRepository.findByRoleName("ADMIN").get();
        user.setRoles(Collections.singletonList(role));
        userRepository.save(user);
        return new ResponseEntity<>("Registro de Usuario exitoso",HttpStatus.OK);
    }

    //Metodo para login y obtener un Token
    @PostMapping("login")
    public ResponseEntity<DtoAuthResponse> login(@RequestBody DtoLogin dtoLogin){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                dtoLogin.getUsername(),dtoLogin.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());

        // Redireccionar dependiendo del rol
        String redirectUrl = "";
        if (roles.contains("ADMIN")) {
            redirectUrl = "/admin/dashboard.html";
        } else if (roles.contains("STUDENT")) {
            redirectUrl = "/student/home.html";
        }

        return new ResponseEntity<>(new DtoAuthResponse(token,redirectUrl),HttpStatus.OK);
    }
}
