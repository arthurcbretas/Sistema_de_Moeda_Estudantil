package com.sme.config;

import com.sme.model.*;
import com.sme.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Inicializa dados mínimos de demonstração em produção (Render).
 * Apenas executa se o banco estiver vazio — nunca sobrescreve dados existentes.
 */
@Component
@Profile("prod")
public class DataInitializerProd implements CommandLineRunner {

    private final InstituicaoEnsinoRepository instituicaoRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializerProd(InstituicaoEnsinoRepository instituicaoRepository,
                               ProfessorRepository professorRepository,
                               AlunoRepository alunoRepository,
                               EmpresaParceiraRepository empresaRepository,
                               UsuarioRepository usuarioRepository,
                               PasswordEncoder passwordEncoder) {
        this.instituicaoRepository = instituicaoRepository;
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        System.out.println("[DataInitializerProd] Verificando dados iniciais...");

        if (instituicaoRepository.count() == 0) {
            instituicaoRepository.saveAll(List.of(
                new InstituicaoEnsino("PUC Minas", "Av. Dom José Gaspar, 500 - Coração Eucarístico, BH"),
                new InstituicaoEnsino("UFMG", "Av. Antônio Carlos, 6627 - Pampulha, BH"),
                new InstituicaoEnsino("CEFET-MG", "Av. Amazonas, 7675 - Nova Gameleira, BH")
            ));
            System.out.println("[DataInitializerProd] ✅ 3 instituições criadas.");
        }

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
            System.out.println("[DataInitializerProd] ✅ Professor demo criado (professor@demo.com / 123456).");
        }

        if (alunoRepository.count() == 0) {
            InstituicaoEnsino puc = instituicaoRepository.findAll().get(0);
            Aluno aluno = new Aluno();
            aluno.setNome("Aluno Demo");
            aluno.setEmail("aluno@demo.com");
            aluno.setSenha(passwordEncoder.encode("123456"));
            aluno.setCpf("222.222.222-22");
            aluno.setRg("MG-12.345.678");
            aluno.setEndereco("Rua Exemplo, 100 - Belo Horizonte, MG");
            aluno.setCurso("Engenharia de Software");
            aluno.setSaldoMoedas(0);
            aluno.setInstituicao(puc);
            alunoRepository.save(aluno);
            System.out.println("[DataInitializerProd] ✅ Aluno demo criado (aluno@demo.com / 123456).");
        }

        if (empresaRepository.count() == 0) {
            EmpresaParceira emp = new EmpresaParceira();
            emp.setNome("Restaurante Universitário Demo");
            emp.setEmail("empresa@demo.com");
            emp.setSenha(passwordEncoder.encode("123456"));
            emp.setCnpj("11.111.111/0001-11");
            empresaRepository.save(emp);
            System.out.println("[DataInitializerProd] ✅ Empresa demo criada (empresa@demo.com / 123456).");
        }

        if (usuarioRepository.findByEmail("admin@demo.com").isEmpty()) {
            Admin admin = new Admin();
            admin.setNome("Administrador");
            admin.setEmail("admin@demo.com");
            admin.setSenha(passwordEncoder.encode("123456"));
            admin.setCpf("000.000.000-00");
            usuarioRepository.save(admin);
            System.out.println("[DataInitializerProd] ✅ Admin demo criado (admin@demo.com / 123456).");
        }

        System.out.println("[DataInitializerProd] Inicialização concluída.");
    }
}
