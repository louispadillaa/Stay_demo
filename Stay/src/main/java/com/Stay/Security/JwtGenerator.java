package com.Stay.Security;

import io.jsonwebtoken.*;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtGenerator {
    //Metodo para crear un token por medio de la autenticación
    public String generateToken(Authentication authentication){
        String username = authentication.getName();
        Date currentTime = new Date();
        Date expirationToken = new Date(currentTime.getTime() + SecurityConstants.JWT_EXPIRATION_TOKEN *1000);

        //Codigo para generar un token
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expirationToken)
                .signWith(SignatureAlgorithm.HS512,SecurityConstants.JWT_SIGNATURE)
                .compact();
        return token;
    }

    //Este metodo se utiliza para extraer un username a partir de un token
    public String getUsernameFromJwt(String token){
        Claims claims = Jwts.parser()
                .setSigningKey(SecurityConstants.JWT_SIGNATURE)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public Boolean validateToken(String token){
        try {
            Jwts.parser().setSigningKey(SecurityConstants.JWT_SIGNATURE).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            // Manejar el caso en que el token ha expirado
            throw new AuthenticationCredentialsNotFoundException("Jwt ha expirado");
        } catch (MalformedJwtException e) {
            // Manejar el caso en que el token está malformado
            throw new AuthenticationCredentialsNotFoundException("Jwt está malformado");
        } catch (SignatureException e) {
            // Manejar el caso en que la firma no coincide
            throw new AuthenticationCredentialsNotFoundException("Firma del Jwt no válida");
        } catch (Exception e) {
            // Manejar cualquier otra excepción
            throw new AuthenticationCredentialsNotFoundException("Jwt ha expirado o está incorrecto");
        }
    }
}
