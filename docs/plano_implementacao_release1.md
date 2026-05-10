# Plano de Implementação Completo — Release 1

## Sistema de Moeda Estudantil

**Disciplina:** Laboratório de Desenvolvimento de Software  
**Data:** Maio/2026  
**Objetivo:** Implementar todas as funcionalidades previstas para a Release 1, corrigindo lacunas identificadas na análise do projeto.

---

## Diagnóstico Atual

### O que já está implementado

| Item | Backend | Frontend | Status |
|------|---------|----------|--------|
| CRUD Aluno | ✅ Controller + Service + Repository + Mapper + DTOs | ✅ AlunoList + AlunoForm | ✅ Completo |
| CRUD Empresa Parceira | ✅ Controller + Service + Repository + Mapper + DTOs | ✅ EmpresaList + EmpresaForm | ✅ Completo |
| Instituição de Ensino (Listar) | ✅ Controller (GET) + DataInitializer (seed) | ✅ Dropdown no AlunoForm | ✅ Completo |
| Modelagem (UC, HU, Classes, ER, Componentes) | — | — | ✅ Completo |

### O que está faltando

| Item | Criticidade |
|------|-------------|
| Senha armazenada em texto puro (sem BCrypt) | 🔴 Crítico |
| Autenticação JWT inexistente (SecurityConfig permite tudo) | 🔴 Crítico |
| CRUD Professor (entidade existe, mas sem Controller/Service/Repository) | 🔴 Crítico |
| CRUD Vantagem (entidade existe, mas sem Controller/Service/Repository) | 🔴 Crítico |
| Driver PostgreSQL comentado no pom.xml | 🔴 Crítico |
| Envio de moedas (Professor → Aluno) | 🟡 Importante |
| Resgate de vantagens (Aluno) | 🟡 Importante |
| Notificação por email | 🟡 Importante |
| Consulta de extrato de transações | 🟡 Importante |
| Sistema de cupons | 🟡 Importante |
| Recarga semestral de moedas (1000/professor) | 🟡 Importante |
| Frontend: Login, páginas por perfil, rotas protegidas | 🟡 Importante |
| Testes unitários e de integração | 🟠 Desejável |
| README desalinhado com código real | 🟠 Desejável |

---

## Fases de Implementação

---

### FASE 1 — Correções de Infraestrutura

**Pré-requisito para todas as demais fases.**

| # | Tarefa | Arquivo | Ação |
|---|--------|---------|------|
| 1.1 | Descomentar driver PostgreSQL no pom.xml | `backend/pom.xml` | Editar |
| 1.2 | Adicionar dependência `spring-boot-starter-mail` no pom.xml | `backend/pom.xml` | Editar |
| 1.3 | Adicionar configuração SMTP no application.properties | `backend/src/main/resources/application.properties` | Editar |
| 1.4 | Criar perfil `application-dev.properties` com H2 para dev local sem Docker | `backend/src/main/resources/application-dev.properties` | Criar |
| 1.5 | Adicionar bean `BCryptPasswordEncoder` no SecurityConfig | `backend/src/main/java/com/sme/config/SecurityConfig.java` | Editar |

**Critério de conclusão:** `mvn compile` passa sem erros; aplicação sobe com PostgreSQL via Docker Compose.

---

### FASE 2 — Autenticação e Segurança

**Base para controle de acesso por role (RBAC).**

| # | Tarefa | Arquivo | Ação |
|---|--------|---------|------|
| 2.1 | Criar `JwtUtil` — geração e validação de tokens JWT | `config/JwtUtil.java` | Criar |
| 2.2 | Criar `LoginRequestDTO` e `LoginResponseDTO` | `dto/LoginRequestDTO.java`, `dto/LoginResponseDTO.java` | Criar |
| 2.3 | Criar `CustomUserDetailsService` — carrega usuário por email (Aluno, Professor ou Empresa) | `service/CustomUserDetailsService.java` | Criar |
| 2.4 | Criar `AuthService` — lógica de login (email + senha), retorno de JWT | `service/AuthService.java` | Criar |
| 2.5 | Criar `AuthController` — endpoint `POST /api/auth/login` | `controller/AuthController.java` | Criar |
| 2.6 | Criar `JwtAuthenticationFilter` — filtro que intercepta requests e valida JWT | `config/JwtAuthenticationFilter.java` | Criar |
| 2.7 | Atualizar `SecurityConfig` — registrar filtro JWT, proteger rotas por role, liberar endpoints públicos | `config/SecurityConfig.java` | Editar |
| 2.8 | Hash de senha com BCrypt no `AlunoService.cadastrar()` e `atualizar()` | `service/AlunoService.java` | Editar |
| 2.9 | Hash de senha com BCrypt no `EmpresaParceiraService.cadastrar()` e `atualizar()` | `service/EmpresaParceiraService.java` | Editar |
| 2.10 | Atualizar `DataInitializer` — senhas de seed com BCrypt | `config/DataInitializer.java` | Editar |

#### Detalhes Técnicos

- JWT secret e expiração via `application.properties` (`jwt.secret`, `jwt.expiration`)
- Token enviado no header `Authorization: Bearer <token>`
- **Rotas públicas:**
  - `POST /api/auth/login`
  - `POST /api/alunos` (auto-cadastro)
  - `POST /api/empresas` (auto-cadastro)
  - `GET /api/instituicoes`
  - `GET /api/vantagens` (vitrine pública)
- **Rotas protegidas por role:**
  - `/api/professores/**` → PROFESSOR, ADMIN
  - `/api/vantagens` (POST/PUT/DELETE) → EMPRESA, ADMIN
  - `/api/moedas/**` → PROFESSOR
  - `/api/resgates/**` → ALUNO
  - `/api/extrato/**` → ALUNO, PROFESSOR

**Critério de conclusão:** Login retorna JWT válido; requests sem token retornam 401; requests com role errada retornam 403.

---

### FASE 3 — CRUDs Completos Backend

#### 3A — CRUD Professor

| # | Tarefa | Arquivo | Ação |
|---|--------|---------|------|
| 3.1 | Criar `ProfessorRepository` | `repository/ProfessorRepository.java` | Criar |
| 3.2 | Criar `ProfessorCreateDTO` (nome, email, senha, cpf, departamento, instituicaoId) | `dto/ProfessorCreateDTO.java` | Criar |
| 3.3 | Criar `ProfessorDTO` (resposta sem senha) | `dto/ProfessorDTO.java` | Criar |
| 3.4 | Criar `ProfessorMapper` | `mapper/ProfessorMapper.java` | Criar |
| 3.5 | Criar `ProfessorService` (CRUD completo + upload CSV via OpenCSV) | `service/ProfessorService.java` | Criar |
| 3.6 | Criar `ProfessorController` (`/api/professores`) com endpoint extra `POST /api/professores/upload-csv` | `controller/ProfessorController.java` | Criar |

**Regras de Negócio:**
- Professor é pré-cadastrado (pela instituição via CSV ou admin via formulário)
- Campos CSV: `nome, email, cpf, departamento, instituicaoId`
- Senha padrão ao cadastrar via CSV = CPF (hasheada com BCrypt)
- `saldoMoedas` inicia em 1000
- Validação de unicidade de email e CPF

#### 3B — CRUD Vantagem

| # | Tarefa | Arquivo | Ação |
|---|--------|---------|------|
| 3.7 | Criar `VantagemRepository` | `repository/VantagemRepository.java` | Criar |
| 3.8 | Criar `VantagemCreateDTO` (descricao, fotoUrl, custoMoedas, empresaId) | `dto/VantagemCreateDTO.java` | Criar |
| 3.9 | Criar `VantagemDTO` (resposta com nome da empresa) | `dto/VantagemDTO.java` | Criar |
| 3.10 | Criar `VantagemMapper` | `mapper/VantagemMapper.java` | Criar |
| 3.11 | Criar `VantagemService` | `service/VantagemService.java` | Criar |
| 3.12 | Criar `VantagemController` (`/api/vantagens`) | `controller/VantagemController.java` | Criar |

**Regras de Negócio:**
- Empresa cadastra vantagem com descrição, foto e custo em moedas
- Apenas a empresa dona ou ADMIN pode editar/remover suas vantagens
- `GET /api/vantagens` é público (vitrine)
- `GET /api/vantagens?empresaId=X` filtra por empresa

#### 3C — CRUD Instituição (complemento)

| # | Tarefa | Arquivo | Ação |
|---|--------|---------|------|
| 3.13 | Criar `InstituicaoEnsinoCreateDTO` | `dto/InstituicaoEnsinoCreateDTO.java` | Criar |
| 3.14 | Criar `InstituicaoEnsinoService` | `service/InstituicaoEnsinoService.java` | Criar |
| 3.15 | Expandir `InstituicaoEnsinoController` — adicionar POST, PUT, DELETE (restrito a ADMIN) | `controller/InstituicaoEnsinoController.java` | Editar |

**Critério de conclusão:** Todos os CRUDs retornam 200/201/204 via Postman; Upload CSV cria professores corretamente.

---

### FASE 4 — Lógica de Negócio Core

**Moedas, Resgate, Cupom, Email, Recarga Semestral.**

| # | Tarefa | Arquivo | Ação |
|---|--------|---------|------|
| 4.1 | Criar `TransacaoRepository` | `repository/TransacaoRepository.java` | Criar |
| 4.2 | Criar `CupomRepository` | `repository/CupomRepository.java` | Criar |
| 4.3 | Criar `TransacaoDTO` | `dto/TransacaoDTO.java` | Criar |
| 4.4 | Criar `CupomDTO` | `dto/CupomDTO.java` | Criar |
| 4.5 | Criar `EnvioMoedasDTO` (alunoId, valor, motivo) | `dto/EnvioMoedasDTO.java` | Criar |
| 4.6 | Criar `ResgateDTO` (vantagemId) | `dto/ResgateDTO.java` | Criar |
| 4.7 | Criar `EmailService` — envio de emails via Spring Mail | `service/EmailService.java` | Criar |
| 4.8 | Criar `TransacaoService` — registrar transações, consultar extrato por aluno ou professor | `service/TransacaoService.java` | Criar |
| 4.9 | Criar `CupomService` — gerar cupom com UUID, associar a aluno + vantagem + empresa | `service/CupomService.java` | Criar |
| 4.10 | Criar `MoedaService` — envio de moedas (professor → aluno) com validações | `service/MoedaService.java` | Criar |
| 4.11 | Criar `ResgateService` — resgate de vantagem, desconto saldo, gera cupom, envia emails | `service/ResgateService.java` | Criar |
| 4.12 | Criar `MoedaController` — `POST /api/moedas/enviar` | `controller/MoedaController.java` | Criar |
| 4.13 | Criar `ResgateController` — `POST /api/resgates` | `controller/ResgateController.java` | Criar |
| 4.14 | Criar `ExtratoController` — `GET /api/extrato` | `controller/ExtratoController.java` | Criar |
| 4.15 | Criar `RecargaSemestralService` — `@Scheduled` para recarga de 1000 moedas/professor | `service/RecargaSemestralService.java` | Criar |
| 4.16 | Adicionar `@EnableScheduling` na classe principal | `SmeApplication.java` | Editar |

#### Fluxo: Envio de Moedas (Professor → Aluno)

```
Professor autenticado → POST /api/moedas/enviar { alunoId, valor, motivo }

1. Verificar que professor está autenticado (JWT + role PROFESSOR)
2. Verificar saldo do professor >= valor
3. Debitar professor.saldoMoedas -= valor
4. Creditar aluno.saldoMoedas += valor
5. Registrar Transacao(tipo=ENVIO) vinculada ao professor
6. Registrar Transacao(tipo=RECEBIMENTO) vinculada ao aluno
7. Enviar email de notificação ao aluno
8. Retornar confirmação com dados da transação
```

#### Fluxo: Resgate de Vantagem (Aluno)

```
Aluno autenticado → POST /api/resgates { vantagemId }

1. Verificar que aluno está autenticado (JWT + role ALUNO)
2. Buscar vantagem pelo ID
3. Verificar saldo do aluno >= vantagem.custoMoedas
4. Debitar aluno.saldoMoedas -= vantagem.custoMoedas
5. Registrar Transacao(tipo=RESGATE) vinculada ao aluno
6. Gerar Cupom com código UUID único
7. Salvar Cupom (status=GERADO, aluno, vantagem, empresa)
8. Enviar email ao aluno com código do cupom
9. Enviar email à empresa parceira com código do cupom
10. Retornar CupomDTO ao aluno
```

#### Fluxo: Recarga Semestral

```
@Scheduled (início de cada semestre — configurável via cron)

1. Identificar semestre atual (ex: "2026.1")
2. Buscar todos os professores onde ultimaRecargaSemestre != semestreAtual
3. Para cada professor:
   a. professor.saldoMoedas += 1000
   b. professor.ultimaRecargaSemestre = semestreAtual
   c. Registrar Transacao(tipo=RECARGA_SEMESTRAL)
4. Log de confirmação
```

**Critério de conclusão:** Professor envia moedas → aluno recebe email → aluno resgata vantagem → ambos recebem cupom por email → extratos refletem todas as transações.

---

### FASE 5 — Frontend Completo

| # | Tarefa | Arquivo | Ação |
|---|--------|---------|------|
| 5.1 | Criar `AuthContext.jsx` (React Context + Provider para JWT e dados do usuário logado) | `frontend/src/context/AuthContext.jsx` | Criar |
| 5.2 | Criar `ProtectedRoute.jsx` (redireciona para login se não autenticado, valida role) | `frontend/src/components/ProtectedRoute.jsx` | Criar |
| 5.3 | Criar página `Login.jsx` | `frontend/src/pages/auth/Login.jsx` | Criar |
| 5.4 | Atualizar `api.js` — interceptor que injeta JWT; adicionar APIs de professor, vantagem, moedas, resgate, extrato, auth | `frontend/src/services/api.js` | Editar |
| 5.5 | Criar `ProfessorList.jsx` (tabela com listagem + botão upload CSV) | `frontend/src/pages/professor/ProfessorList.jsx` | Criar |
| 5.6 | Criar `ProfessorForm.jsx` (formulário + upload CSV) | `frontend/src/pages/professor/ProfessorForm.jsx` | Criar |
| 5.7 | Criar `VantagemList.jsx` (vitrine pública com cards: foto, descrição, custo) | `frontend/src/pages/vantagem/VantagemList.jsx` | Criar |
| 5.8 | Criar `VantagemForm.jsx` (cadastro pela empresa) | `frontend/src/pages/vantagem/VantagemForm.jsx` | Criar |
| 5.9 | Criar `InstituicaoList.jsx` e `InstituicaoForm.jsx` (ADMIN) | `frontend/src/pages/instituicao/` | Criar |
| 5.10 | Criar `EnvioMoedas.jsx` (professor seleciona aluno, valor, motivo) | `frontend/src/pages/professor/EnvioMoedas.jsx` | Criar |
| 5.11 | Criar `Extrato.jsx` (tabela de transações + saldo em destaque) | `frontend/src/pages/extrato/Extrato.jsx` | Criar |
| 5.12 | Criar `ResgateVantagem.jsx` (aluno escolhe vantagem, confirma resgate, vê cupom) | `frontend/src/pages/aluno/ResgateVantagem.jsx` | Criar |
| 5.13 | Criar `DashboardAluno.jsx` (saldo, últimas transações, atalhos) | `frontend/src/pages/dashboard/DashboardAluno.jsx` | Criar |
| 5.14 | Criar `DashboardProfessor.jsx` (saldo, últimos envios, atalhos) | `frontend/src/pages/dashboard/DashboardProfessor.jsx` | Criar |
| 5.15 | Criar `DashboardEmpresa.jsx` (vantagens cadastradas, últimos resgates) | `frontend/src/pages/dashboard/DashboardEmpresa.jsx` | Criar |
| 5.16 | Atualizar `App.jsx` — adicionar todas as novas rotas com ProtectedRoute | `frontend/src/App.jsx` | Editar |
| 5.17 | Atualizar `Navbar.jsx` — menu dinâmico conforme role autenticada | `frontend/src/components/Navbar.jsx` | Editar |

#### Mapa de Rotas do Frontend

| Rota | Componente | Acesso |
|------|-----------|--------|
| `/` | Home | Público |
| `/login` | Login | Público |
| `/vantagens` | VantagemList (vitrine) | Público |
| `/alunos` | AlunoList | ADMIN |
| `/alunos/novo` | AlunoForm | Público (auto-cadastro) |
| `/alunos/editar/:id` | AlunoForm | ADMIN, próprio ALUNO |
| `/empresas` | EmpresaList | ADMIN |
| `/empresas/nova` | EmpresaForm | Público (auto-cadastro) |
| `/empresas/editar/:id` | EmpresaForm | ADMIN, própria EMPRESA |
| `/professores` | ProfessorList | ADMIN |
| `/professores/novo` | ProfessorForm | ADMIN |
| `/professores/editar/:id` | ProfessorForm | ADMIN |
| `/instituicoes` | InstituicaoList | ADMIN |
| `/instituicoes/nova` | InstituicaoForm | ADMIN |
| `/vantagens/nova` | VantagemForm | EMPRESA |
| `/vantagens/editar/:id` | VantagemForm | EMPRESA (dona), ADMIN |
| `/moedas/enviar` | EnvioMoedas | PROFESSOR |
| `/extrato` | Extrato | ALUNO, PROFESSOR |
| `/resgatar` | ResgateVantagem | ALUNO |
| `/dashboard` | Dashboard (por perfil) | Autenticado |

**Critério de conclusão:** Todos os fluxos navegáveis no browser — cadastro → login → ações por role → logout.

---

### FASE 6 — Testes, Alinhamento e Entrega Final

| # | Tarefa | Arquivo | Ação |
|---|--------|---------|------|
| 6.1 | Criar testes unitários para `AlunoService` | `src/test/java/com/sme/service/AlunoServiceTest.java` | Criar |
| 6.2 | Criar testes unitários para `EmpresaParceiraService` | `src/test/java/com/sme/service/EmpresaParceiraServiceTest.java` | Criar |
| 6.3 | Criar testes unitários para `MoedaService` | `src/test/java/com/sme/service/MoedaServiceTest.java` | Criar |
| 6.4 | Criar testes unitários para `ResgateService` | `src/test/java/com/sme/service/ResgateServiceTest.java` | Criar |
| 6.5 | Criar testes unitários para `AuthService` | `src/test/java/com/sme/service/AuthServiceTest.java` | Criar |
| 6.6 | Criar testes de integração para controllers (MockMvc) | `src/test/java/com/sme/controller/` | Criar |
| 6.7 | Atualizar `README.md` — alinhar seção "Funcionalidades Implementadas" com código real | `README.md` | Editar |
| 6.8 | Atualizar diagrama de classes se houver mudanças na modelagem | `docs/diagramas/diagrama_classes.md` | Editar |
| 6.9 | Atualizar diagrama de componentes se houver mudanças na arquitetura | `docs/diagramas/diagrama_componentes.md` | Editar |
| 6.10 | Verificar todos os endpoints via Postman/Insomnia com autenticação | Manual | Teste |

**Critério de conclusão:** `mvn test` passa; README reflete o código real; diagramas atualizados.

---

## Resumo Quantitativo

| Ação | Quantidade de Arquivos |
|------|----------------------|
| Criar (Backend — Java) | ~25 |
| Criar (Frontend — JSX) | ~12 |
| Criar (Testes — Java) | ~6 |
| Criar (Config — properties) | ~1 |
| Editar (Backend existente) | ~7 |
| Editar (Frontend existente) | ~3 |
| Editar (Docs/README) | ~3 |
| **Total** | **~57** |

---

## Distribuição de Esforço por Fase

```
FASE 1 — Infraestrutura       ████░░░░░░░░░░░░░░░░   5%
FASE 2 — Autenticação/JWT     ████████░░░░░░░░░░░░  20%
FASE 3 — CRUDs Backend        ████████████░░░░░░░░  25%
FASE 4 — Negócio Core         ████████████████░░░░  25%
FASE 5 — Frontend Completo    ██████████████████░░  20%
FASE 6 — Testes/Docs/Entrega  ████████████████████   5%
```

---

## Dependências entre Fases

```
FASE 1 ──→ FASE 2 ──→ FASE 3 ──→ FASE 4
                │                    │
                └──────→ FASE 5 ←────┘
                              │
                              ▼
                          FASE 6
```

- **Fase 1** é pré-requisito absoluto (app não sobe sem driver PostgreSQL)
- **Fase 2** é pré-requisito para qualquer proteção de rota
- **Fase 3** pode ser iniciada em paralelo parcial com Fase 2 (CRUDs backend funcionam sem auth, e auth é adicionado depois)
- **Fase 4** depende de Fase 3 (precisa dos repositories de Professor, Vantagem, Transacao, Cupom)
- **Fase 5** depende de Fases 2+3+4 (consome todos os endpoints)
- **Fase 6** é a etapa final de validação

---

## Checklist Final de Conformidade com os Requisitos

- [ ] Alunos podem se cadastrar com nome, email, CPF, RG, endereço, instituição e curso
- [ ] Instituições de ensino estão pré-cadastradas (dropdown)
- [ ] Professores são pré-cadastrados (CSV ou formulário admin)
- [ ] Professor possui nome, CPF, departamento e vínculo com instituição
- [ ] Professores recebem 1000 moedas/semestre (acumulável)
- [ ] Professor pode enviar moedas com saldo suficiente + motivo obrigatório
- [ ] Aluno é notificado por email ao receber moedas
- [ ] Professores e alunos consultam extrato (saldo + transações)
- [ ] Empresas parceiras se cadastram com nome, email, senha, CNPJ
- [ ] Empresas cadastram vantagens com descrição, foto e custo em moedas
- [ ] Aluno seleciona vantagem para trocar moedas
- [ ] Ao resgatar: saldo descontado, cupom gerado, email para aluno e empresa com código
- [ ] Todos os atores possuem login e senha
- [ ] Processo de autenticação (JWT) implementado
- [ ] Arquitetura MVC respeitada (React View + Spring Controller/Service/Model)
- [ ] README alinhado com funcionalidades reais
- [ ] Diagramas UML atualizados conforme código final
