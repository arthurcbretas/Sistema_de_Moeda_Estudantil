package com.sme.controller;

import com.sme.dto.CupomDTO;
import com.sme.dto.ResgateDTO;
import com.sme.service.ResgateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resgates")
public class ResgateController {

    private final ResgateService resgateService;

    public ResgateController(ResgateService resgateService) {
        this.resgateService = resgateService;
    }

    @PostMapping
    public ResponseEntity<CupomDTO> resgatar(
            Authentication auth,
            @Valid @RequestBody ResgateDTO dto) {
        Long alunoId = (Long) auth.getCredentials();
        CupomDTO cupom = resgateService.resgatarVantagem(alunoId, dto.vantagemId());
        return ResponseEntity.status(HttpStatus.CREATED).body(cupom);
    }
}
