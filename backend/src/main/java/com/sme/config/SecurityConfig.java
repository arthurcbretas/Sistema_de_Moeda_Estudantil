package com.sme.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> {})
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Públicas
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/alunos").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/empresas").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/instituicoes").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/alunos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/empresas").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/vantagens").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/vantagens/**").permitAll()

                // Professor
                .requestMatchers("/api/moedas/**").hasAnyRole("PROFESSOR", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/professores/**").hasAnyRole("PROFESSOR", "ADMIN")

                // Aluno
                .requestMatchers("/api/resgates/**").hasAnyRole("ALUNO", "ADMIN")

                // Empresa - gerenciar vantagens
                .requestMatchers(HttpMethod.POST, "/api/vantagens").hasAnyRole("EMPRESA", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/vantagens/**").hasAnyRole("EMPRESA", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/vantagens/**").hasAnyRole("EMPRESA", "ADMIN")

                // Extrato — aluno e professor
                .requestMatchers("/api/extrato/**").hasAnyRole("ALUNO", "PROFESSOR", "ADMIN")

                // Demais — autenticado
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
