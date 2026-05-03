package com.sme.dto;

import jakarta.validation.constraints.*;

/**
 * DTO para criação de uma nova Empresa Parceira.
 */
public record EmpresaParceiraCreateDTO(
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    String email,

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    String senha,

    @NotBlank(message = "CNPJ é obrigatório")
    String cnpj
) {}
