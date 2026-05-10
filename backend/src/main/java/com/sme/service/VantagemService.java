package com.sme.service;

import com.sme.dto.VantagemCreateDTO;
import com.sme.dto.VantagemDTO;
import com.sme.mapper.VantagemMapper;
import com.sme.model.EmpresaParceira;
import com.sme.model.Vantagem;
import com.sme.repository.EmpresaParceiraRepository;
import com.sme.repository.VantagemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final VantagemMapper mapper;

    public VantagemService(VantagemRepository vantagemRepository,
                           EmpresaParceiraRepository empresaRepository,
                           VantagemMapper mapper) {
        this.vantagemRepository = vantagemRepository;
        this.empresaRepository = empresaRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<VantagemDTO> listarTodas() {
        return vantagemRepository.findAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VantagemDTO> listarPorEmpresa(Long empresaId) {
        return vantagemRepository.findByEmpresaId(empresaId).stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public VantagemDTO buscarPorId(Long id) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vantagem não encontrada com id: " + id));
        return mapper.toDTO(vantagem);
    }

    public VantagemDTO cadastrar(VantagemCreateDTO dto) {
        EmpresaParceira empresa = empresaRepository.findById(dto.empresaId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Empresa não encontrada com id: " + dto.empresaId()));

        Vantagem vantagem = mapper.toEntity(dto, empresa);
        Vantagem salva = vantagemRepository.save(vantagem);
        return mapper.toDTO(salva);
    }

    public VantagemDTO atualizar(Long id, VantagemCreateDTO dto) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vantagem não encontrada com id: " + id));

        mapper.updateEntity(vantagem, dto);
        Vantagem atualizada = vantagemRepository.save(vantagem);
        return mapper.toDTO(atualizada);
    }

    public void remover(Long id) {
        if (!vantagemRepository.existsById(id)) {
            throw new EntityNotFoundException("Vantagem não encontrada com id: " + id);
        }
        vantagemRepository.deleteById(id);
    }
}
