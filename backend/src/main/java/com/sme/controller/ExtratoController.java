package com.sme.controller;

import com.sme.dto.TransacaoDTO;
import com.sme.service.TransacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/extrato")
public class ExtratoController {

    private final TransacaoService transacaoService;

    public ExtratoController(TransacaoService transacaoService) {
        this.transacaoService = transacaoService;
    }

    @GetMapping
    public ResponseEntity<List<TransacaoDTO>> getExtrato(Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        String role = auth.getAuthorities().iterator().next().getAuthority();

        List<TransacaoDTO> extrato;
        if (role.equals("ROLE_PROFESSOR")) {
            extrato = transacaoService.extratoPorProfessor(userId);
        } else {
            extrato = transacaoService.extratoPorAluno(userId);
        }
        return ResponseEntity.ok(extrato);
    }
}
