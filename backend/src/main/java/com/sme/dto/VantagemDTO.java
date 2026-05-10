package com.sme.dto;

public record VantagemDTO(
    Long id,
    String descricao,
    String fotoUrl,
    double custoMoedas,
    Long empresaId,
    String empresaNome
) {}
