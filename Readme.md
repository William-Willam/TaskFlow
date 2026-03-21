# TaskFlow API

Sistema de gerenciamento de tarefas desenvolvido com **Spring Boot** e **Angular**, permitindo que usuários organizem seus projetos e controlem tarefas através de um dashboard estilo Kanban.

---

## Tecnologias

### Backend
- Java 21
- Spring Boot 3.5
- Spring Data JPA
- Spring Security + JWT (jjwt 0.12.6)
- MySQL 8
- Lombok
- Swagger / OpenAPI (springdoc 2.8.16)

### Frontend _(em desenvolvimento)_
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
- Dashboard Kanban com status: Pendente, Em Andamento e Concluído
- Isolamento de dados por usuário autenticado
- Documentação interativa via Swagger UI com suporte a autenticação JWT

---

## Estrutura do projeto

```
taskflow-api/
├── src/main/java/com/taskflow/
│   ├── config/
│   │   ├── ApplicationConfig.java       ← beans de segurança
│   │   ├── SecurityConfig.java          ← filtros e rotas protegidas
│   │   └── SwaggerConfig.java           ← configuração do Swagger + JWT
│   ├── security/
│   │   └── JwtAuthFilter.java           ← intercepta e valida tokens
│   ├── controller/
│   │   ├── AuthController.java          ← /auth/register e /auth/login
│   │   ├── UsuarioController.java
│   │   ├── ProjetoController.java
│   │   └── TarefaController.java
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── UsuarioRequest.java
│   │   │   ├── ProjetoRequest.java
│   │   │   └── TarefaRequest.java
│   │   └── response/
│   │       ├── AuthResponse.java
│   │       ├── UsuarioResponse.java
│   │       ├── ProjetoResponse.java
│   │       └── TarefaResponse.java
│   ├── enums/
│   │   └── StatusTarefa.java
│   ├── model/
│   │   ├── Usuario.java                 ← implementa UserDetails
│   │   ├── Projeto.java
│   │   └── Tarefa.java
│   ├── repository/
│   │   ├── UsuarioRepository.java
│   │   ├── ProjetoRepository.java
│   │   └── TarefaRepository.java
│   └── service/
│       ├── AuthService.java             ← registro e login
│       ├── JwtService.java              ← geração e validação de tokens
│       ├── UsuarioService.java
│       ├── ProjetoService.java
│       └── TarefaService.java
└── src/main/resources/
    └── application.properties
```

---

## Modelo de dados

```
Usuario 1 ──── N Projeto
Projeto  1 ──── N Tarefa
```

| Entidade | Campos principais |
|----------|-------------------|
| Usuario  | id, nome, email, senha |
| Projeto  | id, nome, descricao, dataCriacao, usuario_id |
| Tarefa   | id, titulo, descricao, prazo, status, dataCriacao, projeto_id |

**Status da tarefa:** `PENDENTE` · `EM_ANDAMENTO` · `CONCLUIDO`

---

## Endpoints da API

### Autenticação — rotas públicas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Cadastrar novo usuário e receber token JWT |
| POST | `/auth/login` | Autenticar e receber token JWT |

### Usuários — requer token JWT
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/usuarios` | Criar usuário |
| GET | `/usuarios/{id}` | Buscar usuário por ID |
| GET | `/usuarios` | Listar todos os usuários |

### Projetos — requer token JWT
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/projetos?usuarioId={id}` | Listar projetos do usuário |
| POST | `/projetos?usuarioId={id}` | Criar projeto |
| PUT | `/projetos/{id}?usuarioId={id}` | Atualizar projeto |
| DELETE | `/projetos/{id}?usuarioId={id}` | Excluir projeto |

### Tarefas — requer token JWT
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/tarefas?usuarioId={id}` | Listar todas as tarefas do usuário |
| GET | `/tarefas/projeto/{projetoId}?usuarioId={id}` | Listar tarefas por projeto |
| POST | `/tarefas?usuarioId={id}` | Criar tarefa |
| PUT | `/tarefas/{id}?usuarioId={id}` | Atualizar tarefa |
| DELETE | `/tarefas/{id}?usuarioId={id}` | Excluir tarefa |

---

## Autenticação JWT

Todas as rotas exceto `/auth/**`, `/swagger-ui/**` e `/v3/api-docs/**` exigem autenticação.

**Fluxo:**

```
1. POST /auth/register ou /auth/login
2. Copiar o token retornado no campo "token"
3. Enviar no header de cada requisição:
   Authorization: Bearer <token>
```

**Expiração:** 24 horas

---

## Como executar

### Pré-requisitos

- Java 21+
- Maven 3.9+
- MySQL 8+

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/taskflow-api.git
cd taskflow-api
```

### 2. Criar o banco de dados

```sql
CREATE DATABASE taskflow;
```

### 3. Configurar o application.properties

Edite o arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskflow
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

server.port=8080
spring.application.name=taskflow-api

jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
```

### 4. Executar o projeto

```bash
mvn spring-boot:run
```

A aplicação estará disponível em `http://localhost:8080`.

---

## Documentação interativa

Com a aplicação rodando, acesse o Swagger UI:

```
http://localhost:8080/swagger-ui/index.html
```

Para testar rotas protegidas no Swagger:
1. Execute `POST /auth/register` ou `POST /auth/login`
2. Copie o token retornado
3. Clique em **Authorize 🔒** no topo da página
4. Cole o token no formato: `Bearer <token>`
5. Clique em **Authorize** → **Close**

---

## Status do projeto

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Ambiente e configuração | ✅ Concluído |
| 2 | Banco de dados e entidades JPA | ✅ Concluído |
| 3 | Backend — Controllers, Services, DTOs | ✅ Concluído |
| 4 | Segurança com JWT | ✅ Concluído |
| 5 | Frontend Angular | 🔄 Em andamento |
| 6 | Integração e testes | ⏳ Pendente |

---

## Autor

Desenvolvido por **William dos Santos Rodrigues** como projeto prático de aprendizado em Java + Spring Boot + Angular.