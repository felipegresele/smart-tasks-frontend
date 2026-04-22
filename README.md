# ⚡ SmartTask

Aplicação de gerenciamento de tarefas com **board Kanban**, autenticação JWT e **sugestão de tarefas por IA** (Google Gemini).

---

## 📸 Visão Geral

SmartTask é um projeto fullstack com frontend em **React + TypeScript** e backend em **Spring Boot + Java**. O usuário se cadastra, faz login e gerencia suas tarefas em um board Kanban com drag & drop. Um painel lateral permite descrever um objetivo em linguagem natural e receber sugestões de tarefas geradas pela IA do Gemini.

---

## 🛠️ Stack

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | Interface e tipagem |
| Vite | Build e dev server |
| Tailwind CSS v4 | Estilização |
| React Query (TanStack) | Cache, mutations e estados de loading |
| Zustand + persist | Estado global de autenticação |
| Axios | Requisições HTTP com interceptors |
| @hello-pangea/dnd | Drag & drop do Kanban |
| React Router v6 | Roteamento |

### Backend
| Tecnologia | Uso |
|---|---|
| Spring Boot 3 | Framework principal |
| Spring Security | Autenticação e autorização |
| JWT (jjwt) | Tokens de acesso |
| Spring Data JPA + Hibernate | ORM e acesso ao banco |
| PostgreSQL | Banco de dados |
| Lombok | Redução de boilerplate |
| Google Gemini API | Sugestão de tarefas por IA |

### Infraestrutura
| Serviço | Uso |
|---|---|
| Render | Deploy do backend (Docker) |
| PostgreSQL (Render) | Banco de dados em produção |

---

## 📁 Estrutura do Projeto

```
smartTask/
├── task-frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth-store/
│   │   │   │   ├── auth.ts          # Chamadas de login e registro
│   │   │   │   └── authStore.ts     # Zustand store com persist
│   │   │   ├── tasks/
│   │   │   │   ├── tasks.ts         # Chamadas CRUD de tarefas
│   │   │   │   └── useTasks.ts      # React Query hooks
│   │   │   ├── index.ts             # Instância Axios + interceptors
│   │   │   └── useAuth.ts           # Hooks de login/registro
│   │   ├── components/
│   │   │   ├── dashboard.tsx        # Board Kanban principal
│   │   │   ├── login.tsx            # Tela de login
│   │   │   ├── register.tsx         # Tela de cadastro
│   │   │   ├── sidebar.tsx          # Sidebar com stats
│   │   │   └── task-modal/
│   │   │       ├── task-modal.tsx   # Modal criar/editar tarefa
│   │   │       ├── kanban-column.tsx# Coluna do Kanban
│   │   │       ├── task-card.tsx    # Card da tarefa
│   │   │       └── ai-input.tsx     # Painel de sugestão por IA
│   │   ├── schema/
│   │   │   └── index.ts             # Types e interfaces TypeScript
│   │   ├── App.tsx
│   │   ├── AppRoutes.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── task-backend/
    └── src/main/java/com/task/task/
        ├── config/
        │   ├── AppConfig.java       # Beans gerais (ObjectMapper)
        │   └── CorsConfig.java      # Configuração de CORS
        ├── controller/
        │   ├── AuthController.java  # POST /auth/login, /auth/register
        │   └── TaskController.java  # CRUD /tasks
        ├── exception/
        │   └── GlobalExceptionHandler.java
        ├── model/
        │   ├── Task.java
        │   ├── User.java
        │   ├── dto/
        │   │   ├── AuthDTO.java
        │   │   ├── TaskDTO.java
        │   │   └── TaskSuggestionRequest.java
        │   └── types/
        │       ├── Priority.java    # LOW, MEDIUM, HIGH
        │       └── TaskStatus.java  # TODO, DOING, DONE
        ├── repository/
        │   ├── TaskRepository.java
        │   └── UserRepository.java
        ├── security/
        │   ├── SecurityConfig.java
        │   ├── JwtAuthFilter.java
        │   ├── JwtUtil.java
        │   └── CustomUserDetailsService.java
        └── service/
            └── TaskService.java     # CRUD + integração Gemini
```

---

## 🔌 Endpoints da API

### Auth — público

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastro de usuário |
| `POST` | `/auth/login` | Login, retorna JWT |

**Body de registro:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Body de login:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta (ambos):**
```json
{
  "token": "eyJhbGci...",
  "name": "João Silva",
  "email": "joao@email.com",
  "userId": 1
}
```

---

### Tasks — requer `Authorization: Bearer <token>`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tasks` | Lista tarefas do usuário |
| `GET` | `/tasks?status=TODO` | Filtra por status |
| `GET` | `/tasks?priority=HIGH` | Filtra por prioridade |
| `GET` | `/tasks/stats` | Contagem por status |
| `POST` | `/tasks` | Cria nova tarefa |
| `PUT` | `/tasks/{id}` | Atualiza tarefa completa |
| `PATCH` | `/tasks/{id}/status?status=DONE` | Atualiza só o status |
| `DELETE` | `/tasks/{id}` | Remove tarefa |
| `POST` | `/tasks/suggest` | Sugestão de tarefas via Gemini |

**Body de criação/atualização:**
```json
{
  "title": "Implementar autenticação",
  "description": "Usar JWT com refresh token",
  "status": "TODO",
  "priority": "HIGH"
}
```

**Body de sugestão:**
```json
{
  "text": "Preciso lançar uma landing page para meu SaaS essa semana"
}
```

---

## ⚙️ Variáveis de Ambiente

### Backend (`application.properties` lê de env vars)

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL JDBC do PostgreSQL. Ex: `jdbc:postgresql://host:5432/db` |
| `DATABASE_USERNAME` | Usuário do banco |
| `DATABASE_PASSWORD` | Senha do banco |
| `JWT_SECRET` | Chave secreta Base64 para assinar os tokens (mín. 32 chars) |
| `GEMINI_API_KEY` | Chave da Google Gemini API |

### Frontend

Não há `.env` — a `baseURL` está hardcoded no `src/api/index.ts`. Para mudar o backend basta editar esse arquivo:

```ts
// src/api/index.ts
export const api = axios.create({
  baseURL: 'https://smart-tasks-backend.onrender.com',
})
```

---

## 🚀 Rodando localmente

### Pré-requisitos

- Node.js 18+
- Java 17+
- Maven
- PostgreSQL rodando localmente

### Backend

```bash
cd task-backend

# Configure as variáveis de ambiente
export DATABASE_URL=jdbc:postgresql://localhost:5432/smarttask
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=sua_senha
export JWT_SECRET=sua_chave_base64_minimo_32_caracteres
export GEMINI_API_KEY=sua_chave_gemini

# Rode
./mvnw spring-boot:run
```

O backend sobe em `http://localhost:8080`.

### Frontend

```bash
cd task-frontend

npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

> **Atenção:** se estiver rodando localmente, atualize a `baseURL` no `src/api/index.ts` para `http://localhost:8080`.

---

## 🐳 Deploy com Docker (backend)

O projeto inclui um `Dockerfile` pronto para deploy:

```dockerfile
# Dockerfile já incluso no task-backend/
```

Para buildar e rodar:

```bash
cd task-backend
docker build -t smarttask-backend .
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host:5432/db \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=senha \
  -e JWT_SECRET=sua_chave \
  -e GEMINI_API_KEY=sua_chave_gemini \
  smarttask-backend
```

---

## 🔐 Como funciona a autenticação

1. Usuário faz login → backend valida credenciais e retorna um JWT
2. Frontend armazena o token no `localStorage` via Zustand persist
3. Todas as requisições seguintes enviam `Authorization: Bearer <token>` automaticamente via interceptor do Axios
4. Backend valida o token no `JwtAuthFilter` antes de cada requisição protegida
5. Se o token expirar (15 min), o interceptor de resposta detecta o `401` e faz logout automático

---

## 🤖 Como funciona a sugestão por IA

1. Usuário descreve um objetivo no painel lateral
2. Frontend envia o texto para `POST /tasks/suggest`
3. Backend monta um prompt estruturado e chama a API do Gemini (`gemini-2.0-flash`)
4. O Gemini retorna um array JSON com tarefas sugeridas (título, descrição, prioridade)
5. Frontend exibe as sugestões — o usuário pode adicioná-las ao board com um clique

---

## 📝 Licença

Projeto pessoal para fins de estudo e portfólio.