package com.sme.repository;

import com.sme.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CupomRepository extends JpaRepository<Cupom, Long> {
    Optional<Cupom> findByCodigo(String codigo);
    List<Cupom> findByAlunoIdOrderByDataCriacaoDesc(Long alunoId);
    List<Cupom> findByEmpresaIdOrderByDataCriacaoDesc(Long empresaId);
}
