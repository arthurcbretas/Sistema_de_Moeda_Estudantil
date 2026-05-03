package com.sme.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Entidade InstituicaoEnsino.
 * Pré-cadastrada no sistema. Alunos e Professores pertencem a uma instituição (agregação).
 */
@Entity
@Table(name = "instituicao_ensino")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InstituicaoEnsino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    @Column(length = 500)
    private String endereco;

    public InstituicaoEnsino(String nome, String endereco) {
        this.nome = nome;
        this.endereco = endereco;
    }
}
