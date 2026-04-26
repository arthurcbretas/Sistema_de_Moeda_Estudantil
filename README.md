<a href="https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo"><img src="https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg" width="200"/></a>

---

# 🪙 Sistema de Moeda Estudantil 👨‍💻

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <b>Sistema de Moeda Estudantil</b> é uma plataforma para estimular o <i>reconhecimento do mérito estudantil</i> através de uma <b>moeda virtual</b>. Professores distribuem moedas aos seus alunos como forma de reconhecimento por bom comportamento e participação em aula. Os alunos acumulam essas moedas e podem trocá-las por <i>produtos e descontos</i> oferecidos por <b>empresas parceiras</b> cadastradas na plataforma. O sistema promove um ciclo virtuoso de <b>incentivo acadêmico</b>, conectando instituições de ensino, docentes, discentes e o mercado local.
      </div>
    </td>
    <td>
      <div>
        🪙🎓
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v0.1.0--sprint1-blue?style=for-the-badge)](https://github.com/arthurcbretas/Sistema_de_Moeda_Estudantil/releases)
![Java](https://img.shields.io/badge/Java-17-007ec6?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-007ec6?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-007ec6?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-007ec6?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-007ec6?style=for-the-badge&logo=postgresql&logoColor=white)

**📌 Sprint atual:** Sprint 1 — Modelagem do Sistema

---

## 📚 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Modelagem (Sprint 1)](#-modelagem-sprint-1)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Documentações Utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto

O **Sistema de Moeda Estudantil** foi desenvolvido como projeto da disciplina de **Laboratório de Desenvolvimento de Software** na PUC Minas. O sistema aborda o problema de falta de mecanismos de reconhecimento e incentivo ao mérito estudantil nas instituições de ensino.

### Problema
As instituições de ensino carecem de ferramentas digitais para reconhecer e premiar o desempenho e participação de seus alunos de forma tangível e motivadora.

### Solução
Uma plataforma web que implementa um sistema de moeda virtual onde:
- **Professores** reconhecem alunos distribuindo moedas (1.000 moedas/semestre)
- **Alunos** acumulam moedas e trocam por vantagens em empresas parceiras
- **Empresas parceiras** oferecem descontos e produtos como incentivo

### Diferenciais
- 🎯 **Reconhecimento personalizado** — professores informam o motivo do reconhecimento
- 📧 **Notificações em tempo real** — alunos são notificados por email ao receber moedas
- 🎫 **Sistema de cupons** — códigos únicos para conferência presencial nas empresas
- 📊 **Extrato detalhado** — histórico completo de transações para alunos e professores

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação Segura:** Login com email/senha e autorização por roles (Aluno, Professor, Empresa).
- 👨‍🎓 **Cadastro de Aluno:** Registro com dados pessoais e seleção de instituição pré-cadastrada.
- 🏢 **Cadastro de Empresa Parceira:** Registro de empresas com CNPJ e gestão de vantagens.
- 🪙 **Envio de Moedas:** Professores enviam moedas a alunos com motivo obrigatório.
- 📊 **Extrato de Conta:** Visualização de saldo e histórico de transações para alunos e professores.
- 🎁 **Cadastro de Vantagens:** Empresas cadastram vantagens com descrição, foto e custo em moedas.
- 🎫 **Resgate de Vantagens:** Alunos resgatam vantagens com geração de cupom único.
- 📧 **Notificações por Email:** Emails automáticos para recebimento de moedas e resgate de cupons.
- 🔄 **Recarga Semestral:** Sistema adiciona automaticamente 1.000 moedas/semestre aos professores.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end

* **Framework:** React 18
* **Linguagem:** JavaScript ES6+
* **Build Tool:** Vite 5.x
* **HTTP Client:** Axios

### 🖥️ Back-end

* **Linguagem:** Java 17 (JDK)
* **Framework:** Spring Boot 3.x
* **Banco de Dados:** PostgreSQL 16
* **ORM:** Hibernate / Spring Data JPA
* **Autenticação:** Spring Security + JWT
* **Email:** Spring Boot Starter Mail (JavaMail)
* **Scheduler:** Spring Scheduler (@Scheduled)

### ⚙️ Infraestrutura

* **Build:** Maven
* **Containerização:** Docker (opcional)

---

## 🏗 Arquitetura

O sistema segue a arquitetura **MVC (Model-View-Controller)** distribuída em dois módulos:

| Camada | Descrição | Tecnologia |
|---|---|---|
| **View** | Interface do usuário (SPA) | React + Vite |
| **Controller** | Endpoints REST da API | Spring Boot Controllers |
| **Service** | Lógica de negócio | Spring Boot Services |
| **Repository** | Acesso a dados | Spring Data JPA |
| **Model** | Entidades do domínio | JPA / Hibernate |
| **Database** | Persistência | PostgreSQL |

### Diagrama de Arquitetura (Resumido)

```mermaid
graph LR
    FE["🖥️ Frontend<br/>React + Vite"] -->|REST API| BE["⚙️ Backend<br/>Spring Boot"]
    BE --> DB[("🗄️ PostgreSQL")]
    BE --> SMTP["📧 SMTP<br/>Email"]
```

📄 **Diagrama completo:** [docs/diagramas/diagrama_componentes.md](./docs/diagramas/diagrama_componentes.md)

---

## 📐 Modelagem (Sprint 1)

A Sprint 1 produziu os seguintes artefatos de modelagem:

| Artefato | Documento |
|---|---|
| 📊 **Diagrama de Casos de Uso** | [diagrama_casos_uso.md](./docs/diagramas/diagrama_casos_uso.md) |
| 📝 **Histórias do Usuário** | [historias_usuario.md](./docs/historias_usuario.md) |
| 🏗️ **Diagrama de Classes** | [diagrama_classes.md](./docs/diagramas/diagrama_classes.md) |
| 🔧 **Diagrama de Componentes** | [diagrama_componentes.md](./docs/diagramas/diagrama_componentes.md) |
| 📋 **Documento Consolidado** | [modelagem_sprint1.md](./docs/modelagem_sprint1.md) |

### Entidades do Sistema

```mermaid
classDiagram
    direction LR
    class Usuario {
        <<abstract>>
        nome, email, senha, cpf
    }
    class Aluno {
        rg, endereco, curso, saldoMoedas
    }
    class Professor {
        departamento, saldoMoedas
    }
    class EmpresaParceira {
        nome, email, senha, cnpj
    }
    class InstituicaoEnsino {
        nome, endereco
    }
    class Vantagem {
        descricao, fotoUrl, custoMoedas
    }
    class Transacao {
        valor, data, motivo, tipo
    }
    class Cupom {
        codigo, status, dataCriacao
    }

    Usuario <|-- Aluno
    Usuario <|-- Professor
    Aluno --> InstituicaoEnsino
    Professor --> InstituicaoEnsino
    EmpresaParceira --> Vantagem
    Cupom --> Aluno
    Cupom --> Vantagem
    Cupom --> EmpresaParceira
```

---

## 🔧 Instalação e Execução

> ⚠️ **Nota:** A implementação do código será realizada nas Sprints 2 e 3. Esta seção será atualizada conforme o desenvolvimento avança.

### Pré-requisitos

* **Java JDK:** Versão **17** ou superior
* **Node.js:** Versão LTS (v18.x ou superior)
* **PostgreSQL:** Versão 16 ou superior
* **Maven:** Versão 3.9.x ou superior

### Estrutura Planejada

```bash
# Terminal 1: Backend
cd backend
./mvnw spring-boot:run
# 🚀 Backend em http://localhost:8080

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
# 🎨 Frontend em http://localhost:5173
```

---

## 📂 Estrutura de Pastas

```
Sistema_de_Moeda_Estudantil/
├── .gitignore                           # 🧹 Arquivos ignorados pelo Git
├── README.md                            # 📘 Documentação principal
├── template_README.md                   # 📄 Template de referência
│
├── /docs                                # 📚 Documentação do projeto
│   ├── modelagem_sprint1.md             # 📋 Documento consolidado da Sprint 1
│   ├── historias_usuario.md             # 📝 Histórias do usuário
│   └── /diagramas                       # 📊 Diagramas UML
│       ├── diagrama_casos_uso.md        # 📊 Diagrama de Casos de Uso
│       ├── diagrama_classes.md          # 🏗️ Diagrama de Classes
│       └── diagrama_componentes.md      # 🔧 Diagrama de Componentes
│
├── /backend                             # ⚙️ (Sprint 2+) Spring Boot
│   ├── pom.xml
│   └── /src/main/java/com/sme/
│       ├── /controller
│       ├── /service
│       ├── /repository
│       ├── /model
│       ├── /dto
│       ├── /config
│       └── /exception
│
└── /frontend                            # 🖥️ (Sprint 2+) React + Vite
    ├── package.json
    └── /src
        ├── /components
        ├── /pages
        ├── /services
        └── /styles
```

---

## 🔗 Documentações Utilizadas

* 📖 **Spring Boot:** [Documentação Oficial](https://docs.spring.io/spring-boot/docs/current/reference/html/)
* 📖 **React:** [Documentação Oficial](https://react.dev/reference/react)
* 📖 **Vite:** [Guia de Configuração](https://vitejs.dev/config/)
* 📖 **Spring Data JPA:** [Documentação](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
* 📖 **Spring Security:** [Documentação](https://docs.spring.io/spring-security/reference/index.html)
* 📖 **PostgreSQL:** [Documentação](https://www.postgresql.org/docs/16/)
* 📖 **Mermaid (Diagramas):** [Documentação](https://mermaid.js.org/intro/)

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub |
|---------|-----------------|
| Arthur C. Bretas | <div align="center"><a href="https://github.com/arthurcbretas"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> |

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) — Pelo apoio institucional e estrutura acadêmica.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — Pelos ensinamentos sobre Arquitetura de Software e Padrões de Projeto.

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**.

---