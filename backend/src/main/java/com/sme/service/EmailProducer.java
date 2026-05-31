package com.sme.service;

import com.sme.dto.EmailMessageDTO;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Publica mensagens de e-mail na fila RabbitMQ.
 * Responsabilidade única: serializar e enviar para a fila.
 */
@Service
public class EmailProducer {

    private final RabbitTemplate rabbitTemplate;

    @Value("${sme.rabbitmq.exchange}")
    private String exchange;

    @Value("${sme.rabbitmq.routing-key.email}")
    private String emailRoutingKey;

    public EmailProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Publica uma mensagem de e-mail na fila.
     *
     * @param to      destinatário
     * @param subject assunto
     * @param body    corpo do e-mail
     */
    public void enviarParaFila(String to, String subject, String body) {
        EmailMessageDTO message = new EmailMessageDTO(to, subject, body);
        rabbitTemplate.convertAndSend(exchange, emailRoutingKey, message);
        System.out.println("[RABBITMQ] Mensagem publicada na fila: " + message);
    }
}
