package com.sme.controller;

import com.sme.dto.EnvioMoedasDTO;
import com.sme.dto.TransacaoDTO;
import com.sme.service.MoedaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moedas")
public class MoedaController {

    private final MoedaService moedaService;

    public MoedaController(MoedaService moedaService) {
        this.moedaService = moedaService;
    }

    @PostMapping("/enviar")
    public ResponseEntity<TransacaoDTO> enviarMoedas(
            Authentication auth,
            @Valid @RequestBody EnvioMoedasDTO dto) {
        Long professorId = (Long) auth.getCredentials();
        return ResponseEntity.ok(moedaService.enviarMoedas(professorId, dto));
    }
}
