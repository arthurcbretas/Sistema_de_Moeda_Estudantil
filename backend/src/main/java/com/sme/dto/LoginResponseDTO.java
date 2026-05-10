package com.sme.dto;

public record LoginResponseDTO(
    String token,
    String role,
    Long userId,
    String nome,
    String email
) {}
