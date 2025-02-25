package com.Stay.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    //Este bean se encarga de verificar la información de los usuarios que se le logueen.
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }

    //Este bean encrypta las contraseñas
    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    //Este bean incorporará el filtro de seguridad que se creo en JwtAutheticationFilter
    @Bean
    JwtAuthenticationFilter jwtAuthenticationFilter(){
        return new JwtAuthenticationFilter();
    }

    //Este bean establece una cadena de filtros de seguridad. Aqui se determinan los permisos de usuarios segun los roles.
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.cors()
                .and()
                .csrf().disable()
                .exceptionHandling() //Permitimos el manejo de excepciones
                    .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                    .and()
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)//Permite la gestion de sesiones
                    .and()
                .authorizeHttpRequests()
                    .requestMatchers("/api/auth/**").permitAll()

                //METODOS POST
                    .requestMatchers(HttpMethod.POST, "/api/question/**").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/surveys/**","/api/responses/**").hasAuthority("STUDENT")
                    .requestMatchers(HttpMethod.POST, "/api/users/**").hasAuthority("STUDENT")

                //METODOS GET
                    .requestMatchers(HttpMethod.GET, "/api/alerts/**").hasAnyAuthority("ADMIN", "STUDENT")
                    .requestMatchers(HttpMethod.GET,"/api/users/**").hasAnyAuthority("ADMIN", "STUDENT")    //PUEDE LISTAR USUARIOS
                    .requestMatchers(HttpMethod.GET, "/api/surveys/**").hasAnyAuthority("ADMIN", "STUDENT")
                    .requestMatchers(HttpMethod.GET, "/api/question/**", "/api/responses/**").hasAnyAuthority("ADMIN", "STUDENT") // PUEDE LISTAR PREGUNTAS Y RESPUESTAS

                    .requestMatchers(HttpMethod.PUT, "/api/question/**").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/question/**").hasAuthority("ADMIN")
                    .anyRequest().authenticated()
                    .and()
                .httpBasic();
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }


}
