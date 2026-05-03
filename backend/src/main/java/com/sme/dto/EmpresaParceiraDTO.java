package com.sme.dto;

/**
 * DTO de resposta para Empresa Parceira (sem senha).
 */
public record EmpresaParceiraDTO(
    Long id,
    String nome,
    String email,
    String cnpj
) {}
