package com.sme.mapper;

import com.sme.dto.AlunoCreateDTO;
import com.sme.dto.AlunoDTO;
import com.sme.model.Aluno;
import com.sme.model.InstituicaoEnsino;
import org.springframework.stereotype.Component;

/**
 * Mapper manual para conversão Entity <-> DTO de Aluno.
 */
@Component
public class AlunoMapper {

    public AlunoDTO toDTO(Aluno aluno) {
        return new AlunoDTO(
            aluno.getId(),
            aluno.getNome(),
            aluno.getEmail(),
            aluno.getCpf(),
            aluno.getRg(),
            aluno.getEndereco(),
            aluno.getCurso(),
            aluno.getSaldoMoedas(),
            aluno.getInstituicao() != null ? aluno.getInstituicao().getId() : null,
            aluno.getInstituicao() != null ? aluno.getInstituicao().getNome() : null
        );
    }

    public Aluno toEntity(AlunoCreateDTO dto, InstituicaoEnsino instituicao) {
        Aluno aluno = new Aluno();
        aluno.setNome(dto.nome());
        aluno.setEmail(dto.email());
        aluno.setSenha(dto.senha());
        aluno.setCpf(dto.cpf());
        aluno.setRg(dto.rg());
        aluno.setEndereco(dto.endereco());
        aluno.setCurso(dto.curso());
        aluno.setSaldoMoedas(0);
        aluno.setInstituicao(instituicao);
        return aluno;
    }

    public void updateEntity(Aluno aluno, AlunoCreateDTO dto, InstituicaoEnsino instituicao) {
        aluno.setNome(dto.nome());
        aluno.setEmail(dto.email());
        if (dto.senha() != null && !dto.senha().isBlank()) {
            aluno.setSenha(dto.senha());
        }
        aluno.setCpf(dto.cpf());
        aluno.setRg(dto.rg());
        aluno.setEndereco(dto.endereco());
        aluno.setCurso(dto.curso());
        aluno.setInstituicao(instituicao);
    }
}
