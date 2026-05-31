package com.sme.service;

import com.sme.dto.EmailMessageDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * Consome mensagens de e-mail da fila RabbitMQ e realiza o envio efetivo via SMTP.
 * Se mail.enabled=false, apenas simula o envio no console.
 */
@Component
public class EmailConsumer {

    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String fromAddress;

    @Value("${mail.enabled}")
    private boolean mailEnabled;

    public EmailConsumer(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @RabbitListener(queues = "${sme.rabbitmq.queue.email}")
    public void processarEmail(EmailMessageDTO message) {
        System.out.println("[RABBITMQ CONSUMER] Mensagem recebida da fila: " + message);

        if (!mailEnabled) {
            System.out.println("[EMAIL SIMULADO] Para: " + message.getTo()
                    + " | Assunto: " + message.getSubject());
            System.out.println("[EMAIL SIMULADO] Corpo: " + message.getBody());
            return;
        }

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromAddress);
            mailMessage.setTo(message.getTo());
            mailMessage.setSubject(message.getSubject());
            mailMessage.setText(message.getBody());
            mailSender.send(mailMessage);
            System.out.println("[EMAIL ENVIADO] Para: " + message.getTo());
        } catch (Exception e) {
            System.err.println("[EMAIL ERRO] Falha ao enviar para: " + message.getTo()
                    + " - " + e.getMessage());
            // Em produção, considerar DLQ (Dead Letter Queue) ou retry
            throw e;
        }
    }
}
