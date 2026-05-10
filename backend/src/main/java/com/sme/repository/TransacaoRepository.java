package com.sme.repository;

import com.sme.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByAlunoIdOrderByDataDesc(Long alunoId);
    List<Transacao> findByProfessorIdOrderByDataDesc(Long professorId);
}
