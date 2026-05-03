# Diagrama de Componentes — Sistema de Moeda Estudantil

## Visão Geral

O sistema segue a **arquitetura MVC (Model-View-Controller)** distribuída em dois módulos: **Frontend (View)** em React e **Backend (Controller + Model)** em Spring Boot, com comunicação via API REST. Os componentes expõem **interfaces fornecidas** (●) e consomem **interfaces requeridas** (◐).

---

## Diagrama de Componentes com Interfaces

```mermaid
graph TB
    subgraph Frontend["🖥️ Frontend - React + Vite"]
        direction TB
        V_AUTH["Módulo de Autenticação<br/>(Login, Cadastro)"]
        V_ALUNO["Módulo do Aluno<br/>(Extrato, Resgate)"]
        V_PROF["Módulo do Professor<br/>(Extrato, Envio de Moedas)"]
        V_EMP["Módulo da Empresa<br/>(Gestão de Vantagens)"]
        V_SHARED["Componentes Compartilhados<br/>(Navbar, Footer, Cards)"]
        HTTP["HTTP Client<br/>(Axios)"]

        V_AUTH -->|usa| HTTP
        V_ALUNO -->|usa| HTTP
        V_PROF -->|usa| HTTP
        V_EMP -->|usa| HTTP
    end

    subgraph Backend["⚙️ Backend - Spring Boot"]
        direction TB
        subgraph Controllers ["Camada Controller — Interfaces Fornecidas"]
            C_AUTH["AuthController<br/>● IAuthAPI"]
            C_ALUNO["AlunoController<br/>● IAlunoAPI"]
            C_PROF["ProfessorController<br/>● IProfessorAPI"]
            C_EMP["EmpresaController<br/>● IEmpresaAPI"]
            C_VANT["VantagemController<br/>● IVantagemAPI"]
            C_TRANS["TransacaoController<br/>● ITransacaoAPI"]
            C_INST["InstituicaoController<br/>● IInstituicaoAPI"]
        end

        subgraph Services ["Camada Service — Lógica de Negócio"]
            S_AUTH["AuthService<br/>● IAuthService"]
            S_ALUNO["AlunoService<br/>● IAlunoService"]
            S_PROF["ProfessorService<br/>● IProfessorService"]
            S_EMP["EmpresaService<br/>● IEmpresaService"]
            S_VANT["VantagemService<br/>● IVantagemService"]
            S_TRANS["TransacaoService<br/>● ITransacaoService"]
            S_EMAIL["EmailService<br/>● IEmailService"]
            S_CUPOM["CupomService<br/>● ICupomService"]
            S_SCHED["SchedulerService"]
        end

        subgraph Repositories ["Camada Repository — Interfaces JPA"]
            R_ALUNO["AlunoRepository<br/>◐ IAlunoRepository"]
            R_PROF["ProfessorRepository<br/>◐ IProfessorRepository"]
            R_EMP["EmpresaRepository<br/>◐ IEmpresaRepository"]
            R_INST["InstituicaoRepository<br/>◐ IInstituicaoRepository"]
            R_VANT["VantagemRepository<br/>◐ IVantagemRepository"]
            R_TRANS["TransacaoRepository<br/>◐ ITransacaoRepository"]
            R_CUPOM["CupomRepository<br/>◐ ICupomRepository"]
        end

        subgraph Models ["Camada Model — Entidades JPA"]
            M_USR["Usuario (abstract)"]
            M_ALU["Aluno"]
            M_PRO["Professor"]
            M_EMP2["EmpresaParceira"]
            M_INST["InstituicaoEnsino"]
            M_VAN["Vantagem"]
            M_TRA["Transacao"]
            M_CUP["Cupom"]
        end

        subgraph Config ["Configuração"]
            CFG_SEC["SecurityConfig"]
            CFG_MAIL["MailConfig"]
            CFG_DB["DatabaseConfig"]
        end
    end

    subgraph External ["🌐 Serviços Externos"]
        DB[("🗄️ PostgreSQL / H2")]
        SMTP["📧 Servidor SMTP"]
    end

    %% Frontend requer interfaces do Backend (◐ → ●)
    HTTP -->|"◐ requer IAuthAPI"| C_AUTH
    HTTP -->|"◐ requer IAlunoAPI"| C_ALUNO
    HTTP -->|"◐ requer IProfessorAPI"| C_PROF
    HTTP -->|"◐ requer IEmpresaAPI"| C_EMP
    HTTP -->|"◐ requer IVantagemAPI"| C_VANT
    HTTP -->|"◐ requer ITransacaoAPI"| C_TRANS
    HTTP -->|"◐ requer IInstituicaoAPI"| C_INST

    %% Controller requer interfaces de Service
    C_AUTH --> S_AUTH
    C_ALUNO --> S_ALUNO
    C_PROF --> S_PROF
    C_EMP --> S_EMP
    C_VANT --> S_VANT
    C_TRANS --> S_TRANS
    C_INST -->|"◐ requer"| R_INST

    %% Service requer interfaces de outros Services
    S_ALUNO --> S_EMAIL
    S_ALUNO --> S_CUPOM
    S_PROF --> S_EMAIL
    S_SCHED --> S_PROF

    %% Service requer interfaces de Repository
    S_ALUNO --> R_ALUNO
    S_PROF --> R_PROF
    S_EMP --> R_EMP
    S_VANT --> R_VANT
    S_TRANS --> R_TRANS
    S_CUPOM --> R_CUPOM
    S_AUTH --> R_ALUNO
    S_AUTH --> R_PROF
    S_AUTH --> R_EMP

    %% Repository fornece acesso ao BD
    R_ALUNO --> DB
    R_PROF --> DB
    R_EMP --> DB
    R_INST --> DB
    R_VANT --> DB
    R_TRANS --> DB
    R_CUPOM --> DB

    %% Serviços Externos
    S_EMAIL --> SMTP
```

---

## Interfaces Fornecidas e Requeridas

### Interfaces Fornecidas (● — Provided)

Cada componente **fornece** uma interface que pode ser consumida por outros componentes.

| Componente | Interface Fornecida | Operações |
|---|---|---|
| AlunoController | `● IAlunoAPI` | GET, POST, PUT, DELETE `/api/alunos` |
| EmpresaController | `● IEmpresaAPI` | GET, POST, PUT, DELETE `/api/empresas` |
| ProfessorController | `● IProfessorAPI` | GET, POST `/api/professores` |
| VantagemController | `● IVantagemAPI` | GET, POST, PUT, DELETE `/api/vantagens` |
| TransacaoController | `● ITransacaoAPI` | GET `/api/transacoes/extrato/{id}` |
| AuthController | `● IAuthAPI` | POST `/api/auth/login`, `/api/auth/register` |
| InstituicaoController | `● IInstituicaoAPI` | GET `/api/instituicoes` |
| AlunoService | `● IAlunoService` | cadastrar, atualizar, buscar, remover, validarCpf |
| EmpresaService | `● IEmpresaService` | cadastrar, atualizar, buscar, remover, validarCnpj |
| EmailService | `● IEmailService` | enviarNotificacao, enviarCupom |
| CupomService | `● ICupomService` | gerarCupom, marcarUtilizado |

### Interfaces Requeridas (◐ — Required)

Cada componente **requer** interfaces de outros componentes para funcionar.

| Componente | Requer | Interface |
|---|---|---|
| HTTP Client (Frontend) | Controllers (Backend) | `◐ IAlunoAPI`, `◐ IEmpresaAPI`, etc. |
| AlunoController | AlunoService | `◐ IAlunoService` |
| EmpresaController | EmpresaService | `◐ IEmpresaService` |
| AlunoService | AlunoRepository | `◐ IAlunoRepository` |
| AlunoService | EmailService | `◐ IEmailService` |
| EmpresaService | EmpresaRepository | `◐ IEmpresaRepository` |
| Repositories (JPA) | Banco de Dados | `◐ JDBC/DataSource` |

---

## Descrição dos Componentes

### Camada View (Frontend — React + Vite)

| Componente | Descrição |
|---|---|
| **Módulo de Autenticação** | Telas de login e cadastro. Gerencia token JWT no localStorage. |
| **Módulo do Aluno** | Dashboard: saldo, extrato, vantagens e resgate. |
| **Módulo do Professor** | Dashboard: saldo, extrato, envio de moedas. |
| **Módulo da Empresa** | Dashboard: CRUD de vantagens, cupons emitidos. |
| **Componentes Compartilhados** | Navbar, Footer, Cards, Modais reutilizáveis. |
| **HTTP Client** | Axios com interceptors para JWT e tratamento de erros. |

### Camada Controller

| Componente | Endpoints | Interface Fornecida |
|---|---|---|
| AuthController | POST `/api/auth/login`, `/register` | `● IAuthAPI` |
| AlunoController | GET/POST/PUT/DELETE `/api/alunos` | `● IAlunoAPI` |
| EmpresaController | GET/POST/PUT/DELETE `/api/empresas` | `● IEmpresaAPI` |
| InstituicaoController | GET `/api/instituicoes` | `● IInstituicaoAPI` |
| ProfessorController | GET, POST `/api/professores` | `● IProfessorAPI` |
| VantagemController | GET/POST/PUT/DELETE `/api/vantagens` | `● IVantagemAPI` |
| TransacaoController | GET `/api/transacoes/extrato/{id}` | `● ITransacaoAPI` |

### Camada Service

| Componente | Responsabilidade | Interface Fornecida |
|---|---|---|
| AlunoService | CRUD alunos, validação CPF, saldo | `● IAlunoService` |
| EmpresaService | CRUD empresas, validação CNPJ | `● IEmpresaService` |
| ProfessorService | Envio moedas, recarga semestral | `● IProfessorService` |
| VantagemService | CRUD vantagens | `● IVantagemService` |
| TransacaoService | Registro e consulta transações | `● ITransacaoService` |
| EmailService | Envio de notificações (JavaMail) | `● IEmailService` |
| CupomService | Geração de cupons (UUID) | `● ICupomService` |
| SchedulerService | Job agendado recarga semestral | — |

### Camada Repository (JPA)

| Componente | Entidade | Interface |
|---|---|---|
| AlunoRepository | Aluno | `◐ IAlunoRepository` |
| ProfessorRepository | Professor | `◐ IProfessorRepository` |
| EmpresaRepository | EmpresaParceira | `◐ IEmpresaRepository` |
| InstituicaoRepository | InstituicaoEnsino | `◐ IInstituicaoRepository` |
| VantagemRepository | Vantagem | `◐ IVantagemRepository` |
| TransacaoRepository | Transacao | `◐ ITransacaoRepository` |
| CupomRepository | Cupom | `◐ ICupomRepository` |

---

## Tecnologias por Camada

| Camada | Tecnologia |
|---|---|
| **View** | React 18 + Vite + Axios |
| **Controller** | Spring Boot 3.x (REST Controllers) |
| **Service** | Spring Boot (Service Layer) |
| **Repository** | Spring Data JPA (Hibernate) |
| **Model** | Entidades JPA com anotações |
| **Banco de Dados** | H2 (dev) / PostgreSQL (prod) |
| **Autenticação** | Spring Security + JWT (Sprint 3) |
| **Email** | JavaMail Sender (Sprint 3) |
