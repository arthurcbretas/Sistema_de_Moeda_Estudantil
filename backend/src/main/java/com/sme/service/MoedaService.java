package com.sme.service;

import com.sme.dto.EnvioMoedasDTO;
import com.sme.dto.TransacaoDTO;
import com.sme.model.Aluno;
import com.sme.model.Professor;
import com.sme.model.Transacao;
import com.sme.model.enums.TipoTransacao;
import com.sme.repository.AlunoRepository;
import com.sme.repository.ProfessorRepository;
import com.sme.repository.TransacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class MoedaService {

    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;
    private final EmailService emailService;

    public MoedaService(ProfessorRepository professorRepository,
                        AlunoRepository alunoRepository,
                        TransacaoRepository transacaoRepository,
                        EmailService emailService) {
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.transacaoRepository = transacaoRepository;
        this.emailService = emailService;
    }

    public TransacaoDTO enviarMoedas(Long professorId, EnvioMoedasDTO dto) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));

        Aluno aluno = alunoRepository.findById(dto.alunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado com id: " + dto.alunoId()));

        if (professor.getSaldoMoedas() < dto.valor()) {
            throw new IllegalArgumentException("Saldo insuficiente. Saldo atual: " + professor.getSaldoMoedas());
        }

        // Debitar professor
        professor.setSaldoMoedas(professor.getSaldoMoedas() - dto.valor());
        professorRepository.save(professor);

        // Creditar aluno
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + dto.valor());
        alunoRepository.save(aluno);

        // Registrar transação de envio (professor)
        Transacao envio = new Transacao();
        envio.setValor(dto.valor());
        envio.setData(LocalDateTime.now());
        envio.setMotivo(dto.motivo());
        envio.setTipo(TipoTransacao.ENVIO);
        envio.setProfessor(professor);
        envio.setAluno(aluno);
        transacaoRepository.save(envio);

        // Registrar transação de recebimento (aluno)
        Transacao recebimento = new Transacao();
        recebimento.setValor(dto.valor());
        recebimento.setData(LocalDateTime.now());
        recebimento.setMotivo(dto.motivo());
        recebimento.setTipo(TipoTransacao.RECEBIMENTO);
        recebimento.setProfessor(professor);
        recebimento.setAluno(aluno);
        transacaoRepository.save(recebimento);

        // Notificar aluno por email
        emailService.notificarRecebimentoMoedas(
                aluno.getEmail(), aluno.getNome(),
                professor.getNome(), dto.valor(), dto.motivo());

        return new TransacaoDTO(
                envio.getId(), envio.getValor(), envio.getData(),
                envio.getMotivo(), envio.getTipo().name(),
                professor.getNome(), aluno.getNome(), null
        );
    }
}
