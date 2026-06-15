package com.sme.service;

import com.sme.dto.EmailMessageDTO;
import jakarta.mail.internet.MimeMessage;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

/**
 * Consome mensagens de e-mail da fila RabbitMQ e realiza o envio efetivo via SMTP.
 *
 * Esta classe é o CONSUMIDOR do padrão Produtor-Consumidor.
 * Roda em uma thread separada, gerenciada pelo RabbitMQ listener container,
 * garantindo que a requisição HTTP do usuário já tenha retornado.
 *
 * Se mail.enabled=false, apenas simula o envio no console (útil para desenvolvimento).
 */
@Component
public class EmailConsumer {

    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String fromAddress;

    @Value("${mail.enabled:false}")
    private boolean mailEnabled;

    public EmailConsumer(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Processa mensagens de e-mail recebidas da fila RabbitMQ.
     * Envia e-mail HTML via SMTP do Gmail.
     */
    @RabbitListener(queues = "${sme.rabbitmq.queue.email}")
    public void processarEmail(EmailMessageDTO message) {
        System.out.println("[RABBITMQ CONSUMER] Mensagem recebida da fila: " + message);

        if (!mailEnabled) {
            System.out.println("[EMAIL SIMULADO] Para: " + message.getTo()
                    + " | Assunto: " + message.getSubject());
            System.out.println("[EMAIL SIMULADO] Corpo: "
                    + message.getBody().replaceAll("<[^>]+>", ""));
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(message.getTo());
            helper.setSubject(message.getSubject());
            helper.setText(message.getBody(), true); // true = HTML
            mailSender.send(mimeMessage);
            System.out.println("[EMAIL ENVIADO] Para: " + message.getTo()
                    + " | Assunto: " + message.getSubject());
        } catch (Exception e) {
            System.err.println("[EMAIL ERRO] Falha ao enviar para: " + message.getTo()
                    + " - " + e.getMessage());
            // RabbitMQ fará retry automático se a exception propagar
            throw new RuntimeException("Falha no envio de email", e);
        }
    }
}
