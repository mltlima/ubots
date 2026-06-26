# FlowPay — Sistema de Distribuição e Monitoramento de Atendimentos

Este é o repositório do desafio técnico FlowPay, estruturado em uma arquitetura Full Stack (Frontend + Backend).

## Phase 1 — Setup Inicial e Health Check

O objetivo desta fase é estabelecer a estrutura inicial do projeto e validar a comunicação básica entre o Frontend e o Backend através de um endpoint simples de health check.

### Estrutura de Pastas

* `/backend` — API desenvolvida com Node.js, Express e TypeScript.
* `/frontend` — Interface web desenvolvida com React, Vite e TypeScript.

---

## Como Executar o Projeto

### Pré-requisitos
* Node.js (versão 18 ou superior)
* npm (gerenciador de pacotes padrão do Node)

### 1. Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O servidor estará rodando na porta **3001**. Você pode validar acessando [http://localhost:3001/health](http://localhost:3001/health) no navegador.

---

### 2. Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor do Vite:
   ```bash
   npm run dev
   ```
   A interface estará disponível em [http://localhost:5173](http://localhost:5173).

---

## Validação de Comunicação

Quando ambas as partes estiverem rodando:
* Acesse o frontend ([http://localhost:5173](http://localhost:5173)).
* A página fará uma chamada ao endpoint `/health` do backend e exibirá:
  * **API Online ✅** (se o backend estiver rodando)
  * **API Offline ❌** (se o backend estiver parado ou com erro de conexão)
