package com.sme.controller;

import com.sme.dto.ProfessorCreateDTO;
import com.sme.dto.ProfessorDTO;
import com.sme.service.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping
    public ResponseEntity<List<ProfessorDTO>> listarTodos() {
        return ResponseEntity.ok(professorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProfessorDTO> cadastrar(@Valid @RequestBody ProfessorCreateDTO dto) {
        ProfessorDTO criado = professorService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PostMapping(value = "/upload-csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<ProfessorDTO>> uploadCsv(@RequestParam("file") MultipartFile file) {
        List<ProfessorDTO> criados = professorService.uploadCsv(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(criados);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorDTO> atualizar(@PathVariable Long id,
                                                   @Valid @RequestBody ProfessorCreateDTO dto) {
        return ResponseEntity.ok(professorService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        professorService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
