package com.sme.service;

import com.sme.dto.InstituicaoEnsinoCreateDTO;
import com.sme.dto.InstituicaoEnsinoDTO;
import com.sme.model.InstituicaoEnsino;
import com.sme.repository.InstituicaoEnsinoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class InstituicaoEnsinoService {

    private final InstituicaoEnsinoRepository repository;

    public InstituicaoEnsinoService(InstituicaoEnsinoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<InstituicaoEnsinoDTO> listarTodas() {
        return repository.findAll().stream()
                .map(i -> new InstituicaoEnsinoDTO(i.getId(), i.getNome(), i.getEndereco()))
                .toList();
    }

    @Transactional(readOnly = true)
    public InstituicaoEnsinoDTO buscarPorId(Long id) {
        InstituicaoEnsino inst = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Instituição não encontrada com id: " + id));
        return new InstituicaoEnsinoDTO(inst.getId(), inst.getNome(), inst.getEndereco());
    }

    public InstituicaoEnsinoDTO cadastrar(InstituicaoEnsinoCreateDTO dto) {
        InstituicaoEnsino inst = new InstituicaoEnsino(dto.nome(), dto.endereco());
        InstituicaoEnsino salva = repository.save(inst);
        return new InstituicaoEnsinoDTO(salva.getId(), salva.getNome(), salva.getEndereco());
    }

    public InstituicaoEnsinoDTO atualizar(Long id, InstituicaoEnsinoCreateDTO dto) {
        InstituicaoEnsino inst = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Instituição não encontrada com id: " + id));
        inst.setNome(dto.nome());
        inst.setEndereco(dto.endereco());
        InstituicaoEnsino atualizada = repository.save(inst);
        return new InstituicaoEnsinoDTO(atualizada.getId(), atualizada.getNome(), atualizada.getEndereco());
    }

    public void remover(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Instituição não encontrada com id: " + id);
        }
        repository.deleteById(id);
    }
}
