package com.sme.dto;

import java.time.LocalDateTime;

public record CupomDTO(
    Long id,
    String codigo,
    LocalDateTime dataCriacao,
    String status,
    String alunoNome,
    String vantagemDescricao,
    String empresaNome,
    double custoMoedas
) {}
