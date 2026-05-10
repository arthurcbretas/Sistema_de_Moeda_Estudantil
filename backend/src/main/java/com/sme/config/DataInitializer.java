package com.sme.config;

import com.sme.model.Aluno;
import com.sme.model.EmpresaParceira;
import com.sme.model.InstituicaoEnsino;
import com.sme.model.Professor;
import com.sme.repository.AlunoRepository;
import com.sme.repository.EmpresaParceiraRepository;
import com.sme.repository.InstituicaoEnsinoRepository;
import com.sme.repository.ProfessorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("!prod")
public class DataInitializer implements CommandLineRunner {

    private final InstituicaoEnsinoRepository instituicaoRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(InstituicaoEnsinoRepository instituicaoRepository,
                           ProfessorRepository professorRepository,
                           AlunoRepository alunoRepository,
                           EmpresaParceiraRepository empresaRepository,
                           PasswordEncoder passwordEncoder) {
        this.instituicaoRepository = instituicaoRepository;
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (instituicaoRepository.count() == 0) {
            instituicaoRepository.saveAll(List.of(
                new InstituicaoEnsino("PUC Minas", "Av. Dom José Gaspar, 500 - Coração Eucarístico, BH"),
                new InstituicaoEnsino("UFMG", "Av. Antônio Carlos, 6627 - Pampulha, BH"),
                new InstituicaoEnsino("CEFET-MG", "Av. Amazonas, 7675 - Nova Gameleira, BH")
            ));
            System.out.println("✅ DataInitializer: 3 instituições de ensino criadas.");
        }

        // Seed de professor para testes
        if (professorRepository.count() == 0) {
            InstituicaoEnsino puc = instituicaoRepository.findAll().get(0);
            Professor prof = new Professor();
            prof.setNome("Prof. Demo");
            prof.setEmail("professor@demo.com");
            prof.setSenha(passwordEncoder.encode("123456"));
            prof.setCpf("111.111.111-11");
            prof.setDepartamento("Engenharia de Software");
            prof.setSaldoMoedas(1000);
            prof.setInstituicao(puc);
            professorRepository.save(prof);
            System.out.println("✅ DataInitializer: professor demo criado.");
        }

        // Seed de aluno para testes
        if (alunoRepository.count() == 0) {
            InstituicaoEnsino puc = instituicaoRepository.findAll().get(0);
            Aluno aluno = new Aluno();
            aluno.setNome("Aluno Demo");
            aluno.setEmail("aluno@demo.com");
            aluno.setSenha(passwordEncoder.encode("123456"));
            aluno.setCpf("222.222.222-22");
            aluno.setRg("MG-12.345.678");
            aluno.setEndereco("Rua Exemplo, 100");
            aluno.setCurso("Engenharia de Software");
            aluno.setSaldoMoedas(0);
            aluno.setInstituicao(puc);
            alunoRepository.save(aluno);
            System.out.println("✅ DataInitializer: aluno demo criado.");
        }

        // Seed de empresa para testes
        if (empresaRepository.count() == 0) {
            EmpresaParceira emp = new EmpresaParceira();
            emp.setNome("Empresa Demo");
            emp.setEmail("empresa@demo.com");
            emp.setSenha(passwordEncoder.encode("123456"));
            emp.setCnpj("11.111.111/0001-11");
            empresaRepository.save(emp);
            System.out.println("✅ DataInitializer: empresa demo criada.");
        }
    }
}
