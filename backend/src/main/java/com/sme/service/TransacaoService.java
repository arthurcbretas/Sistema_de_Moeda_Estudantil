package com.sme.service;

import com.sme.dto.TransacaoDTO;
import com.sme.model.Transacao;
import com.sme.repository.TransacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;

    public TransacaoService(TransacaoRepository transacaoRepository) {
        this.transacaoRepository = transacaoRepository;
    }

    public List<TransacaoDTO> extratoPorAluno(Long alunoId) {
        return transacaoRepository.findByAlunoIdOrderByDataDesc(alunoId).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<TransacaoDTO> extratoPorProfessor(Long professorId) {
        return transacaoRepository.findByProfessorIdOrderByDataDesc(professorId).stream()
                .map(this::toDTO)
                .toList();
    }

    private TransacaoDTO toDTO(Transacao t) {
        return new TransacaoDTO(
                t.getId(),
                t.getValor(),
                t.getData(),
                t.getMotivo(),
                t.getTipo().name(),
                t.getProfessor() != null ? t.getProfessor().getNome() : null,
                t.getAluno() != null ? t.getAluno().getNome() : null,
                null
        );
    }
}
