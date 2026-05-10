package com.sme.controller;

import com.sme.dto.InstituicaoEnsinoCreateDTO;
import com.sme.dto.InstituicaoEnsinoDTO;
import com.sme.service.InstituicaoEnsinoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoEnsinoController {

    private final InstituicaoEnsinoService instituicaoService;

    public InstituicaoEnsinoController(InstituicaoEnsinoService instituicaoService) {
        this.instituicaoService = instituicaoService;
    }

    @GetMapping
    public ResponseEntity<List<InstituicaoEnsinoDTO>> listarTodas() {
        return ResponseEntity.ok(instituicaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstituicaoEnsinoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(instituicaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<InstituicaoEnsinoDTO> cadastrar(@Valid @RequestBody InstituicaoEnsinoCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(instituicaoService.cadastrar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstituicaoEnsinoDTO> atualizar(@PathVariable Long id,
                                                           @Valid @RequestBody InstituicaoEnsinoCreateDTO dto) {
        return ResponseEntity.ok(instituicaoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        instituicaoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
