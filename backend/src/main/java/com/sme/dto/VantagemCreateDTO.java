package com.sme.dto;

import jakarta.validation.constraints.*;

public record VantagemCreateDTO(
    @NotBlank(message = "Descrição é obrigatória")
    String descricao,

    String fotoUrl,

    @Min(value = 1, message = "Custo deve ser maior que zero")
    double custoMoedas,

    Long empresaId
) {}
