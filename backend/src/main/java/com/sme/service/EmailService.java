package com.sme.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Serviço de e-mail que envia mensagens HTML de forma assíncrona via SMTP.
 * Se mail.enabled=false, apenas simula o envio no console (útil para desenvolvimento).
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String fromAddress;

    @Value("${mail.enabled:false}")
    private boolean mailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envia um e-mail HTML de forma assíncrona.
     * Se MAIL_ENABLED=false, apenas loga no console.
     */
    @Async
    public void enviarEmail(String to, String subject, String htmlBody) {
        if (!mailEnabled) {
            System.out.println("[EMAIL SIMULADO] Para: " + to + " | Assunto: " + subject);
            System.out.println("[EMAIL SIMULADO] Corpo: " + htmlBody.replaceAll("<[^>]+>", ""));
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("[EMAIL ENVIADO] Para: " + to + " | Assunto: " + subject);
        } catch (Exception e) {
            System.err.println("[EMAIL ERRO] Falha ao enviar para: " + to + " - " + e.getMessage());
        }
    }

    // ═══════════════════════════════════════════════════
    // Templates de email
    // ═══════════════════════════════════════════════════

    public void notificarRecebimentoMoedas(String emailAluno, String nomeAluno,
                                            String nomeProfessor, double valor, String motivo) {
        String subject = "🎉 Você recebeu moedas! — Moeda Estudantil";
        String html = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head><meta charset="UTF-8"><style>
                  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
                  .card{background:#fff;border-radius:12px;padding:32px;max-width:520px;margin:0 auto;box-shadow:0 2px 8px rgba(0,0,0,.1)}
                  .badge{background:#fbbf24;color:#1a1a1a;border-radius:24px;padding:8px 20px;font-size:1.5rem;font-weight:700;display:inline-block;margin:16px 0}
                  .label{color:#6b7280;font-size:.875rem;margin:0}
                  .value{color:#1a1a1a;font-size:1rem;font-weight:600;margin:2px 0 12px}
                  .footer{color:#9ca3af;font-size:.8rem;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px}
                </style></head>
                <body>
                <div class="card">
                  <h2 style="color:#fbbf24;margin-top:0">🪙 Moeda Estudantil</h2>
                  <p>Olá, <strong>%s</strong>!</p>
                  <p>Você recebeu moedas como reconhecimento pelo seu mérito acadêmico.</p>
                  <div class="badge">+%.0f moedas</div>
                  <p class="label">De:</p><p class="value">Professor(a) %s</p>
                  <p class="label">Motivo:</p><p class="value">%s</p>
                  <div class="footer">Sistema de Moeda Estudantil — PUC Minas</div>
                </div>
                </body></html>
                """.formatted(nomeAluno, valor, nomeProfessor, motivo);
        enviarEmail(emailAluno, subject, html);
    }

    public void enviarConfirmacaoEnvioProfessor(String emailProfessor, String nomeProfessor,
                                                String nomeAluno, double valor, String motivo,
                                                double saldoRestante) {
        String subject = "✅ Confirmação de envio de moedas — Moeda Estudantil";
        String html = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head><meta charset="UTF-8"><style>
                  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
                  .card{background:#fff;border-radius:12px;padding:32px;max-width:520px;margin:0 auto;box-shadow:0 2px 8px rgba(0,0,0,.1)}
                  .badge{background:#22c55e;color:#fff;border-radius:24px;padding:8px 20px;font-size:1.3rem;font-weight:700;display:inline-block;margin:16px 0}
                  .label{color:#6b7280;font-size:.875rem;margin:0}
                  .value{color:#1a1a1a;font-size:1rem;font-weight:600;margin:2px 0 12px}
                  .saldo{background:#f0fdf4;border-left:4px solid #22c55e;padding:12px 16px;border-radius:4px;margin-top:16px}
                  .footer{color:#9ca3af;font-size:.8rem;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px}
                </style></head>
                <body>
                <div class="card">
                  <h2 style="color:#22c55e;margin-top:0">✅ Envio Confirmado</h2>
                  <p>Olá, Professor(a) <strong>%s</strong>!</p>
                  <p>Seu envio de moedas foi processado com sucesso.</p>
                  <div class="badge">−%.0f moedas enviadas</div>
                  <p class="label">Para:</p><p class="value">%s</p>
                  <p class="label">Motivo:</p><p class="value">%s</p>
                  <div class="saldo"><strong>Saldo restante: %.0f moedas</strong></div>
                  <div class="footer">Sistema de Moeda Estudantil — PUC Minas</div>
                </div>
                </body></html>
                """.formatted(nomeProfessor, valor, nomeAluno, motivo, saldoRestante);
        enviarEmail(emailProfessor, subject, html);
    }

    public void enviarCupomAluno(String emailAluno, String nomeAluno,
                                  String vantagemDescricao, String codigoCupom) {
        String subject = "🎟️ Seu cupom de resgate — Moeda Estudantil";
        String html = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head><meta charset="UTF-8"><style>
                  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
                  .card{background:#fff;border-radius:12px;padding:32px;max-width:520px;margin:0 auto;box-shadow:0 2px 8px rgba(0,0,0,.1)}
                  .cupom{background:#1a1a2e;color:#fbbf24;border-radius:12px;padding:24px;text-align:center;margin:20px 0;font-family:monospace}
                  .cupom-code{font-size:2rem;font-weight:900;letter-spacing:4px;display:block}
                  .label{color:#6b7280;font-size:.875rem;margin:0}
                  .value{color:#1a1a1a;font-size:1rem;font-weight:600;margin:2px 0 12px}
                  .footer{color:#9ca3af;font-size:.8rem;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px}
                </style></head>
                <body>
                <div class="card">
                  <h2 style="color:#fbbf24;margin-top:0">🎟️ Moeda Estudantil</h2>
                  <p>Olá, <strong>%s</strong>!</p>
                  <p>Seu resgate foi processado com sucesso! Apresente o código abaixo no estabelecimento parceiro.</p>
                  <p class="label">Vantagem:</p><p class="value">%s</p>
                  <div class="cupom">
                    <span style="font-size:.8rem;color:#fbbf24;opacity:.8">CÓDIGO DO CUPOM</span>
                    <span class="cupom-code">%s</span>
                  </div>
                  <p style="color:#6b7280;font-size:.875rem">⚠️ Apresente este código ao estabelecimento parceiro para confirmar o resgate.</p>
                  <div class="footer">Sistema de Moeda Estudantil — PUC Minas</div>
                </div>
                </body></html>
                """.formatted(nomeAluno, vantagemDescricao, codigoCupom);
        enviarEmail(emailAluno, subject, html);
    }

    public void enviarCupomEmpresa(String emailEmpresa, String nomeEmpresa,
                                    String nomeAluno, String vantagemDescricao,
                                    String codigoCupom) {
        String subject = "📋 Novo resgate realizado — Moeda Estudantil";
        String html = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head><meta charset="UTF-8"><style>
                  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
                  .card{background:#fff;border-radius:12px;padding:32px;max-width:520px;margin:0 auto;box-shadow:0 2px 8px rgba(0,0,0,.1)}
                  .cupom{background:#1a1a2e;color:#fbbf24;border-radius:12px;padding:24px;text-align:center;margin:20px 0;font-family:monospace}
                  .cupom-code{font-size:2rem;font-weight:900;letter-spacing:4px;display:block}
                  .label{color:#6b7280;font-size:.875rem;margin:0}
                  .value{color:#1a1a1a;font-size:1rem;font-weight:600;margin:2px 0 12px}
                  .footer{color:#9ca3af;font-size:.8rem;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px}
                </style></head>
                <body>
                <div class="card">
                  <h2 style="color:#3b82f6;margin-top:0">📋 Novo Resgate</h2>
                  <p>Olá, <strong>%s</strong>!</p>
                  <p>Um aluno resgatou uma de suas vantagens. Confirme o código abaixo quando o aluno apresentá-lo.</p>
                  <p class="label">Aluno:</p><p class="value">%s</p>
                  <p class="label">Vantagem resgatada:</p><p class="value">%s</p>
                  <div class="cupom">
                    <span style="font-size:.8rem;color:#fbbf24;opacity:.8">CÓDIGO PARA CONFERÊNCIA</span>
                    <span class="cupom-code">%s</span>
                  </div>
                  <div class="footer">Sistema de Moeda Estudantil — PUC Minas</div>
                </div>
                </body></html>
                """.formatted(nomeEmpresa, nomeAluno, vantagemDescricao, codigoCupom);
        enviarEmail(emailEmpresa, subject, html);
    }
}
