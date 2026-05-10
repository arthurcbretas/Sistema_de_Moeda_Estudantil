package com.sme.mapper;

import com.sme.dto.ProfessorCreateDTO;
import com.sme.dto.ProfessorDTO;
import com.sme.model.InstituicaoEnsino;
import com.sme.model.Professor;
import org.springframework.stereotype.Component;

@Component
public class ProfessorMapper {

    public ProfessorDTO toDTO(Professor professor) {
        return new ProfessorDTO(
            professor.getId(),
            professor.getNome(),
            professor.getEmail(),
            professor.getCpf(),
            professor.getDepartamento(),
            professor.getSaldoMoedas(),
            professor.getInstituicao() != null ? professor.getInstituicao().getId() : null,
            professor.getInstituicao() != null ? professor.getInstituicao().getNome() : null
        );
    }

    public Professor toEntity(ProfessorCreateDTO dto, InstituicaoEnsino instituicao) {
        Professor professor = new Professor();
        professor.setNome(dto.nome());
        professor.setEmail(dto.email());
        professor.setSenha(dto.senha());
        professor.setCpf(dto.cpf());
        professor.setDepartamento(dto.departamento());
        professor.setSaldoMoedas(1000);
        professor.setInstituicao(instituicao);
        return professor;
    }

    public void updateEntity(Professor professor, ProfessorCreateDTO dto, InstituicaoEnsino instituicao) {
        professor.setNome(dto.nome());
        professor.setEmail(dto.email());
        professor.setCpf(dto.cpf());
        professor.setDepartamento(dto.departamento());
        professor.setInstituicao(instituicao);
    }
}
