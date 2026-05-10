package com.sme.dto;

public record ProfessorDTO(
    Long id,
    String nome,
    String email,
    String cpf,
    String departamento,
    double saldoMoedas,
    Long instituicaoId,
    String instituicaoNome
) {}
