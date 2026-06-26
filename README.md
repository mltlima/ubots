# FlowPay — Sistema de Distribuição de Atendimentos

Sistema de distribuição automática de atendimentos para fintech, desenvolvido como desafio técnico.

O FlowPay distribui atendimentos entre times especializados (Cartões, Empréstimos e Outros Assuntos), respeitando regras de capacidade por atendente e fila FIFO com promoção automática.

---

## Tecnologias

| Camada | Tecnologias |
|--------|------------|
| **Backend** | Node.js, Express, TypeScript |
| **Frontend** | React, Vite, TypeScript |
| **Testes** | Vitest, Supertest |

---

## Requisitos

- Node.js **≥ 18**
- npm (gerenciador de pacotes padrão do Node)

---

## Como Executar

### Backend

```bash
cd backend
npm install
npm run dev
```

O servidor estará rodando na porta **3001**.
Valide acessando: [http://localhost:3001/health](http://localhost:3001/health)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface estará disponível em: [http://localhost:5173](http://localhost:5173)

---

## Testes

### Executar testes automatizados

```bash
cd backend
npm test
```

### Verificação de tipos (backend)

```bash
cd backend
npm run typecheck
```

### Verificação de tipos e build (frontend)

```bash
cd frontend
npx tsc --noEmit
npm run build
```

---

## Dados de Demonstração (Seed)

Como os dados ficam em memória, o dashboard abre vazio quando o projeto é iniciado. Para popular dados de demonstração:

```bash
cd backend
npm run seed
```

O seed cria **22 atendimentos** distribuídos entre os três times, finaliza 1 atendimento para demonstrar o contador de finalizados e a promoção automática da fila.

> **Importante:**
> - O seed é **opcional**. O backend funciona normalmente sem ele.
> - O seed **não é idempotente**. Se executado mais de uma vez, os atendimentos serão acumulados.
> - Como os dados ficam em memória, se quiser rodar o seed novamente a partir de um estado vazio, basta **reiniciar o backend** antes.
> - O backend deve estar rodando antes de executar o seed.

---

## Endpoints Principais

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check do servidor |
| `POST` | `/attendances` | Cria um novo atendimento |
| `POST` | `/attendances/:id/finish` | Finaliza um atendimento ativo |
| `GET` | `/teams` | Retorna times, agentes e atendimentos ativos/fila |
| `GET` | `/dashboard` | Retorna resumo geral (contadores por time) |

### Exemplos

**Criar atendimento:**
```bash
curl -X POST http://localhost:3001/attendances \
  -H "Content-Type: application/json" \
  -d '{"customerName": "João", "subject": "Problemas com cartão"}'
```

**Finalizar atendimento:**
```bash
curl -X POST http://localhost:3001/attendances/{id}/finish
```

---

## Regras de Negócio

1. **Roteamento por assunto:**
   - `Problemas com cartão` → Time Cartões
   - `Contratação de empréstimo` → Time Empréstimos
   - Qualquer outro assunto → Time Outros Assuntos (time padrão)

2. **Limite de capacidade:** cada atendente pode ter no máximo **3 atendimentos ativos** simultaneamente.

3. **Fila FIFO:** quando todos os atendentes de um time estão na capacidade máxima, o atendimento entra em fila e aguarda na ordem de chegada.

4. **Promoção automática:** ao finalizar um atendimento, o primeiro da fila do mesmo time é automaticamente promovido para ativo e atribuído ao atendente que ficou disponível.

---

## Arquitetura do Backend

```
backend/src/
├── index.ts              # Inicialização do servidor
├── app.ts                # Configuração do Express (CORS, rotas)
├── types.ts              # Interfaces e enums
├── data/
│   └── initialData.ts    # Times e agentes (dados fixos)
├── services/
│   └── attendanceService.ts  # Regras de negócio
├── controllers/
│   └── attendanceController.ts  # Handlers HTTP
├── routes/
│   └── index.ts          # Definição de rotas
└── __tests__/
    ├── attendanceService.test.ts   # Testes de regra de negócio
    └── attendanceEndpoints.test.ts # Testes HTTP
```

Separação em camadas **service / controller / routes** para isolar a lógica de negócio do transporte HTTP, facilitando testes e manutenção.

---

## Decisões Técnicas

| Decisão | Justificativa |
|---------|---------------|
| **Dados em memória** | Simplicidade para o escopo do desafio. Sem necessidade de configurar banco de dados. |
| **Polling de 3 segundos** | Solução simples e funcional para atualizar o dashboard. WebSocket seria mais eficiente, mas adicionaria complexidade desnecessária para o escopo. |
| **Separação service/controller/routes** | Isola lógica de negócio, facilita testes unitários e mantém o código organizado. |
| **Testes focados na distribuição** | Os testes cobrem a regra de distribuição (roteamento, capacidade, fila, promoção), que é o core do sistema. |
| **Seed opcional** | Facilita a avaliação sem alterar o comportamento padrão do sistema. |

---

## Limitações Assumidas

- **Sem persistência:** dados são perdidos ao reiniciar o backend (adequado para o escopo do desafio).
- **Sem autenticação:** não há controle de acesso.
- **Sem WebSocket:** atualizações do dashboard são feitas via polling.
- **Sem deploy:** o projeto roda apenas localmente.
- **Times e atendentes fixos:** não há CRUD de times ou atendentes.

---

## Estrutura do Projeto

```
FlowPay/
├── README.md
├── .gitignore
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── scripts/
│   │   └── seedDemoData.ts
│   └── src/
│       ├── index.ts
│       ├── app.ts
│       ├── types.ts
│       ├── data/
│       ├── services/
│       ├── controllers/
│       ├── routes/
│       └── __tests__/
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── components/
        ├── hooks/
        ├── pages/
        ├── services/
        └── types/
```
