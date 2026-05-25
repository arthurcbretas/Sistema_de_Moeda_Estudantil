# Diagrama de Sequência: Resgate de Vantagem

```mermaid
sequenceDiagram
    actor A as Aluno
    participant F as Frontend
    participant C as ResgateController
    participant S as ResgateService
    participant R_Aluno as AlunoRepository
    participant R_Vant as VantagemRepository
    participant R_Resg as ResgateRepository
    participant DB as Database
    participant M as MailSender

    A->>F: Seleciona vantagem e clica em Resgatar
    F->>C: POST /api/resgates
    C->>S: resgatarVantagem(alunoId, vantagemId)
    
    S->>R_Vant: findById(vantagemId)
    R_Vant->>DB: SELECT * FROM vantagens WHERE id = ?
    DB-->>R_Vant: Dados da vantagem
    R_Vant-->>S: Entidade Vantagem
    
    S->>R_Aluno: findById(alunoId)
    R_Aluno->>DB: SELECT * FROM alunos WHERE id = ?
    DB-->>R_Aluno: Dados do aluno
    R_Aluno-->>S: Entidade Aluno
    
    S->>S: Verifica saldo do Aluno >= custo da Vantagem
    alt Saldo Insuficiente
        S-->>C: Lança Exceção (Saldo Insuficiente)
        C-->>F: 400 Bad Request
        F-->>A: Exibe erro de saldo insuficiente
    else Saldo Suficiente
        S->>DB: BEGIN TRANSACTION
        S->>S: Atualiza saldo do Aluno (saldo - custo)
        S->>R_Aluno: save(alunoAtualizado)
        R_Aluno->>DB: UPDATE alunos SET saldo = ?
        
        S->>R_Resg: save(novoResgate)
        R_Resg->>DB: INSERT INTO resgates (aluno_id, vantagem_id, codigo_resgate, ...)
        DB-->>R_Resg: Sucesso
        R_Resg-->>S: Resgate salvo (com código gerado)
        S->>DB: COMMIT
        
        S->>M: sendEmailCupom(aluno.email, vantagem.nome, codigoResgate)
        M-->>S: Email enviado
        
        S->>M: sendEmailEmpresa(empresa.email, aluno.nome, vantagem.nome, codigoResgate)
        M-->>S: Email enviado
        
        S-->>C: Retorna Recibo de Resgate (com código)
        C-->>F: 200 OK
        F-->>A: Exibe mensagem de sucesso e código de resgate
    end
```
