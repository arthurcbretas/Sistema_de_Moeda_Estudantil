package com.sme.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

/**
 * Entidade Professor — herda de Usuario (JOINED).
 * Representa o docente vinculado a uma instituição parceira.
 */
@Entity
@Table(name = "professor")
@DiscriminatorValue("PROFESSOR")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Professor extends Usuario {

    @Column(length = 100)
    private String departamento;

    @Min(value = 0, message = "Saldo não pode ser negativo")
    @Column(name = "saldo_moedas", nullable = false)
    private double saldoMoedas = 1000;

    @Column(name = "ultima_recarga_semestre", length = 10)
    private String ultimaRecargaSemestre;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instituicao_id")
    private InstituicaoEnsino instituicao;
}
