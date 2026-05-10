package com.sme.service;

import com.sme.model.Professor;
import com.sme.model.Transacao;
import com.sme.model.enums.TipoTransacao;
import com.sme.repository.ProfessorRepository;
import com.sme.repository.TransacaoRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecargaSemestralService {

    private final ProfessorRepository professorRepository;
    private final TransacaoRepository transacaoRepository;

    public RecargaSemestralService(ProfessorRepository professorRepository,
                                   TransacaoRepository transacaoRepository) {
        this.professorRepository = professorRepository;
        this.transacaoRepository = transacaoRepository;
    }

    /**
     * Executa no primeiro dia de fevereiro e agosto às 00:00 (início dos semestres).
     */
    @Scheduled(cron = "0 0 0 1 2,8 *")
    @Transactional
    public void recarregarMoedasSemestrais() {
        String semestreAtual = calcularSemestreAtual();
        System.out.println("⏰ Recarga semestral iniciada: " + semestreAtual);

        List<Professor> professores = professorRepository.findAll();
        int count = 0;

        for (Professor professor : professores) {
            if (!semestreAtual.equals(professor.getUltimaRecargaSemestre())) {
                professor.setSaldoMoedas(professor.getSaldoMoedas() + 1000);
                professor.setUltimaRecargaSemestre(semestreAtual);
                professorRepository.save(professor);

                Transacao transacao = new Transacao();
                transacao.setValor(1000);
                transacao.setData(LocalDateTime.now());
                transacao.setMotivo("Recarga semestral " + semestreAtual);
                transacao.setTipo(TipoTransacao.RECARGA_SEMESTRAL);
                transacao.setProfessor(professor);
                transacaoRepository.save(transacao);

                count++;
            }
        }

        System.out.println("✅ Recarga semestral concluída: " + count + " professores recarregados.");
    }

    private String calcularSemestreAtual() {
        LocalDate now = LocalDate.now();
        int semestre = now.getMonthValue() <= 6 ? 1 : 2;
        return now.getYear() + "." + semestre;
    }
}
