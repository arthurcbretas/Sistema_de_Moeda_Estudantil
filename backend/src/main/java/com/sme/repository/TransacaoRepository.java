package com.sme.repository;

import com.sme.model.Transacao;
import com.sme.model.enums.TipoTransacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByAlunoIdOrderByDataDesc(Long alunoId);
    List<Transacao> findByAlunoIdAndTipoNotOrderByDataDesc(Long alunoId, TipoTransacao tipo);
    List<Transacao> findByProfessorIdOrderByDataDesc(Long professorId);
    List<Transacao> findByProfessorIdAndTipoOrderByDataDesc(Long professorId, TipoTransacao tipo);
}
