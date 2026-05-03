package com.sme.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

/**
 * Entidade Aluno — herda de Usuario (JOINED).
 * Representa o estudante cadastrado no sistema.
 */
@Entity
@Table(name = "aluno")
@DiscriminatorValue("ALUNO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aluno extends Usuario {

    @Column(length = 20)
    private String rg;

    @Column(length = 500)
    private String endereco;

    @Column(length = 100)
    private String curso;

    @Min(value = 0, message = "Saldo não pode ser negativo")
    @Column(name = "saldo_moedas", nullable = false)
    private double saldoMoedas = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instituicao_id")
    private InstituicaoEnsino instituicao;
}
