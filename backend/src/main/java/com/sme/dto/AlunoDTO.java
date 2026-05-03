package com.sme.dto;

/**
 * DTO de resposta para Aluno (sem senha).
 */
public record AlunoDTO(
    Long id,
    String nome,
    String email,
    String cpf,
    String rg,
    String endereco,
    String curso,
    double saldoMoedas,
    Long instituicaoId,
    String instituicaoNome
) {}
