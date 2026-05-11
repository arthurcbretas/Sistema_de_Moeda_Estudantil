# Plano de Execução — Sistema de Moeda Estudantil

> **O que já está pronto (código):** Fases 1–5 completas.
> Todo o código do backend (Java/Spring Boot) e frontend (React/Vite) já foi escrito.
> Este plano cobre **o que falta rodar** no outro PC para validar, buildar e deployar.

---

## Pré-requisitos no outro PC

| Ferramenta | Versão mínima | Para quê |
|---|---|---|
| **Java JDK** | 17+ | Compilar/rodar backend |
| **Maven** | 3.8+ | Build do backend |
| **Node.js** | 18+ | Build do frontend |
| **npm** | 9+ | Dependências do frontend |
| **Docker + Docker Compose** | 24+ | PostgreSQL local |
| **Git** | qualquer | Controle de versão |

---

## ETAPA 1 — Subir o banco de dados local

```bash
# Na raiz do projeto (onde está docker-compose.yml)
docker compose up -d
```

Isso cria o PostgreSQL em `localhost:5432` com:
- DB: `smedb` | User: `postgres` | Password: `postgres`

Verificar se subiu:
```bash
docker compose ps
```

---

## ETAPA 2 — Build e execução do Backend

```bash
cd backend

# Instalar dependências e compilar
mvn clean package -DskipTests

# Rodar (vai conectar no Postgres do Docker)
mvn spring-boot:run
```

O backend sobe em **http://localhost:8080**.

### Teste rápido da API:
```bash
# Listar instituições (rota pública)
curl http://localhost:8080/api/instituicoes

# Login com usuário seed
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"professor@demo.com","senha":"123456"}'
```

Se o login retornar um JSON com `token`, `role`, `userId`, `nome`, `email` → backend OK.

### Usuários seed (criados automaticamente pelo DataInitializer):

| Email | Senha | Role |
|---|---|---|
| `professor@demo.com` | `123456` | PROFESSOR |
| `aluno@demo.com` | `123456` | ALUNO |
| `empresa@demo.com` | `123456` | EMPRESA |

---

## ETAPA 3 — Build e execução do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Build de produção (validar que compila sem erro)
npm run build

# Rodar em dev
npm run dev
```

O frontend sobe em **http://localhost:5173**.

### Teste rápido:
1. Acesse http://localhost:5173
2. Clique em "Entrar"
3. Use `professor@demo.com` / `123456`
4. Deve redirecionar para o Dashboard do Professor

---

## ETAPA 4 — Testes manuais de funcionalidades

### 4.1 — Login e Dashboard
- [ ] Login como PROFESSOR → Dashboard Professor (saldo, botão enviar moedas)
- [ ] Login como ALUNO → Dashboard Aluno (saldo, vantagens, extrato)
- [ ] Login como EMPRESA → Dashboard Empresa (vantagens cadastradas)
- [ ] Logout funciona e redireciona

### 4.2 — CRUD Alunos
- [ ] Cadastrar novo aluno (rota pública, sem login)
- [ ] Listar alunos (logado)
- [ ] Editar aluno
- [ ] Remover aluno

### 4.3 — CRUD Empresas
- [ ] Cadastrar nova empresa (rota pública)
- [ ] Listar empresas (logado)
- [ ] Editar empresa
- [ ] Remover empresa

### 4.4 — CRUD Professores
- [ ] Listar professores
- [ ] Cadastrar professor
- [ ] Editar professor
- [ ] Remover professor
- [ ] Upload CSV (usar arquivo `template_professores.csv` na raiz)

### 4.5 — CRUD Instituições
- [ ] Listar (3 seeds devem aparecer)
- [ ] Cadastrar nova
- [ ] Editar
- [ ] Remover

### 4.6 — Vantagens
- [ ] Login como EMPRESA → Cadastrar vantagem (descrição, foto URL, custo)
- [ ] Vitrine pública: listar vantagens

### 4.7 — Envio de Moedas (PROFESSOR)
- [ ] Login como professor → "Enviar Moedas"
- [ ] Selecionar aluno, valor, motivo → enviar
- [ ] Verificar: saldo professor diminuiu, saldo aluno aumentou
- [ ] Extrato do professor mostra o envio
- [ ] Extrato do aluno mostra o recebimento

### 4.8 — Resgate de Vantagem (ALUNO)
- [ ] Login como aluno (após receber moedas)
- [ ] Ir em Vantagens → clicar "Resgatar"
- [ ] Verificar: saldo diminuiu, cupom retornado na resposta
- [ ] Extrato mostra a transação de resgate

---

## ETAPA 5 — Deploy no Railway (Backend + PostgreSQL)

### 5.1 — Criar conta e projeto
1. Acesse https://railway.app e faça login com GitHub
2. Crie um **New Project**

### 5.2 — Adicionar PostgreSQL
1. No projeto, clique **+ New** → **Database** → **PostgreSQL**
2. Railway cria o banco automaticamente e injeta as variáveis:
   `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

### 5.3 — Deploy do Backend
1. No projeto, clique **+ New** → **GitHub Repo** → selecione o repositório
2. Nas configurações do serviço:
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
3. Adicione as **variáveis de ambiente**:

| Variável | Valor |
|---|---|
| `PORT` | `8080` |
| `JWT_SECRET` | (gere uma string aleatória de 64+ chars) |
| `JWT_EXPIRATION` | `86400000` |
| `MAIL_ENABLED` | `false` |

> As variáveis `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` são injetadas automaticamente quando você linka o PostgreSQL ao serviço.

4. Clique em **Deploy** e aguarde o build

### 5.4 — Verificar
```bash
# Substitua pela URL do Railway
curl https://SEU-SERVICO.up.railway.app/api/instituicoes
```

---

## ETAPA 6 — Deploy do Frontend (Vercel)

### 6.1 — Criar conta e importar
1. Acesse https://vercel.com e faça login com GitHub
2. Clique **Add New** → **Project** → selecione o repositório

### 6.2 — Configurar
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 6.3 — Variável de ambiente
| Variável | Valor |
|---|---|
| `VITE_API_URL` | `https://SEU-SERVICO.up.railway.app/api` |

> ⚠️ Use a URL real do backend no Railway (sem barra final).

### 6.4 — Deploy
Clique **Deploy**. Após concluir, acesse a URL gerada pelo Vercel.

### 6.5 — CORS
Se der erro de CORS, o backend já tem `CorsConfig.java` configurado.
Pode ser necessário adicionar a URL do Vercel nas origens permitidas.
Verifique o arquivo `backend/src/main/java/com/sme/config/CorsConfig.java` e, se necessário, adicione:
```java
.allowedOrigins("https://SEU-FRONTEND.vercel.app")
```

---

## ETAPA 7 — (Opcional) Fase 6: Testes automatizados

Não existem testes automatizados ainda. Para criar:

### 7.1 — Backend: testes unitários com JUnit 5
Criar em `backend/src/test/java/com/sme/service/`:

- `MoedaServiceTest.java` — testar envio de moedas (saldo insuficiente, envio válido)
- `ResgateServiceTest.java` — testar resgate (saldo insuficiente, resgate válido)
- `AuthServiceTest.java` — testar login com credenciais válidas/inválidas

```bash
cd backend
mvn test
```

### 7.2 — Frontend: testes com Vitest (opcional)
```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
# Adicionar em vite.config.js: test: { environment: 'jsdom' }
npx vitest run
```

---

## Resumo de Status

| Fase | Status | O que fazer no outro PC |
|---|---|---|
| 1 — Infra + Railway config | ✅ Código pronto | Subir Docker, buildar |
| 2 — Auth JWT | ✅ Código pronto | Testar login |
| 3 — CRUDs (Prof/Vant/Inst) | ✅ Código pronto | Testar CRUD completo |
| 4 — Business Logic | ✅ Código pronto | Testar envio/resgate |
| 5 — Frontend completo | ✅ Código pronto | `npm install` + `npm run build` |
| 6 — Testes | ❌ Não criados | Opcional |
| Deploy Backend | ❌ Pendente | Railway (etapa 5) |
| Deploy Frontend | ❌ Pendente | Vercel (etapa 6) |

---

## Arquivos-chave de configuração

| Arquivo | Função |
|---|---|
| `docker-compose.yml` | PostgreSQL local |
| `backend/Procfile` | Comando de start Railway |
| `backend/system.properties` | Java 17 para Railway |
| `backend/src/main/resources/application.properties` | Configs com env vars |
| `backend/pom.xml` | Dependências Maven |
| `frontend/package.json` | Dependências npm |
| `frontend/src/services/api.js` | Base URL da API (usa `VITE_API_URL`) |

---

## Troubleshooting

| Problema | Solução |
|---|---|
| Backend não conecta no Postgres | Verificar se Docker está rodando: `docker compose ps` |
| Frontend dá 401 em todas as rotas | Token expirado — faça login novamente |
| CORS bloqueado | Adicionar origem do frontend em `CorsConfig.java` |
| Railway build falha | Verificar se `Root Directory` está como `backend` |
| Variáveis PG não injetadas no Railway | Linkar o serviço PostgreSQL ao serviço do backend |
| Email não envia | Normal — `MAIL_ENABLED=false` por padrão (logs no console) |
