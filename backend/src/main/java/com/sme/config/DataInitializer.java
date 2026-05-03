package com.sme.config;

import com.sme.model.InstituicaoEnsino;
import com.sme.repository.InstituicaoEnsinoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Inicializa dados de exemplo no banco ao iniciar a aplicação.
 * Apenas ativo no perfil "dev" (padrão) ou quando spring.profiles.active não estiver definido.
 */
@Component
@Profile("!prod")
public class DataInitializer implements CommandLineRunner {

    private final InstituicaoEnsinoRepository instituicaoRepository;

    public DataInitializer(InstituicaoEnsinoRepository instituicaoRepository) {
        this.instituicaoRepository = instituicaoRepository;
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
    }
}
