package com.sme.service;

import com.sme.dto.CupomDTO;
import com.sme.model.*;
import com.sme.model.enums.TipoTransacao;
import com.sme.repository.AlunoRepository;
import com.sme.repository.TransacaoRepository;
import com.sme.repository.VantagemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class ResgateService {

    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final TransacaoRepository transacaoRepository;
    private final CupomService cupomService;
    private final EmailService emailService;

    public ResgateService(AlunoRepository alunoRepository,
                          VantagemRepository vantagemRepository,
                          TransacaoRepository transacaoRepository,
                          CupomService cupomService,
                          EmailService emailService) {
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.transacaoRepository = transacaoRepository;
        this.cupomService = cupomService;
        this.emailService = emailService;
    }

    public CupomDTO resgatarVantagem(Long alunoId, Long vantagemId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));

        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new EntityNotFoundException("Vantagem não encontrada com id: " + vantagemId));

        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new IllegalArgumentException(
                    "Saldo insuficiente. Saldo: " + aluno.getSaldoMoedas() +
                    " | Custo: " + vantagem.getCustoMoedas());
        }

        EmpresaParceira empresa = vantagem.getEmpresa();

        // Debitar saldo
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.save(aluno);

        // Registrar transação
        Transacao transacao = new Transacao();
        transacao.setValor(vantagem.getCustoMoedas());
        transacao.setData(LocalDateTime.now());
        transacao.setMotivo("Resgate: " + vantagem.getDescricao());
        transacao.setTipo(TipoTransacao.RESGATE);
        transacao.setAluno(aluno);
        transacaoRepository.save(transacao);

        // Gerar cupom
        Cupom cupom = cupomService.gerarCupom(aluno, vantagem, empresa);

        // Enviar emails
        emailService.enviarCupomAluno(
                aluno.getEmail(), aluno.getNome(),
                vantagem.getDescricao(), cupom.getCodigo());

        emailService.enviarCupomEmpresa(
                empresa.getEmail(), empresa.getNome(),
                aluno.getNome(), vantagem.getDescricao(), cupom.getCodigo());

        return new CupomDTO(
                cupom.getId(), cupom.getCodigo(), cupom.getDataCriacao(),
                cupom.getStatus().name(), aluno.getNome(),
                vantagem.getDescricao(), empresa.getNome(), vantagem.getCustoMoedas()
        );
    }
}
