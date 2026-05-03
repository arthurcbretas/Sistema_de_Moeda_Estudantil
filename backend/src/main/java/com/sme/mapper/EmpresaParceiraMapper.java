package com.sme.mapper;

import com.sme.dto.EmpresaParceiraCreateDTO;
import com.sme.dto.EmpresaParceiraDTO;
import com.sme.model.EmpresaParceira;
import org.springframework.stereotype.Component;

/**
 * Mapper manual para conversão Entity <-> DTO de EmpresaParceira.
 */
@Component
public class EmpresaParceiraMapper {

    public EmpresaParceiraDTO toDTO(EmpresaParceira empresa) {
        return new EmpresaParceiraDTO(
            empresa.getId(),
            empresa.getNome(),
            empresa.getEmail(),
            empresa.getCnpj()
        );
    }

    public EmpresaParceira toEntity(EmpresaParceiraCreateDTO dto) {
        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setNome(dto.nome());
        empresa.setEmail(dto.email());
        empresa.setSenha(dto.senha());
        empresa.setCnpj(dto.cnpj());
        return empresa;
    }

    public void updateEntity(EmpresaParceira empresa, EmpresaParceiraCreateDTO dto) {
        empresa.setNome(dto.nome());
        empresa.setEmail(dto.email());
        if (dto.senha() != null && !dto.senha().isBlank()) {
            empresa.setSenha(dto.senha());
        }
        empresa.setCnpj(dto.cnpj());
    }
}
