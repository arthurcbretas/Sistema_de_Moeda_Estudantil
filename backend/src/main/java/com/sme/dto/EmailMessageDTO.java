package com.sme.dto;

import java.io.Serializable;

/**
 * DTO para mensagens de e-mail trafegadas via RabbitMQ.
 * Precisa ser Serializable para a fila e ter construtor vazio para desserialização Jackson.
 */
public class EmailMessageDTO implements Serializable {

    private String to;
    private String subject;
    private String body;

    public EmailMessageDTO() {
    }

    public EmailMessageDTO(String to, String subject, String body) {
        this.to = to;
        this.subject = subject;
        this.body = body;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    @Override
    public String toString() {
        return "EmailMessageDTO{to='" + to + "', subject='" + subject + "'}";
    }
}
