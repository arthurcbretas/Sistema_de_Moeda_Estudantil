package com.sme.dto;

import jakarta.validation.constraints.*;

public record ProfessorCreateDTO(
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    String email,

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    String senha,

    @NotBlank(message = "CPF é obrigatório")
    String cpf,

    String departamento,
    Long instituicaoId
) {}
