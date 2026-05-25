package com.sme.service;

import com.sme.dto.CupomDTO;
import com.sme.model.Cupom;
import com.sme.model.Aluno;
import com.sme.model.EmpresaParceira;
import com.sme.model.Vantagem;
import com.sme.model.enums.StatusCupom;
import com.sme.repository.CupomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CupomService {

    private final CupomRepository cupomRepository;

    public CupomService(CupomRepository cupomRepository) {
        this.cupomRepository = cupomRepository;
    }

    public Cupom gerarCupom(Aluno aluno, Vantagem vantagem, EmpresaParceira empresa) {
        Cupom cupom = new Cupom();
        String uniqueCode = "SME-" + generateRandomString(4) + "-" + generateRandomString(4);
        cupom.setCodigo(uniqueCode);
        cupom.setStatus(StatusCupom.GERADO);
        cupom.setAluno(aluno);
        cupom.setVantagem(vantagem);
        cupom.setEmpresa(empresa);
        cupom.setVantagemDescricao(vantagem.getDescricao());
        cupom.setValorMoedas(vantagem.getCustoMoedas());
        return cupomRepository.save(cupom);
    }

    private String generateRandomString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return sb.toString();
    }

    @Transactional(readOnly = true)
    public List<CupomDTO> listarPorAluno(Long alunoId) {
        return cupomRepository.findByAlunoIdOrderByDataCriacaoDesc(alunoId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CupomDTO> listarPorEmpresa(Long empresaId) {
        return cupomRepository.findByEmpresaIdOrderByDataCriacaoDesc(empresaId).stream()
                .map(this::toDTO)
                .toList();
    }

    private CupomDTO toDTO(Cupom c) {
        return new CupomDTO(
                c.getId(),
                c.getCodigo(),
                c.getDataCriacao(),
                c.getStatus().name(),
                c.getAluno().getNome(),
                c.getVantagem().getDescricao(),
                c.getEmpresa().getNome(),
                c.getVantagem().getCustoMoedas()
        );
    }
}
