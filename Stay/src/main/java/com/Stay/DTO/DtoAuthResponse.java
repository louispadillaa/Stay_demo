package com.Stay.DTO;

import lombok.Data;

@Data
public class DtoAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String redirectUrl;

    public DtoAuthResponse(String accessToken, String redirectUrl) {
        this.accessToken = accessToken;
        this.redirectUrl = redirectUrl;
    }
}
