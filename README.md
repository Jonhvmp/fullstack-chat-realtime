# Documentação do Sistema de Chat em Tempo Real

**Desenvolvedor:** [**Jonh Alex**](https://www.linkedin.com/in/jonhvmp/)
**Tecnologias Utilizadas:** Node.js, Express, MongoDB, Socket.IO, Next.js, TailwindCSS, shadcn, TypeScript

---

## Sumário

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Principais Tecnologias](#principais-tecnologias)
4. [Pré-requisitos](#pré-requisitos)
5. [Configuração do Ambiente](#configuração-do-ambiente)
6. [Instalação e Execução](#instalação-e-execução)
7. [Swagger - Documentação de Rotas](#swagger---documentação-de-rotas)
8. [Rotas Principais](#rotas-principais)
   - [Auth](#auth)
   - [Users](#users)
   - [Chat](#chat)
   - [Messages](#messages)
9. [Real-Time com Socket.IO](#real-time-com-socketio)
10. [Estrutura de Pastas (Exemplo)](#estrutura-de-pastas-exemplo)
11. [Boas Práticas e Contribuição](#boas-práticas-e-contribuição)

---

## Visão Geral do Projeto

Este projeto é um sistema de **chat em tempo real** que permite a comunicação instantânea entre usuários. Há dois principais componentes:

- **Backend**: Responsável pela lógica de negócio, autenticação, conexão ao banco de dados (MongoDB), e integração com Socket.IO para mensagens em tempo real.
- **Frontend**: Desenvolvido em Next.js, utiliza TailwindCSS e shadcn para a camada de UI/UX, consumindo a API do backend e mantendo o estado dos chats e das mensagens em tempo real.

O sistema foi desenvolvido em **TypeScript** para ambos os lados (frontend e backend), garantindo maior segurança de tipos e facilitando a manutenção do código.

---

## Arquitetura do Sistema

A arquitetura segue o padrão de **Cliente-Servidor**:

- **Cliente (Frontend)**
  - Construído em Next.js (React) com TailwindCSS e shadcn.
  - Consumindo a API do backend via chamadas HTTP (REST) e se comunicando em tempo real através de Socket.IO.

- **Servidor (Backend)**
  - Construído em Node.js com Express.
  - Integrações:
    - **MongoDB** para persistência de dados.
    - **Socket.IO** para recursos de comunicação em tempo real.
    - **Passport** (com diferentes estratégias de autenticação, incluindo GitHub).
    - **Swagger** para documentação das rotas.

---

## Principais Tecnologias

- **Node.js (Express)**: Para criar a API e gerenciar as rotas do backend.
- **MongoDB**: Banco de dados NoSQL para armazenamento de usuários, chats e mensagens.
- **Socket.IO**: Protocolo de comunicação em tempo real, garantindo que as mensagens sejam entregues instantaneamente.
- **Next.js**: Framework React que facilita SSR (Server-Side Rendering), rotas e otimizações de desempenho para o frontend.
- **TailwindCSS** + **shadcn**: Biblioteca de componentes e estilos para agilizar o desenvolvimento do layout.
- **TypeScript**: Tipagem estática para aumentar a confiabilidade do código.
- **Swagger**: Documentação de endpoints REST, facilitando a manutenção e uso por outros desenvolvedores/serviços.

---

## Pré-requisitos

Para executar o projeto localmente, é necessário ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/) (gerenciador de pacotes)
- [MongoDB](https://www.mongodb.com/) (local ou em nuvem)

---

## Configuração do Ambiente

1. **Clonar o repositório** (ou baixar os fontes) em sua máquina local.

2. **Variáveis de Ambiente**
   Na raiz de cada parte do sistema (backend e frontend), normalmente há um arquivo `.env` (ou `.env.local` no caso do frontend). Exemplo de variáveis que podem ser necessárias:

   **Backend (`.env`):**
   ```
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/nomedobanco
   JWT_SECRET=sua_chave_jwt
   GITHUB_CLIENT_ID=sua_github_client_id
   GITHUB_CLIENT_SECRET=sua_github_client_secret
   COOKIE_SECRET=sua_cookie_secret
   ```
   **Frontend (`.env.local`):**
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```

   Ajuste de acordo com seu ambiente de desenvolvimento ou produção.

---

## Instalação e Execução

### Backend

1. Acesse a pasta do **backend**:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```
3. Execute a aplicação:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
4. O servidor estará disponível em `http://localhost:3001` (se configurado para rodar na porta 3001).

### Frontend

1. Acesse a pasta do **frontend**:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```
3. Execute a aplicação:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
4. O frontend ficará disponível em `http://localhost:3000` (porta padrão do Next.js).

**Obs.:** Certifique-se de que o **backend** esteja em execução antes de iniciar o **frontend**, pois ele depende da API para funcionar corretamente.

---

## Swagger - Documentação de Rotas

O projeto utiliza o [Swagger](https://swagger.io/) para documentar as rotas do backend. Assim que o servidor estiver rodando, você pode acessar algo como:

```
http://localhost:3001/api-docs
```

Ou o caminho configurado internamente (pode variar conforme sua configuração). Lá estarão descritos todos os endpoints, parâmetros de entrada, respostas etc.

---

## Rotas Principais

A seguir, um resumo das rotas, conforme definidas nos arquivos de rotas. Para detalhes completos, consulte o Swagger.

### Auth

Local: `auth.routes.ts`

- **POST /api/auth/register**
  Registra um novo usuário e retorna um token de sessão via cookie.

- **POST /api/auth/login**
  Realiza login do usuário e retorna um token de sessão via cookie.

- **POST /api/auth/logout**
  Realiza logout do usuário, limpando o cookie de autenticação.

- **GET /api/auth/github** e **GET /api/auth/github/callback**
  Fluxo de autenticação com GitHub (OAuth).

- **GET /api/auth/validate-token**
  Verifica se o token de sessão (cookie) ainda é válido, retornando os dados do usuário.

- **POST /api/auth/enable-2fa** / **POST /api/auth/verify-2fa** / **POST /api/auth/disable-2fa**
  Rotas para habilitar, verificar e desabilitar a autenticação de dois fatores (2FA).

### Users

Local: `user.routes.ts`

- **GET /user**
  Retorna todos os usuários do sistema.

- **GET /user/find/:id**
  Retorna um usuário específico pelo ID.

- **POST /user/list**
  Retorna vários usuários a partir de uma lista de IDs ou critério específico (depende da implementação).

- **PATCH /user/update**
  Atualiza dados (nome e email) do usuário logado.

### Chat

Local: `chat.routes.ts`

- **POST /chat**
  Cria um novo chat entre dois usuários.

- **GET /chat/users/:userId**
  Retorna todos os chats em que determinado usuário participa.

- **GET /chat/:chatId**
  Retorna detalhes de um chat específico.

### Messages

Local: `message.routes.ts`

- **POST /message**
  Cria uma nova mensagem em um chat.

- **GET /message/:chatId**
  Retorna todas as mensagens de um determinado chat.

- **POST /message/:chatId/read**
  Marca as mensagens de um chat como lidas por um usuário específico.

- **GET /message/:chatId/unread/:userId**
  Retorna a contagem de mensagens não lidas de um usuário em um chat.

---

## Real-Time com Socket.IO

Além das rotas REST, o sistema utiliza **Socket.IO** no backend e no frontend para envio e recebimento de mensagens em tempo real. O fluxo típico:

1. Usuário A envia mensagem -> **Socket.IO** (backend) -> repassa aos membros do chat.
2. Usuário B recebe mensagem instantaneamente sem precisar atualizar a página.

### Eventos Comuns

- `connection` / `disconnect`
- `join` (entrar em uma sala de chat)
- `message` (novo envio de mensagem)
- `typing` (usuário está digitando)
- `read` (mensagens lidas)

A implementação exata pode variar conforme a configuração no **ChatController** ou **MessageController**.

---

## Estrutura de Pastas (Exemplo)

A estrutura de pastas pode variar conforme sua organização. Segue um exemplo genérico:

```
.
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   └── message.routes.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend
│   ├── components
│   ├── pages
│   ├── public
│   ├── styles
│   ├── package.json
│   └── tsconfig.json
└── ...
```

---

## Boas Práticas e Contribuição

- **Commits claros**: Use mensagens de commit que expliquem **o que** e **por que** das alterações.
- **Padrões de Código**: Mantenha o estilo de código consistente (lint, prettier, etc.).
- **Pull Requests**: Antes de abrir um PR, sincronize sua branch com a principal, descreva bem as mudanças e forneça evidências de testes.
- **Teste**: Se possível, inclua testes unitários e/ou testes de integração para garantir a estabilidade do sistema.
- **Segurança**: Nunca exponha informações sensíveis (como chaves secretas) em commits. Sempre use variáveis de ambiente seguras.

---

**Desenvolvido por:** [**Jonh Alex**](https://www.linkedin.com/in/jonhvmp/)

Caso tenha dúvidas, entre em contato ou crie uma *issue* no repositório oficial do projeto. Obrigado por utilizar o sistema de chat em tempo real!
