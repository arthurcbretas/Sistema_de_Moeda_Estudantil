package com.sme.service;

import com.opencsv.CSVReader;
import com.sme.dto.ProfessorCreateDTO;
import com.sme.dto.ProfessorDTO;
import com.sme.mapper.ProfessorMapper;
import com.sme.model.InstituicaoEnsino;
import com.sme.model.Professor;
import com.sme.repository.InstituicaoEnsinoRepository;
import com.sme.repository.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final InstituicaoEnsinoRepository instituicaoRepository;
    private final ProfessorMapper mapper;
    private final PasswordEncoder passwordEncoder;

    public ProfessorService(ProfessorRepository professorRepository,
                            InstituicaoEnsinoRepository instituicaoRepository,
                            ProfessorMapper mapper,
                            PasswordEncoder passwordEncoder) {
        this.professorRepository = professorRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<ProfessorDTO> listarTodos() {
        return professorRepository.findAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProfessorDTO buscarPorId(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com id: " + id));
        return mapper.toDTO(professor);
    }

    public ProfessorDTO cadastrar(ProfessorCreateDTO dto) {
        if (professorRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (professorRepository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado: " + dto.cpf());
        }

        InstituicaoEnsino instituicao = null;
        if (dto.instituicaoId() != null) {
            instituicao = instituicaoRepository.findById(dto.instituicaoId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Instituição não encontrada com id: " + dto.instituicaoId()));
        }

        Professor professor = mapper.toEntity(dto, instituicao);
        professor.setSenha(passwordEncoder.encode(dto.senha()));
        Professor salvo = professorRepository.save(professor);
        return mapper.toDTO(salvo);
    }

    public ProfessorDTO atualizar(Long id, ProfessorCreateDTO dto) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com id: " + id));

        if (!professor.getEmail().equals(dto.email()) && professorRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (!professor.getCpf().equals(dto.cpf()) && professorRepository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado: " + dto.cpf());
        }

        InstituicaoEnsino instituicao = null;
        if (dto.instituicaoId() != null) {
            instituicao = instituicaoRepository.findById(dto.instituicaoId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Instituição não encontrada com id: " + dto.instituicaoId()));
        }

        mapper.updateEntity(professor, dto, instituicao);
        if (dto.senha() != null && !dto.senha().isBlank()) {
            professor.setSenha(passwordEncoder.encode(dto.senha()));
        }
        Professor atualizado = professorRepository.save(professor);
        return mapper.toDTO(atualizado);
    }

    public void remover(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new EntityNotFoundException("Professor não encontrado com id: " + id);
        }
        professorRepository.deleteById(id);
    }

    public List<ProfessorDTO> uploadCsv(MultipartFile file) {
        List<ProfessorDTO> criados = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String[] header = reader.readNext(); // pula header
            String[] line;
            while ((line = reader.readNext()) != null) {
                if (line.length < 5) continue;
                String nome = line[0].trim();
                String email = line[1].trim();
                String cpf = line[2].trim();
                String departamento = line[3].trim();
                String instIdStr = line[4].trim();

                if (professorRepository.existsByEmail(email) || professorRepository.existsByCpf(cpf)) {
                    continue; // pula duplicados
                }

                Long instId = Long.parseLong(instIdStr);
                InstituicaoEnsino instituicao = instituicaoRepository.findById(instId).orElse(null);

                Professor professor = new Professor();
                professor.setNome(nome);
                professor.setEmail(email);
                professor.setCpf(cpf);
                professor.setDepartamento(departamento);
                professor.setSenha(passwordEncoder.encode(cpf)); // senha padrão = CPF
                professor.setSaldoMoedas(1000);
                professor.setInstituicao(instituicao);

                Professor salvo = professorRepository.save(professor);
                criados.add(mapper.toDTO(salvo));
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Erro ao processar arquivo CSV: " + e.getMessage());
        }
        return criados;
    }
}
