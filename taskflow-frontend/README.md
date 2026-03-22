# TaskFlow Frontend

Interface web desenvolvida com **Angular 17** e **Angular Material**, consumindo a API REST do TaskFlow.

---

## Tecnologias

- Angular 17
- Angular Material 17
- TypeScript
- RxJS
- Angular Reactive Forms

---

## Estrutura do projeto

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts            ← protege rotas autenticadas
│   ├── interceptors/
│   │   └── jwt.interceptor.ts       ← injeta token JWT em toda requisição
│   ├── models/
│   │   ├── usuario.model.ts
│   │   ├── projeto.model.ts
│   │   └── tarefa.model.ts
│   └── services/
│       ├── auth.service.ts          ← login, registro, logout
│       ├── projeto.service.ts       ← CRUD de projetos
│       └── tarefa.service.ts        ← CRUD de tarefas
├── pages/
│   ├── login/                       ← tela de login
│   ├── register/                    ← tela de cadastro
│   ├── dashboard/                   ← kanban com todas as tarefas
│   ├── projetos/                    ← listagem e gestão de projetos
│   └── tarefas/                     ← listagem e gestão de tarefas
├── app.config.ts                    ← configuração central
├── app.routes.ts                    ← rotas da aplicação
└── app.ts                           ← componente raiz
```

---

## Telas

### Login — `/login`
Autenticação com email e senha. Após login o token JWT é salvo no `localStorage` e o usuário é redirecionado ao dashboard.

### Cadastro — `/register`
Criação de nova conta. Após cadastro o usuário já é autenticado automaticamente.

### Dashboard — `/dashboard`
Visão Kanban com três colunas — Pendente, Em Andamento e Concluído. Permite filtrar por projeto e alterar o status das tarefas diretamente no board.

### Projetos — `/projetos`
Lista todos os projetos do usuário. Ao clicar em um projeto, exibe as tarefas vinculadas no painel lateral. Permite criar, editar e excluir projetos e tarefas.

### Tarefas — `/tarefas`
Lista todas as tarefas do usuário em formato de cards. Permite criar, editar e excluir tarefas com seleção de projeto e status.

---

## Autenticação

O fluxo de autenticação funciona assim:

```
1. Usuário faz login → API retorna token JWT
2. Token salvo no localStorage
3. JwtInterceptor injeta o token em toda requisição HTTP
4. AuthGuard verifica o token antes de carregar rotas protegidas
5. Logout remove o token e redireciona para /login
```

---

## Como executar

### Pré-requisitos

- Node.js 20+
- Angular CLI 17+

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar em desenvolvimento

```bash
ng serve
```

Acesse `http://localhost:4200`

### 3. Build para produção

```bash
ng build
```

Os arquivos gerados ficam em `dist/taskflow-frontend/`

---

## Configuração da API

A URL base da API está configurada nos services em `src/app/core/services/`. Para apontar para outro ambiente, altere a constante `API` em cada service:

```typescript
private readonly API = 'http://localhost:8080/projetos';
```

---

## Conceitos utilizados

| Conceito | Onde é usado |
|---|---|
| Standalone Components | Todos os componentes |
| Lazy Loading | Carregamento das rotas |
| Reactive Forms | Formulários de login, cadastro, projetos e tarefas |
| HttpInterceptor | Injeção automática do token JWT |
| CanActivateFn | Proteção das rotas autenticadas |
| BehaviorSubject | Estado do usuário logado |
| Observable + subscribe | Consumo da API REST |