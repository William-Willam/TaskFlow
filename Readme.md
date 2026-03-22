# TaskFlow

Sistema completo de gerenciamento de tarefas e projetos desenvolvido com **Spring Boot** e **Angular**, com autenticação JWT e dashboard estilo Kanban.

---

## Visão geral

O TaskFlow permite que usuários criem projetos, gerenciem tarefas e acompanhem o progresso através de um dashboard Kanban com três colunas: Pendente, Em Andamento e Concluído.

---

## Estrutura do repositório

```
TaskFlow/
├── taskflow-api/          ← Backend Spring Boot
│   └── README.md          ← Documentação do backend
├── taskflow-frontend/     ← Frontend Angular
│   └── README.md          ← Documentação do frontend
└── README.md              ← Este arquivo
```

---

## Tecnologias

### Backend
- Java 21
- Spring Boot 3.5
- Spring Data JPA
- Spring Security + JWT
- MySQL 8
- Lombok
- Swagger / OpenAPI

### Frontend
- Angular 17
- Angular Material
- TypeScript

---

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Token JWT com expiração de 24 horas
- Rotas protegidas — acesso negado sem token válido
- CRUD completo de projetos por usuário
- CRUD completo de tarefas vinculadas a projetos
- Dashboard Kanban — Pendente, Em Andamento, Concluído
- Isolamento de dados por usuário autenticado
- Documentação interativa via Swagger UI

---

## Como executar o projeto completo

### Pré-requisitos

- Java 21+
- Node.js 20+
- MySQL 8+
- Angular CLI 17+

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow
```

### 2. Subir o backend

```bash
cd taskflow-api
```

Configure o banco de dados em `src/main/resources/application.properties` e rode:

```bash
mvn spring-boot:run
```

API disponível em `http://localhost:8080`

### 3. Subir o frontend

```bash
cd taskflow-frontend
npm install
ng serve
```

Aplicação disponível em `http://localhost:4200`

---

## Fluxo de uso

```
1. Acesse http://localhost:4200/register
2. Crie sua conta
3. Crie um projeto em "Projetos"
4. Adicione tarefas ao projeto
5. Acompanhe o progresso no Dashboard Kanban
```

---

## Status do projeto

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Ambiente e configuração | ✅ Concluído |
| 2 | Banco de dados e entidades JPA | ✅ Concluído |
| 3 | Backend — Controllers, Services, DTOs | ✅ Concluído |
| 4 | Segurança com JWT | ✅ Concluído |
| 5 | Frontend Angular | ✅ Concluído |
| 6 | Integração e CORS | ✅ Concluído |

---

## Autor

Desenvolvido por **William** como projeto prático de aprendizado em Java + Spring Boot + Angular.