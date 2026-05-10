package com.sme.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String fromAddress;

    @Value("${mail.enabled}")
    private boolean mailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarEmail(String to, String subject, String body) {
        if (!mailEnabled) {
            System.out.println("[EMAIL SIMULADO] Para: " + to + " | Assunto: " + subject);
            System.out.println("[EMAIL SIMULADO] Corpo: " + body);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void notificarRecebimentoMoedas(String emailAluno, String nomeAluno,
                                            String nomeProfessor, double valor, String motivo) {
        String subject = "Moeda Estudantil - Você recebeu moedas!";
        String body = String.format(
                "Olá %s,\n\n" +
                "Você recebeu %.0f moeda(s) do professor %s.\n" +
                "Motivo: %s\n\n" +
                "Acesse o sistema para conferir seu saldo.\n\n" +
                "Sistema de Moeda Estudantil",
                nomeAluno, valor, nomeProfessor, motivo);
        enviarEmail(emailAluno, subject, body);
    }

    public void enviarCupomAluno(String emailAluno, String nomeAluno,
                                  String vantagemDescricao, String codigoCupom) {
        String subject = "Moeda Estudantil - Seu cupom de resgate";
        String body = String.format(
                "Olá %s,\n\n" +
                "Você resgatou a vantagem: %s\n\n" +
                "Código do cupom: %s\n\n" +
                "Apresente este código no estabelecimento parceiro.\n\n" +
                "Sistema de Moeda Estudantil",
                nomeAluno, vantagemDescricao, codigoCupom);
        enviarEmail(emailAluno, subject, body);
    }

    public void enviarCupomEmpresa(String emailEmpresa, String nomeEmpresa,
                                    String nomeAluno, String vantagemDescricao,
                                    String codigoCupom) {
        String subject = "Moeda Estudantil - Novo resgate realizado";
        String body = String.format(
                "Olá %s,\n\n" +
                "O aluno %s resgatou a vantagem: %s\n\n" +
                "Código do cupom para conferência: %s\n\n" +
                "Sistema de Moeda Estudantil",
                nomeEmpresa, nomeAluno, vantagemDescricao, codigoCupom);
        enviarEmail(emailEmpresa, subject, body);
    }
}
