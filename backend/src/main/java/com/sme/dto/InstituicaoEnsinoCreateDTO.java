package com.sme.dto;

import jakarta.validation.constraints.NotBlank;

public record InstituicaoEnsinoCreateDTO(
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    String endereco
) {}
