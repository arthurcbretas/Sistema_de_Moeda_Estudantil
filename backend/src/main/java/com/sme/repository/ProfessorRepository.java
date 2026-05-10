package com.sme.repository;

import com.sme.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByEmail(String email);
    Optional<Professor> findByCpf(String cpf);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    List<Professor> findByUltimaRecargaSemestreNot(String semestre);
    List<Professor> findByUltimaRecargaSemestreIsNull();
}
