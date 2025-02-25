package com.Stay.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DtoRegister {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private Long age;
    private String semester;
    private String career;
    private Long phone;
    private String gender;


}

