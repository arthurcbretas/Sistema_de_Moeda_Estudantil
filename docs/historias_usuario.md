# Histórias do Usuário — Sistema de Moeda Estudantil

## Visão Geral

As histórias de usuário estão organizadas por ator (Aluno, Professor, Empresa Parceira e Sistema) e seguem o formato padrão:

> **Como** [ator], **eu quero** [ação], **para que** [benefício].

Cada história possui critérios de aceitação e prioridade definidos.

---

## 📊 Resumo das Histórias

| ID | Ator | Título | Prioridade |
|---|---|---|---|
| US01 | Aluno | Cadastro no sistema | Alta |
| US02 | Aluno | Login no sistema | Alta |
| US03 | Aluno | Consultar extrato | Alta |
| US04 | Aluno | Resgatar vantagem | Alta |
| US05 | Aluno | Visualizar vantagens disponíveis | Média |
| US06 | Professor | Login no sistema | Alta |
| US07 | Professor | Enviar moedas a um aluno | Alta |
| US08 | Professor | Consultar extrato | Alta |
| US09 | Empresa Parceira | Cadastro no sistema | Alta |
| US10 | Empresa Parceira | Login no sistema | Alta |
| US11 | Empresa Parceira | Cadastrar vantagem | Alta |
| US12 | Empresa Parceira | Gerenciar vantagens | Média |
| US13 | Sistema | Notificar aluno por email | Alta |
| US14 | Sistema | Enviar cupom por email | Alta |
| US15 | Sistema | Distribuir moedas semestralmente | Alta |

---

## 👨‍🎓 Histórias do Aluno

### US01 — Cadastro no Sistema
> **Como** aluno, **eu quero** me cadastrar no sistema informando meus dados pessoais e selecionando minha instituição de ensino, **para que** eu possa participar do programa de moeda estudantil e receber moedas de reconhecimento.

**Critérios de Aceitação:**
- [ ] O formulário de cadastro exige: nome, email, CPF, RG, endereço, instituição de ensino e curso.
- [ ] A instituição de ensino é selecionada de uma lista pré-cadastrada (dropdown).
- [ ] O sistema valida que o CPF e o email são únicos (não existem no banco).
- [ ] O sistema exige uma senha com no mínimo 6 caracteres.
- [ ] Após o cadastro bem-sucedido, o aluno é criado com saldo de 0 moedas.
- [ ] O sistema exibe uma mensagem de confirmação após o cadastro.
- [ ] Em caso de dados inválidos ou duplicados, o sistema exibe mensagem de erro clara.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC01, UC10

---

### US02 — Login no Sistema
> **Como** aluno, **eu quero** fazer login com meu email e senha, **para que** eu possa acessar meu painel com saldo e funcionalidades exclusivas.

**Critérios de Aceitação:**
- [ ] O formulário de login solicita email e senha.
- [ ] O sistema autentica as credenciais contra o banco de dados.
- [ ] Em caso de sucesso, o aluno é redirecionado para seu dashboard.
- [ ] Em caso de falha, uma mensagem de erro é exibida (sem revelar qual campo está incorreto).
- [ ] O sistema gera um token JWT para sessões subsequentes.
- [ ] O token é enviado nas requisições seguintes via header `Authorization`.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC03

---

### US03 — Consultar Extrato
> **Como** aluno, **eu quero** consultar meu extrato de moedas, **para que** eu possa visualizar meu saldo atual e o histórico de todas as transações (recebimentos e resgates).

**Critérios de Aceitação:**
- [ ] O aluno visualiza seu saldo atual de moedas em destaque.
- [ ] O extrato lista todas as transações em ordem cronológica (mais recente primeiro).
- [ ] Cada transação exibe: data, valor, tipo (recebimento/resgate) e motivo/descrição.
- [ ] Transações de recebimento exibem o nome do professor remetente.
- [ ] Transações de resgate exibem o nome da vantagem resgatada.
- [ ] O extrato é acessível apenas para o aluno autenticado (seus próprios dados).

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC05

---

### US04 — Resgatar Vantagem
> **Como** aluno, **eu quero** resgatar uma vantagem utilizando minhas moedas acumuladas, **para que** eu possa obter descontos e benefícios em empresas parceiras.

**Critérios de Aceitação:**
- [ ] O aluno visualiza a lista de vantagens disponíveis com descrição, foto e custo.
- [ ] O aluno pode selecionar uma vantagem e clicar em "Resgatar".
- [ ] O sistema verifica se o saldo do aluno é suficiente (saldo >= custo).
- [ ] Em caso de saldo insuficiente, o sistema exibe mensagem de erro e impede o resgate.
- [ ] Em caso de sucesso:
  - O valor é descontado do saldo do aluno.
  - Um cupom com código único é gerado.
  - A transação de resgate é registrada.
  - Um email com o cupom é enviado ao aluno.
  - Um email com o cupom é enviado à empresa parceira.
- [ ] O cupom é exibido na tela imediatamente após o resgate.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC07, UC08

---

### US05 — Visualizar Vantagens Disponíveis
> **Como** aluno, **eu quero** visualizar todas as vantagens disponíveis no sistema, **para que** eu possa escolher como utilizar minhas moedas.

**Critérios de Aceitação:**
- [ ] As vantagens são exibidas em formato de cards com: foto, descrição, custo em moedas e nome da empresa.
- [ ] O aluno pode ver detalhes de uma vantagem ao clicar nela.
- [ ] As vantagens são ordenadas por custo (menor para maior) por padrão.
- [ ] O saldo atual do aluno é exibido para referência.

**Prioridade:** Média  
**Caso de Uso Relacionado:** UC07

---

## 👨‍🏫 Histórias do Professor

### US06 — Login no Sistema
> **Como** professor, **eu quero** fazer login no sistema com minhas credenciais pré-cadastradas, **para que** eu possa acessar meu painel e distribuir moedas.

**Critérios de Aceitação:**
- [ ] O professor utiliza email e senha para autenticação (conta pré-cadastrada pela instituição).
- [ ] Em caso de sucesso, é redirecionado para o dashboard do professor.
- [ ] O dashboard exibe o saldo atual de moedas disponíveis.
- [ ] Em caso de falha, uma mensagem de erro é exibida.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC03

---

### US07 — Enviar Moedas a um Aluno
> **Como** professor, **eu quero** enviar moedas a um aluno informando o valor e o motivo do reconhecimento, **para que** eu possa premiar bom comportamento e participação em aula.

**Critérios de Aceitação:**
- [ ] O formulário de envio solicita: aluno destinatário (seleção por nome/email), quantidade de moedas e motivo (campo de texto obrigatório).
- [ ] O sistema valida que o professor possui saldo suficiente.
- [ ] O sistema valida que o motivo foi preenchido (campo obrigatório).
- [ ] O sistema valida que a quantidade de moedas é maior que zero.
- [ ] Em caso de sucesso:
  - O valor é debitado do saldo do professor.
  - O valor é creditado ao saldo do aluno.
  - A transação é registrada para ambos (envio e recebimento).
  - Um email de notificação é enviado ao aluno.
- [ ] Em caso de saldo insuficiente, o sistema exibe erro e impede o envio.
- [ ] Uma mensagem de confirmação é exibida após o envio bem-sucedido.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC04, UC08

---

### US08 — Consultar Extrato
> **Como** professor, **eu quero** consultar meu extrato de moedas, **para que** eu possa acompanhar meu saldo disponível e o histórico de envios realizados.

**Critérios de Aceitação:**
- [ ] O professor visualiza seu saldo atual de moedas em destaque.
- [ ] O extrato lista todas as transações de envio em ordem cronológica.
- [ ] Cada transação exibe: data, valor, nome do aluno destinatário e motivo.
- [ ] O extrato inclui registros de recarga semestral com a data e o semestre.
- [ ] O extrato é acessível apenas para o professor autenticado.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC05

---

## 🏢 Histórias da Empresa Parceira

### US09 — Cadastro no Sistema
> **Como** empresa parceira, **eu quero** me cadastrar no sistema informando meus dados empresariais, **para que** eu possa oferecer vantagens aos alunos em troca de moedas.

**Critérios de Aceitação:**
- [ ] O formulário de cadastro exige: nome da empresa, CNPJ, email e senha.
- [ ] O sistema valida que o CNPJ e o email são únicos.
- [ ] O sistema valida o formato do CNPJ.
- [ ] Após o cadastro, a empresa pode começar a cadastrar vantagens.
- [ ] O sistema exibe confirmação de cadastro bem-sucedido.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC02

---

### US10 — Login no Sistema
> **Como** empresa parceira, **eu quero** fazer login no sistema com meu email e senha, **para que** eu possa gerenciar as vantagens que ofereço.

**Critérios de Aceitação:**
- [ ] O formulário de login solicita email e senha.
- [ ] Em caso de sucesso, a empresa é redirecionada para seu dashboard.
- [ ] O dashboard exibe as vantagens cadastradas pela empresa.
- [ ] Em caso de falha, uma mensagem de erro é exibida.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC03

---

### US11 — Cadastrar Vantagem
> **Como** empresa parceira, **eu quero** cadastrar novas vantagens com descrição, foto e custo em moedas, **para que** os alunos possam visualizá-las e resgatá-las.

**Critérios de Aceitação:**
- [ ] O formulário de cadastro exige: descrição, foto (upload de imagem) e custo em moedas.
- [ ] O custo deve ser um valor maior que zero.
- [ ] A foto do produto é obrigatória.
- [ ] A vantagem fica imediatamente disponível para os alunos após o cadastro.
- [ ] O sistema exibe confirmação de cadastro da vantagem.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC06

---

### US12 — Gerenciar Vantagens
> **Como** empresa parceira, **eu quero** editar ou remover as vantagens que cadastrei, **para que** eu possa manter a oferta atualizada.

**Critérios de Aceitação:**
- [ ] A empresa visualiza a lista de suas vantagens cadastradas.
- [ ] A empresa pode editar descrição, foto e custo de uma vantagem existente.
- [ ] A empresa pode remover uma vantagem (desde que não tenha cupons GERADOS pendentes).
- [ ] As alterações são salvas imediatamente.
- [ ] O sistema exibe confirmação após edição ou remoção.

**Prioridade:** Média  
**Caso de Uso Relacionado:** UC09

---

## ⚙️ Histórias do Sistema

### US13 — Notificar Aluno por Email ao Receber Moedas
> **Como** sistema, **eu quero** enviar um email de notificação ao aluno quando ele receber moedas de um professor, **para que** o aluno saiba que foi reconhecido.

**Critérios de Aceitação:**
- [ ] O email é enviado automaticamente após o professor concluir o envio de moedas.
- [ ] O email contém: nome do professor, quantidade de moedas recebidas e motivo do reconhecimento.
- [ ] O email é enviado para o endereço cadastrado do aluno.
- [ ] A falha no envio do email não impede a conclusão da transação.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC08

---

### US14 — Enviar Cupom de Resgate por Email
> **Como** sistema, **eu quero** enviar emails com o cupom de resgate ao aluno e à empresa parceira, **para que** ambos possam conferir a troca presencialmente.

**Critérios de Aceitação:**
- [ ] Ao resgatar uma vantagem, dois emails são gerados:
  - Email para o aluno: contém o código do cupom, descrição da vantagem e instruções de uso.
  - Email para a empresa: contém o código do cupom, nome do aluno e descrição da vantagem.
- [ ] O código do cupom é o mesmo em ambos os emails.
- [ ] O código é alfanumérico e único (gerado pelo sistema).
- [ ] A falha no envio do email não impede a conclusão do resgate.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC08

---

### US15 — Distribuir Moedas Semestralmente
> **Como** sistema, **eu quero** adicionar automaticamente 1.000 moedas ao saldo de cada professor a cada início de semestre, **para que** os professores possam distribuir moedas aos alunos ao longo do período.

**Critérios de Aceitação:**
- [ ] O sistema executa um job programado no início de cada semestre.
- [ ] Cada professor ativo recebe o acréscimo de 1.000 moedas.
- [ ] O saldo é **acumulável**: moedas não distribuídas do semestre anterior são mantidas.
- [ ] O sistema registra o semestre da última recarga para evitar crédito duplicado.
- [ ] Uma transação do tipo `RECARGA_SEMESTRAL` é registrada para cada professor.
- [ ] O sistema armazena o semestre da última recarga (ex: "2026/1") no campo `ultimaRecargaSemestre`.

**Prioridade:** Alta  
**Caso de Uso Relacionado:** UC11

---

## Mapeamento Histórias × Casos de Uso

| História | Caso de Uso |
|---|---|
| US01 | UC01, UC10 |
| US02 | UC03 |
| US03 | UC05 |
| US04 | UC07, UC08 |
| US05 | UC07 |
| US06 | UC03 |
| US07 | UC04, UC08 |
| US08 | UC05 |
| US09 | UC02 |
| US10 | UC03 |
| US11 | UC06 |
| US12 | UC09 |
| US13 | UC08 |
| US14 | UC08 |
| US15 | UC11 |
