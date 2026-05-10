package com.sme.dto;

import java.time.LocalDateTime;

public record TransacaoDTO(
    Long id,
    double valor,
    LocalDateTime data,
    String motivo,
    String tipo,
    String professorNome,
    String alunoNome,
    String vantagemDescricao
) {}
