package com.sme.dto;

import jakarta.validation.constraints.NotNull;

public record ResgateDTO(
    @NotNull(message = "ID da vantagem é obrigatório")
    Long vantagemId
) {}
