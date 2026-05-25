# Diagrama de Sequência Geral - Sistema de Moeda Estudantil

Este diagrama ilustra o fluxo completo e contínuo do sistema, envolvendo os três principais atores (Professor, Aluno, Empresa Parceira), desde o envio de moedas até o resgate e recebimento de cupons por e-mail.

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
    participant Mail as Email Service
    end

    %% Fluxo de Envio de Moedas
    rect rgb(235, 245, 235)
    note right of P: 1. Fluxo de Envio de Moedas
    P->>F: Acessa tela de Envio e preenche Aluno, Valor e Motivo
    F->>API: POST /api/moedas/enviar {alunoId, valor, motivo}
    API->>DB: Verifica saldo do Professor
    DB-->>API: Saldo OK
    API->>DB: Deduz saldo do Professor
    API->>DB: Adiciona saldo ao Aluno
    API->>DB: Salva Transacao (Tipo: ENVIO)
    API->>Mail: Envia e-mail de recebimento para o Aluno
    API->>Mail: Envia e-mail de confirmação para o Professor
    API-->>F: Retorna Sucesso (200 OK)
    F-->>P: Mostra mensagem visual de sucesso e atualiza saldo
    end

    %% Fluxo de Cadastro de Vantagens
    rect rgb(255, 245, 230)
    note right of E: 2. Fluxo de Cadastro de Vantagens
    E->>F: Acessa tela de Nova Vantagem (Descrição, Foto, Custo)
    F->>API: POST /api/vantagens
    API->>DB: Salva Vantagem na tabela
    API-->>F: Retorna Vantagem criada
    F-->>E: Exibe vantagem na listagem da Empresa
    end

    %% Fluxo de Resgate de Vantagem
    rect rgb(245, 235, 255)
    note right of A: 3. Fluxo de Resgate de Vantagem
    A->>F: Visualiza lista de vantagens (/vantagens)
    F->>API: GET /api/vantagens
    API->>DB: Busca vantagens disponíveis
    DB-->>API: Retorna Lista
    API-->>F: Retorna Lista (JSON)
    A->>F: Clica em "Resgatar" e confirma
    F->>API: POST /api/resgates { vantagemId } (com JWT)
    API->>DB: Verifica saldo do Aluno e custo da Vantagem
    DB-->>API: Saldo OK
    API->>DB: Deduz saldo do Aluno
    API->>DB: Gera código único SME-XXXX-XXXX
    API->>DB: Salva Cupom (com dados históricos da Vantagem)
    API->>DB: Salva Transacao (Tipo: RESGATE)
    API->>Mail: Envia código de resgate para o e-mail do Aluno
    API->>Mail: Notifica Empresa sobre o resgate
    API-->>F: Retorna Cupom gerado
    F-->>A: Exibe código na tela e modal de sucesso
    A->>F: Acessa página "Meus Cupons" para gerenciar
    end
```
