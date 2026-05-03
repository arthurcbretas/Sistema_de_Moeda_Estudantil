package com.sme.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Entidade Vantagem.
 * Pertence a uma EmpresaParceira (composição).
 */
@Entity
@Table(name = "vantagem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(nullable = false, length = 500)
    private String descricao;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Min(value = 1, message = "Custo deve ser maior que zero")
    @Column(name = "custo_moedas", nullable = false)
    private double custoMoedas;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaParceira empresa;
}
