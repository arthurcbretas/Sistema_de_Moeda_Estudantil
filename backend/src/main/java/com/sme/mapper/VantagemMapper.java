package com.sme.mapper;

import com.sme.dto.VantagemCreateDTO;
import com.sme.dto.VantagemDTO;
import com.sme.model.EmpresaParceira;
import com.sme.model.Vantagem;
import org.springframework.stereotype.Component;

@Component
public class VantagemMapper {

    public VantagemDTO toDTO(Vantagem vantagem) {
        return new VantagemDTO(
            vantagem.getId(),
            vantagem.getDescricao(),
            vantagem.getFotoUrl(),
            vantagem.getCustoMoedas(),
            vantagem.getEmpresa().getId(),
            vantagem.getEmpresa().getNome()
        );
    }

    public Vantagem toEntity(VantagemCreateDTO dto, EmpresaParceira empresa) {
        Vantagem vantagem = new Vantagem();
        vantagem.setDescricao(dto.descricao());
        vantagem.setFotoUrl(dto.fotoUrl());
        vantagem.setCustoMoedas(dto.custoMoedas());
        vantagem.setEmpresa(empresa);
        return vantagem;
    }

    public void updateEntity(Vantagem vantagem, VantagemCreateDTO dto) {
        vantagem.setDescricao(dto.descricao());
        vantagem.setFotoUrl(dto.fotoUrl());
        vantagem.setCustoMoedas(dto.custoMoedas());
    }
}
