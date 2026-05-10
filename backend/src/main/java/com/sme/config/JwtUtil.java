package com.sme.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(String email, String role, Long userId, String nome) {
        return JWT.create()
                .withSubject(email)
                .withClaim("role", role)
                .withClaim("userId", userId)
                .withClaim("nome", nome)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
                .sign(Algorithm.HMAC256(secret));
    }

    public DecodedJWT validateToken(String token) throws JWTVerificationException {
        return JWT.require(Algorithm.HMAC256(secret))
                .build()
                .verify(token);
    }

    public String getEmail(String token) {
        return validateToken(token).getSubject();
    }

    public String getRole(String token) {
        return validateToken(token).getClaim("role").asString();
    }

    public Long getUserId(String token) {
        return validateToken(token).getClaim("userId").asLong();
    }
}
