package com.sme.controller;

import com.sme.dto.InstituicaoEnsinoDTO;
import com.sme.model.InstituicaoEnsino;
import com.sme.repository.InstituicaoEnsinoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para listar Instituições de Ensino (pré-cadastradas).
 * Fornece: ● IInstituicaoAPI
 * Usado no dropdown do cadastro de Aluno.
 */
@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoEnsinoController {

    private final InstituicaoEnsinoRepository instituicaoRepository;

    public InstituicaoEnsinoController(InstituicaoEnsinoRepository instituicaoRepository) {
        this.instituicaoRepository = instituicaoRepository;
    }

    @GetMapping
    public ResponseEntity<List<InstituicaoEnsinoDTO>> listarTodas() {
        List<InstituicaoEnsinoDTO> lista = instituicaoRepository.findAll().stream()
                .map(i -> new InstituicaoEnsinoDTO(i.getId(), i.getNome(), i.getEndereco()))
                .toList();
        return ResponseEntity.ok(lista);
    }
}
