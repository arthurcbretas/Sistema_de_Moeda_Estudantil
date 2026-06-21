package com.sme.service;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/**
 * Serviço de e-mail — camada de orquestração.
 *
 * Responsabilidade: montar os templates HTML e delegar a publicação
 * para a fila RabbitMQ via {@link EmailProducer}.
 *
 * O envio real SMTP ocorre no {@link EmailConsumer}, que consome a fila
 * em uma thread separada, garantindo que a requisição HTTP retorne imediatamente.
 *
 * Padrão: Produtor-Consumidor via RabbitMQ.
 */
@Service
public class EmailService {

    private final EmailProducer emailProducer;
    private final TemplateEngine templateEngine;

    public EmailService(EmailProducer emailProducer, TemplateEngine templateEngine) {
        this.emailProducer = emailProducer;
        this.templateEngine = templateEngine;
    }

    // ═══════════════════════════════════════════════════
    // Templates de email — UC03: Envio de Moedas
    // ═══════════════════════════════════════════════════

    public void notificarRecebimentoMoedas(String emailAluno, String nomeAluno,
                                            String nomeProfessor, double valor, String motivo) {
        String subject = "🎉 Você recebeu moedas! — Moeda Estudantil";
        
        Context context = new Context();
        context.setVariable("nomeAluno", nomeAluno);
        context.setVariable("valor", valor);
        context.setVariable("nomeProfessor", nomeProfessor);
        context.setVariable("motivo", motivo);
        
        String html = templateEngine.process("email-recebimento-moedas", context);
        
        emailProducer.enviarParaFila(emailAluno, subject, html);
    }

    public void enviarConfirmacaoEnvioProfessor(String emailProfessor, String nomeProfessor,
                                                String nomeAluno, double valor, String motivo,
                                                double saldoRestante) {
        String subject = "✅ Confirmação de envio de moedas — Moeda Estudantil";
        
        Context context = new Context();
        context.setVariable("nomeProfessor", nomeProfessor);
        context.setVariable("valor", valor);
        context.setVariable("nomeAluno", nomeAluno);
        context.setVariable("motivo", motivo);
        context.setVariable("saldoRestante", saldoRestante);
        
        String html = templateEngine.process("email-confirmacao-envio", context);
        
        emailProducer.enviarParaFila(emailProfessor, subject, html);
    }

    // ═══════════════════════════════════════════════════
    // Templates de email — UC08: Resgate de Vantagem
    // ═══════════════════════════════════════════════════

    public void enviarCupomAluno(String emailAluno, String nomeAluno,
                                  String vantagemDescricao, String codigoCupom) {
        String subject = "🎟️ Seu cupom de resgate — Moeda Estudantil";
        
        Context context = new Context();
        context.setVariable("nomeAluno", nomeAluno);
        context.setVariable("vantagemDescricao", vantagemDescricao);
        context.setVariable("codigoCupom", codigoCupom);
        
        String html = templateEngine.process("email-cupom-aluno", context);
        
        emailProducer.enviarParaFila(emailAluno, subject, html);
    }

    public void enviarCupomEmpresa(String emailEmpresa, String nomeEmpresa,
                                    String nomeAluno, String vantagemDescricao,
                                    String codigoCupom) {
        String subject = "📋 Novo resgate realizado — Moeda Estudantil";
        
        Context context = new Context();
        context.setVariable("nomeEmpresa", nomeEmpresa);
        context.setVariable("nomeAluno", nomeAluno);
        context.setVariable("vantagemDescricao", vantagemDescricao);
        context.setVariable("codigoCupom", codigoCupom);
        
        String html = templateEngine.process("email-cupom-empresa", context);
        
        emailProducer.enviarParaFila(emailEmpresa, subject, html);
    }
}
