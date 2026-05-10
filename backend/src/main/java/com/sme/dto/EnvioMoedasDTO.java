package com.sme.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EnvioMoedasDTO(
    @NotNull(message = "ID do aluno é obrigatório")
    Long alunoId,

    @Min(value = 1, message = "Valor deve ser maior que zero")
    double valor,

    @NotBlank(message = "Motivo é obrigatório")
    String motivo
) {}
