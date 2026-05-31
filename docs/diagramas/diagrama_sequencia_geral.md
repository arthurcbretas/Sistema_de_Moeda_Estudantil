# Diagrama de Sequência Geral - Sistema de Moeda Estudantil

Este diagrama ilustra o fluxo completo e contínuo do sistema, envolvendo os três principais atores (Professor, Aluno, Empresa Parceira), desde o envio de moedas até o resgate e recebimento de cupons por e-mail. Inclui a camada de mensageria RabbitMQ para envio assíncrono de e-mails.

```mermaid
sequenceDiagram
    autonumber
    actor P as Professor
    actor A as Aluno
    actor E as Empresa Parceira
    
    box rgb(240, 240, 250) Sistema
    participant F as Frontend
    participant API as Backend (Controllers & Services)
    participant DB as Banco de Dados (Neon)
    end

    box rgb(255, 245, 230) Mensageria
    participant RMQ as RabbitMQ (email.queue)
    participant EC as EmailConsumer
    participant Mail as Email Service (SMTP)
    end

    %% Fluxo de Envio de Moedas
    rect rgb(235, 245, 235)
    note right of P: 1. Fluxo de Envio de Moedas
    P->>+F: Acessa tela de Envio e preenche Aluno, Valor e Motivo
    F->>+API: POST /api/moedas/enviar {alunoId, valor, motivo}
    API->>+DB: Verifica saldo do Professor
    DB-->>-API: Saldo OK
    API->>+DB: Deduz saldo do Professor
    DB-->>-API: OK
    API->>+DB: Adiciona saldo ao Aluno
    DB-->>-API: OK
    API->>+DB: Salva Transacao (Tipo: ENVIO)
    DB-->>-API: OK
    API->>+RMQ: Publica email de recebimento (aluno)
    RMQ-->>-API: ACK
    API->>+RMQ: Publica email de confirmação (professor)
    RMQ-->>-API: ACK
    API-->>-F: Retorna Sucesso (200 OK)
    F-->>-P: Mostra mensagem visual de sucesso e atualiza saldo
    Note over RMQ, Mail: Processamento assíncrono
    RMQ->>+EC: Entrega mensagens de email
    EC->>+Mail: Envia e-mail para aluno e professor
    Mail-->>-EC: Emails enviados
    EC-->>-RMQ: ACK
    end

    %% Fluxo de Cadastro de Vantagens
    rect rgb(255, 245, 230)
    note right of E: 2. Fluxo de Cadastro de Vantagens
    E->>+F: Acessa tela de Nova Vantagem (Descrição, Foto, Custo)
    F->>+API: POST /api/vantagens
    API->>+DB: Salva Vantagem na tabela
    DB-->>-API: OK
    API-->>-F: Retorna Vantagem criada
    F-->>-E: Exibe vantagem na listagem da Empresa
    end

    %% Fluxo de Resgate de Vantagem
    rect rgb(245, 235, 255)
    note right of A: 3. Fluxo de Resgate de Vantagem
    A->>+F: Visualiza lista de vantagens (/vantagens)
    F->>+API: GET /api/vantagens
    API->>+DB: Busca vantagens disponíveis
    DB-->>-API: Retorna Lista
    API-->>-F: Retorna Lista (JSON)
    F-->>-A: Renderiza catálogo
    A->>+F: Clica em "Resgatar" e confirma
    F->>+API: POST /api/resgates { vantagemId } (com JWT)
    API->>+DB: Verifica saldo do Aluno e custo da Vantagem
    DB-->>-API: Saldo OK
    API->>+DB: Deduz saldo do Aluno
    DB-->>-API: OK
    API->>+DB: Gera código único SME-XXXX-XXXX e salva Cupom
    DB-->>-API: OK
    API->>+DB: Salva Transacao (Tipo: RESGATE)
    DB-->>-API: OK
    API->>+RMQ: Publica email de cupom (aluno)
    RMQ-->>-API: ACK
    API->>+RMQ: Publica email de notificação (empresa)
    RMQ-->>-API: ACK
    API-->>-F: Retorna Cupom gerado
    F-->>-A: Exibe código na tela e modal de sucesso
    Note over RMQ, Mail: Processamento assíncrono
    RMQ->>+EC: Entrega mensagens de email
    EC->>+Mail: Envia cupom para aluno e notificação para empresa
    Mail-->>-EC: Emails enviados
    EC-->>-RMQ: ACK
    A->>F: Acessa página "Meus Cupons" para gerenciar
    end
```
