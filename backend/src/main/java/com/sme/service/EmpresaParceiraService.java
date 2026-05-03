package com.sme.service;

import com.sme.dto.EmpresaParceiraCreateDTO;
import com.sme.dto.EmpresaParceiraDTO;
import com.sme.mapper.EmpresaParceiraMapper;
import com.sme.model.EmpresaParceira;
import com.sme.repository.EmpresaParceiraRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmpresaParceiraService {

    private final EmpresaParceiraRepository empresaRepository;
    private final EmpresaParceiraMapper mapper;

    public EmpresaParceiraService(EmpresaParceiraRepository empresaRepository,
                                  EmpresaParceiraMapper mapper) {
        this.empresaRepository = empresaRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<EmpresaParceiraDTO> listarTodas() {
        return empresaRepository.findAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmpresaParceiraDTO buscarPorId(Long id) {
        EmpresaParceira empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empresa não encontrada com id: " + id));
        return mapper.toDTO(empresa);
    }

    public EmpresaParceiraDTO cadastrar(EmpresaParceiraCreateDTO dto) {
        if (empresaRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (empresaRepository.existsByCnpj(dto.cnpj())) {
            throw new IllegalArgumentException("CNPJ já cadastrado: " + dto.cnpj());
        }

        // TODO: Hash da senha com BCrypt na Sprint 3
        EmpresaParceira empresa = mapper.toEntity(dto);
        EmpresaParceira salva = empresaRepository.save(empresa);
        return mapper.toDTO(salva);
    }

    public EmpresaParceiraDTO atualizar(Long id, EmpresaParceiraCreateDTO dto) {
        EmpresaParceira empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empresa não encontrada com id: " + id));

        if (!empresa.getEmail().equals(dto.email()) && empresaRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (!empresa.getCnpj().equals(dto.cnpj()) && empresaRepository.existsByCnpj(dto.cnpj())) {
            throw new IllegalArgumentException("CNPJ já cadastrado: " + dto.cnpj());
        }

        mapper.updateEntity(empresa, dto);
        EmpresaParceira atualizada = empresaRepository.save(empresa);
        return mapper.toDTO(atualizada);
    }

    public void remover(Long id) {
        if (!empresaRepository.existsById(id)) {
            throw new EntityNotFoundException("Empresa não encontrada com id: " + id);
        }
        empresaRepository.deleteById(id);
    }
}
