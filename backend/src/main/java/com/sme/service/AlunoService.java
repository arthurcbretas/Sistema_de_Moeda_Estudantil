package com.sme.service;

import com.sme.dto.AlunoCreateDTO;
import com.sme.dto.AlunoDTO;
import com.sme.mapper.AlunoMapper;
import com.sme.model.Aluno;
import com.sme.model.InstituicaoEnsino;
import com.sme.repository.AlunoRepository;
import com.sme.repository.InstituicaoEnsinoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final InstituicaoEnsinoRepository instituicaoRepository;
    private final AlunoMapper mapper;

    public AlunoService(AlunoRepository alunoRepository,
                        InstituicaoEnsinoRepository instituicaoRepository,
                        AlunoMapper mapper) {
        this.alunoRepository = alunoRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<AlunoDTO> listarTodos() {
        return alunoRepository.findAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public AlunoDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado com id: " + id));
        return mapper.toDTO(aluno);
    }

    public AlunoDTO cadastrar(AlunoCreateDTO dto) {
        // Validação de unicidade
        if (alunoRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (alunoRepository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado: " + dto.cpf());
        }

        // Buscar instituição (se informada)
        InstituicaoEnsino instituicao = null;
        if (dto.instituicaoId() != null) {
            instituicao = instituicaoRepository.findById(dto.instituicaoId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Instituição não encontrada com id: " + dto.instituicaoId()));
        }

        // TODO: Hash da senha com BCrypt na Sprint 3 (autenticação)
        Aluno aluno = mapper.toEntity(dto, instituicao);
        Aluno salvo = alunoRepository.save(aluno);
        return mapper.toDTO(salvo);
    }

    public AlunoDTO atualizar(Long id, AlunoCreateDTO dto) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado com id: " + id));

        // Verificar unicidade apenas se mudou o email/cpf
        if (!aluno.getEmail().equals(dto.email()) && alunoRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (!aluno.getCpf().equals(dto.cpf()) && alunoRepository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado: " + dto.cpf());
        }

        InstituicaoEnsino instituicao = null;
        if (dto.instituicaoId() != null) {
            instituicao = instituicaoRepository.findById(dto.instituicaoId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Instituição não encontrada com id: " + dto.instituicaoId()));
        }

        mapper.updateEntity(aluno, dto, instituicao);
        Aluno atualizado = alunoRepository.save(aluno);
        return mapper.toDTO(atualizado);
    }

    public void remover(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new EntityNotFoundException("Aluno não encontrado com id: " + id);
        }
        alunoRepository.deleteById(id);
    }
}
