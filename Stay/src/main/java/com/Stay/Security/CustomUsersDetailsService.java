package com.Stay.Security;

import com.Stay.Entity.Role;
import com.Stay.Entity.User;
import com.Stay.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUsersDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    @Autowired
    public CustomUsersDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    //Metodo para traer una lista de Autoridades por medio de una lista de roles.
    public Collection<GrantedAuthority> mapToAutorities(List<Role>roles){
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getRoleName())).collect(Collectors.toList());
    }

    //Trayendo a un usuario con todos sus datos por medio de su username.
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return new org.springframework.security.core.userdetails.User(user.getUsername(),user.getPassword(),mapToAutorities(user.getRoles()));

    }
}
