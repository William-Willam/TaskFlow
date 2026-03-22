# TaskFlow API — Backend

API REST desenvolvida com **Spring Boot 3.5** e **Java 21**, com autenticação JWT e documentação via Swagger.

---

## Tecnologias

- Java 21
- Spring Boot 3.5
- Spring Data JPA + Hibernate 6
- Spring Security 6
- JWT (jjwt 0.12.6)
- MySQL 8
- Lombok
- Swagger / OpenAPI (springdoc 2.8.16)

---

## Estrutura do projeto

```
src/main/java/com/taskflow/
├── config/
│   ├── ApplicationConfig.java       ← beans de segurança
│   ├── SecurityConfig.java          ← filtros, CORS e rotas protegidas
│   └── SwaggerConfig.java           ← configuração do Swagger + JWT
├── security/
│   └── JwtAuthFilter.java           ← intercepta e valida tokens JWT
├── controller/
│   ├── AuthController.java          ← /auth/register e /auth/login
│   ├── UsuarioController.java
│   ├── ProjetoController.java
│   └── TarefaController.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── UsuarioRequest.java
│   │   ├── ProjetoRequest.java
│   │   └── TarefaRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UsuarioResponse.java
│       ├── ProjetoResponse.java
│       └── TarefaResponse.java
├── enums/
│   └── StatusTarefa.java
├── model/
│   ├── Usuario.java                 ← implementa UserDetails
│   ├── Projeto.java
│   └── Tarefa.java
├── repository/
│   ├── UsuarioRepository.java
│   ├── ProjetoRepository.java
│   └── TarefaRepository.java
└── service/
    ├── AuthService.java             ← registro e login
    ├── JwtService.java              ← geração e validação de tokens
    ├── UsuarioService.java
    ├── ProjetoService.java
    └── TarefaService.java
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

## Endpoints

### Autenticação — rotas públicas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Cadastrar e receber token JWT |
| POST | `/auth/login` | Autenticar e receber token JWT |

### Usuários — requer token JWT
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/usuarios` | Criar usuário |
| GET | `/usuarios/{id}` | Buscar por ID |
| GET | `/usuarios` | Listar todos |

### Projetos — requer token JWT
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/projetos?usuarioId={id}` | Listar projetos |
| POST | `/projetos?usuarioId={id}` | Criar projeto |
| PUT | `/projetos/{id}?usuarioId={id}` | Atualizar projeto |
| DELETE | `/projetos/{id}?usuarioId={id}` | Excluir projeto |

### Tarefas — requer token JWT
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/tarefas?usuarioId={id}` | Listar todas as tarefas |
| GET | `/tarefas/projeto/{projetoId}?usuarioId={id}` | Listar por projeto |
| POST | `/tarefas?usuarioId={id}` | Criar tarefa |
| PUT | `/tarefas/{id}?usuarioId={id}` | Atualizar tarefa |
| DELETE | `/tarefas/{id}?usuarioId={id}` | Excluir tarefa |

---

## Autenticação JWT

Todas as rotas exceto `/auth/**`, `/swagger-ui/**` e `/v3/api-docs/**` exigem autenticação.

```
Authorization: Bearer <token>
```

**Expiração:** 24 horas

---

## Como executar

### 1. Criar o banco de dados

```sql
CREATE DATABASE taskflow;
```

### 2. Configurar o application.properties

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

### 3. Executar

```bash
mvn spring-boot:run
```

---

## Documentação interativa

```
http://localhost:8080/swagger-ui/index.html
```

Para testar rotas protegidas:
1. Execute `POST /auth/login`
2. Copie o token retornado
3. Clique em **Authorize 🔒**
4. Cole: `Bearer <token>`

---

## Arquitetura em camadas

```
Controller  ←  recebe a requisição HTTP
    ↓
Service     ←  contém a lógica de negócio
    ↓
Repository  ←  acessa o banco de dados
    ↓
Database    ←  MySQL
```

Cada camada tem uma responsabilidade única — o Controller nunca acessa o banco diretamente, e o Repository nunca contém regras de negócio.