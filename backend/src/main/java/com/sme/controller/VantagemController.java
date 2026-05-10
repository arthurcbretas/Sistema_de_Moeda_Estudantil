package com.sme.controller;

import com.sme.dto.VantagemCreateDTO;
import com.sme.dto.VantagemDTO;
import com.sme.service.VantagemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vantagens")
public class VantagemController {

    private final VantagemService vantagemService;

    public VantagemController(VantagemService vantagemService) {
        this.vantagemService = vantagemService;
    }

    @GetMapping
    public ResponseEntity<List<VantagemDTO>> listarTodas(
            @RequestParam(required = false) Long empresaId) {
        if (empresaId != null) {
            return ResponseEntity.ok(vantagemService.listarPorEmpresa(empresaId));
        }
        return ResponseEntity.ok(vantagemService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VantagemDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(vantagemService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<VantagemDTO> cadastrar(@Valid @RequestBody VantagemCreateDTO dto) {
        VantagemDTO criada = vantagemService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VantagemDTO> atualizar(@PathVariable Long id,
                                                  @Valid @RequestBody VantagemCreateDTO dto) {
        return ResponseEntity.ok(vantagemService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        vantagemService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
