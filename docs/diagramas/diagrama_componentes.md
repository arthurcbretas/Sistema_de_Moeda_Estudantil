# Diagrama de Componentes — Sistema de Moeda Estudantil

## Visão Geral

O sistema segue a **arquitetura MVC (Model-View-Controller)** conforme exigido pelo projeto. A aplicação é dividida em dois módulos principais: **Frontend (View)** em React e **Backend (Controller + Model)** em Spring Boot, com comunicação via API REST.

---

## Diagrama de Componentes (Visão Geral)

```mermaid
graph TB
    subgraph Frontend["🖥️ Frontend - React + Vite"]
        direction TB
        V_AUTH["Módulo de Autenticação<br/>(Login, Cadastro)"]
        V_ALUNO["Módulo do Aluno<br/>(Extrato, Resgate)"]
        V_PROF["Módulo do Professor<br/>(Extrato, Envio de Moedas)"]
        V_EMP["Módulo da Empresa<br/>(Gestão de Vantagens)"]
        V_SHARED["Componentes Compartilhados<br/>(Navbar, Footer, Cards)"]
        HTTP["HTTP Client<br/>(Axios / Fetch API)"]
    end

    subgraph Backend["⚙️ Backend - Spring Boot"]
        direction TB
        subgraph Controllers ["Camada Controller"]
            C_AUTH["AuthController"]
            C_ALUNO["AlunoController"]
            C_PROF["ProfessorController"]
            C_EMP["EmpresaParceiraController"]
            C_VANT["VantagemController"]
            C_TRANS["TransacaoController"]
        end

        subgraph Services ["Camada Service"]
            S_AUTH["AuthenticationService<br/>(Spring Security + JWT)"]
            S_ALUNO["AlunoService"]
            S_PROF["ProfessorService"]
            S_EMP["EmpresaParceiraService"]
            S_VANT["VantagemService"]
            S_TRANS["TransacaoService"]
            S_EMAIL["EmailNotificationService<br/>(JavaMail Sender)"]
            S_CUPOM["CupomService"]
            S_SCHED["SchedulerService<br/>(Spring Scheduler)"]
        end

        subgraph Repositories ["Camada Repository - JPA"]
            R_ALUNO["AlunoRepository"]
            R_PROF["ProfessorRepository"]
            R_EMP["EmpresaParceiraRepository"]
            R_INST["InstituicaoEnsinoRepository"]
            R_VANT["VantagemRepository"]
            R_TRANS["TransacaoRepository"]
            R_CUPOM["CupomRepository"]
        end

        subgraph Models ["Camada Model - Entidades JPA"]
            M_USR["Usuario<br/>(abstract)"]
            M_ALU["Aluno"]
            M_PRO["Professor"]
            M_EMP2["EmpresaParceira"]
            M_INST["InstituicaoEnsino"]
            M_VAN["Vantagem"]
            M_TRA["Transacao"]
            M_CUP["Cupom"]
            M_ENUM["Enums<br/>(TipoTransacao, StatusCupom, TipoUsuario)"]
        end

        subgraph Config ["Configuração"]
            CFG_SEC["SecurityConfig<br/>(CORS, JWT Filter)"]
            CFG_MAIL["MailConfig<br/>(SMTP Settings)"]
            CFG_DB["DatabaseConfig<br/>(DataSource, JPA)"]
        end
    end

    subgraph External ["🌐 Serviços Externos"]
        DB[("🗄️ PostgreSQL<br/>Banco de Dados")]
        SMTP["📧 Servidor SMTP<br/>(Email)"]
    end

    %% Conexões Frontend -> Backend
    HTTP -->|REST API / JSON| C_AUTH
    HTTP -->|REST API / JSON| C_ALUNO
    HTTP -->|REST API / JSON| C_PROF
    HTTP -->|REST API / JSON| C_EMP
    HTTP -->|REST API / JSON| C_VANT
    HTTP -->|REST API / JSON| C_TRANS

    V_AUTH --> HTTP
    V_ALUNO --> HTTP
    V_PROF --> HTTP
    V_EMP --> HTTP

    %% Conexões Controller -> Service
    C_AUTH --> S_AUTH
    C_ALUNO --> S_ALUNO
    C_PROF --> S_PROF
    C_EMP --> S_EMP
    C_VANT --> S_VANT
    C_TRANS --> S_TRANS

    %% Conexões Service -> Service
    S_ALUNO --> S_EMAIL
    S_ALUNO --> S_CUPOM
    S_PROF --> S_EMAIL
    S_SCHED --> S_PROF

    %% Conexões Service -> Repository
    S_ALUNO --> R_ALUNO
    S_PROF --> R_PROF
    S_EMP --> R_EMP
    S_VANT --> R_VANT
    S_TRANS --> R_TRANS
    S_CUPOM --> R_CUPOM
    S_AUTH --> R_ALUNO
    S_AUTH --> R_PROF
    S_AUTH --> R_EMP

    %% Conexões Repository -> DB
    R_ALUNO --> DB
    R_PROF --> DB
    R_EMP --> DB
    R_INST --> DB
    R_VANT --> DB
    R_TRANS --> DB
    R_CUPOM --> DB

    %% Conexões com serviços externos
    S_EMAIL --> SMTP
```

---

## Descrição dos Componentes

### Camada View (Frontend — React + Vite)

| Componente | Descrição |
|---|---|
| **Módulo de Autenticação** | Telas de login e cadastro (aluno e empresa). Gerencia token JWT no localStorage. |
| **Módulo do Aluno** | Dashboard do aluno: saldo, extrato de transações, lista de vantagens e resgate. |
| **Módulo do Professor** | Dashboard do professor: saldo, extrato, formulário de envio de moedas aos alunos. |
| **Módulo da Empresa** | Dashboard da empresa: CRUD de vantagens, visualização de cupons emitidos. |
| **Componentes Compartilhados** | Navbar, Footer, Cards, Modais e outros componentes reutilizáveis da UI. |
| **HTTP Client** | Camada de comunicação com a API REST do backend via Axios ou Fetch API. |

---

### Camada Controller (Backend — Spring Boot)

| Componente | Endpoints | Descrição |
|---|---|---|
| **AuthController** | POST `/api/auth/login`, POST `/api/auth/register` | Autenticação e registro de usuários |
| **AlunoController** | GET/PUT/DELETE `/api/alunos/{id}` | Operações CRUD de alunos |
| **ProfessorController** | GET `/api/professores`, POST `/api/professores/enviar-moedas` | Consulta e envio de moedas |
| **EmpresaParceiraController** | GET/POST/PUT/DELETE `/api/empresas` | CRUD de empresas parceiras |
| **VantagemController** | GET/POST/PUT/DELETE `/api/vantagens` | CRUD de vantagens, resgate |
| **TransacaoController** | GET `/api/transacoes/extrato/{userId}` | Consulta de extrato |

---

### Camada Service (Backend — Lógica de Negócio)

| Componente | Responsabilidade |
|---|---|
| **AuthenticationService** | Validação de credenciais, geração e verificação de tokens JWT, controle de acesso por role. Usa Spring Security. |
| **AlunoService** | Regras de negócio para alunos: cadastro, consulta de extrato, resgate de vantagens, validação de saldo. |
| **ProfessorService** | Regras de negócio para professores: envio de moedas (valida saldo e motivo), recarga semestral. |
| **EmpresaParceiraService** | Regras de negócio para empresas: cadastro e gestão de vantagens. |
| **VantagemService** | Gerenciamento de vantagens: CRUD, validações. |
| **TransacaoService** | Registro e consulta de transações de todos os tipos (ENVIO, RECEBIMENTO, RESGATE, RECARGA). |
| **EmailNotificationService** | Envio de emails usando JavaMail Sender: notificação de recebimento de moedas, cupons de resgate. |
| **CupomService** | Geração de códigos únicos (UUID), gerenciamento de status do cupom (GERADO → UTILIZADO/EXPIRADO). |
| **SchedulerService** | Job agendado via `@Scheduled` do Spring para executar a recarga semestral de 1.000 moedas para cada professor. Verifica `ultimaRecargaSemestre` para evitar duplicidade. |

---

### Camada Repository (Backend — Persistência JPA)

| Componente | Entidade | Descrição |
|---|---|---|
| **AlunoRepository** | Aluno | Interface JPA para operações no banco de dados de alunos |
| **ProfessorRepository** | Professor | Interface JPA para professores |
| **EmpresaParceiraRepository** | EmpresaParceira | Interface JPA para empresas |
| **InstituicaoEnsinoRepository** | InstituicaoEnsino | Interface JPA para instituições |
| **VantagemRepository** | Vantagem | Interface JPA para vantagens |
| **TransacaoRepository** | Transacao | Interface JPA para transações |
| **CupomRepository** | Cupom | Interface JPA para cupons |

---

### Camada Model (Entidades JPA)

As entidades persistentes mapeadas com JPA/Hibernate. Detalhes no [Diagrama de Classes](./diagrama_classes.md).

---

### Configuração

| Componente | Descrição |
|---|---|
| **SecurityConfig** | Configuração do Spring Security: CORS, filtros JWT, permissões de endpoints públicos/privados. |
| **MailConfig** | Configuração do servidor SMTP para envio de emails (host, porta, credenciais). |
| **DatabaseConfig** | Configuração da fonte de dados (DataSource), dialect do Hibernate e estratégia de DDL. |

---

### Serviços Externos

| Componente | Descrição |
|---|---|
| **PostgreSQL** | Banco de dados relacional para persistência de todas as entidades do sistema. |
| **Servidor SMTP** | Servidor de email para envio de notificações (ex: Gmail SMTP, Mailtrap, SendGrid). |

---

## Fluxo de Dados

### Fluxo: Professor envia moedas ao Aluno
```mermaid
sequenceDiagram
    participant PR as 👨‍🏫 Professor
    participant FE as 🖥️ Frontend
    participant CT as ⚙️ Controller
    participant SV as 🔧 Service
    participant RP as 🗄️ Repository
    participant DB as 💾 PostgreSQL
    participant EM as 📧 Email

    PR->>FE: Preenche formulário (aluno, valor, motivo)
    FE->>CT: POST /api/professores/enviar-moedas
    CT->>SV: ProfessorService.enviarMoedas()
    SV->>RP: Busca professor e aluno
    RP->>DB: SELECT professor, aluno
    DB-->>RP: Dados
    RP-->>SV: Entidades
    SV->>SV: Valida saldo >= valor
    SV->>RP: Atualiza saldos (debita professor, credita aluno)
    RP->>DB: UPDATE saldos
    SV->>RP: Cria transação
    RP->>DB: INSERT transação
    SV->>EM: Envia email de notificação ao aluno
    EM-->>SV: Email enviado
    SV-->>CT: Transação concluída
    CT-->>FE: 200 OK + dados da transação
    FE-->>PR: Confirmação visual
```

### Fluxo: Aluno resgata Vantagem
```mermaid
sequenceDiagram
    participant AL as 👨‍🎓 Aluno
    participant FE as 🖥️ Frontend
    participant CT as ⚙️ Controller
    participant SV as 🔧 Service
    participant RP as 🗄️ Repository
    participant DB as 💾 PostgreSQL
    participant EM as 📧 Email

    AL->>FE: Seleciona vantagem para resgate
    FE->>CT: POST /api/vantagens/resgatar
    CT->>SV: VantagemService.resgatar()
    SV->>RP: Busca aluno e vantagem
    RP->>DB: SELECT aluno, vantagem
    DB-->>RP: Dados
    RP-->>SV: Entidades
    SV->>SV: Valida saldo >= custoMoedas
    SV->>RP: Debita saldo do aluno
    RP->>DB: UPDATE aluno.saldoMoedas
    SV->>SV: CupomService.gerarCupom()
    SV->>RP: Cria cupom com código único
    RP->>DB: INSERT cupom
    SV->>RP: Cria transação de resgate
    RP->>DB: INSERT transação
    SV->>EM: Email com cupom → aluno
    SV->>EM: Email com cupom → empresa
    EM-->>SV: Emails enviados
    SV-->>CT: Cupom gerado
    CT-->>FE: 200 OK + cupom
    FE-->>AL: Exibe cupom na tela
```

---

## Tecnologias por Camada

| Camada | Tecnologia |
|---|---|
| **View** | React 18 + Vite + Axios |
| **Controller** | Spring Boot 3.x (REST Controllers) |
| **Service** | Spring Boot (Service Layer) |
| **Repository** | Spring Data JPA (Hibernate) |
| **Model** | Entidades JPA com anotações |
| **Banco de Dados** | PostgreSQL 16 |
| **Autenticação** | Spring Security + JWT |
| **Email** | JavaMail Sender (Spring Boot Starter Mail) |
| **Scheduler** | Spring Scheduler (@Scheduled) |
