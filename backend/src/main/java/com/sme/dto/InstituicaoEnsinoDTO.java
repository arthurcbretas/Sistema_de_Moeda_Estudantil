package com.sme.dto;

/**
 * DTO de resposta para Instituição de Ensino.
 */
public record InstituicaoEnsinoDTO(
    Long id,
    String nome,
    String endereco
) {}
