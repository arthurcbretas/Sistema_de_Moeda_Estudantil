package com.sme.controller;

import com.sme.dto.EmpresaParceiraCreateDTO;
import com.sme.dto.EmpresaParceiraDTO;
import com.sme.service.EmpresaParceiraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para operações CRUD de Empresa Parceira.
 * Fornece: ● IEmpresaAPI
 */
// TODO: Adicionar autenticação na Sprint 3
@RestController
@RequestMapping("/api/empresas")
public class EmpresaParceiraController {

    private final EmpresaParceiraService empresaService;

    public EmpresaParceiraController(EmpresaParceiraService empresaService) {
        this.empresaService = empresaService;
    }

    @GetMapping
    public ResponseEntity<List<EmpresaParceiraDTO>> listarTodas() {
        return ResponseEntity.ok(empresaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaParceiraDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<EmpresaParceiraDTO> cadastrar(@Valid @RequestBody EmpresaParceiraCreateDTO dto) {
        EmpresaParceiraDTO criada = empresaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaParceiraDTO> atualizar(@PathVariable Long id,
                                                         @Valid @RequestBody EmpresaParceiraCreateDTO dto) {
        return ResponseEntity.ok(empresaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        empresaService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
