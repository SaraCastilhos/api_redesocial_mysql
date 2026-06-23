# 📱 Rede Social API v2 – MySQL

![Node Version](https://img.shields.io/badge/node-%3E%3D18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens)

API RESTful migrada de NoSQL (MongoDB) para banco de dados relacional **MySQL**, desenvolvida como trabalho acadêmico. Implementa autenticação JWT, rota pública de monitoramento e CRUD completo de Categorias, Clientes, Produtos e Pedidos — todos com dupla camada de proteção.

> **Versão anterior (MongoDB):** [`api_redesocial`](https://github.com/SaraCastilhos/api_redesocial)

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologias |
|---|---|
| **Runtime** | Node.js (≥ 18) |
| **Framework** | Express |
| **Banco de Dados** | MySQL 8 + mysql2/promise (pool de conexões) |
| **Autenticação** | JWT (jsonwebtoken) + bcrypt |
| **Segurança** | Helmet, express-validator, Prepared Statements |
| **Documentação** | Swagger UI (OpenAPI 3.0) |
| **Dev Tools** | Nodemon, GitFlow |

---

## ✨ Funcionalidades

### 🔓 Rota Pública
- [x] `GET /api/status` — versão e status da API, sem autenticação

### 👥 Autenticação
- [x] Registro de usuários com hash bcrypt
- [x] Login com geração de token JWT (7 dias)

### 🗂️ Categorias · Clientes · Produtos · Pedidos (CRUD protegido)
- [x] Listar todos os registros
- [x] Buscar por ID
- [x] Criar
- [x] Atualizar
- [x] Remover

> ⚠️ Todas as rotas de CRUD exigem **dois** controles simultâneos:
> 1. `Authorization: Bearer <token>` — obtido no login
> 2. `x-user-id: <id_usuario>` — deve coincidir com o token

### 🔒 Segurança
- [x] Prepared Statements em 100% das queries (previne SQL Injection)
- [x] Senhas hasheadas com bcrypt
- [x] Validação de entradas com express-validator
- [x] Helmet (proteção de headers HTTP)
- [x] Transações SQL em pedidos (garante integridade dos itens)

---

## 📦 Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) ≥ 18
- [MySQL](https://www.mysql.com/) 8.0

### Instalação

```bash
git clone https://github.com/SaraCastilhos/api_redesocial_mysql.git
cd api_redesocial_mysql
git checkout feature/crud-clientes-produtos-pedidos
npm install
```

### Banco de dados

Execute o `database.sql` no MySQL Workbench (ou via terminal):
```bash
mysql -u root -p < database.sql
```

### Variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD="sua_senha"
DB_NAME=loja
DB_PORT=3306
JWT_SECRET=chave_super_secreta
PORT=3000
```

> ⚠️ Se sua senha tiver `#`, envolva em aspas duplas: `DB_PASSWORD="#senha"`

### Iniciar

```bash
npm run dev
```

```
✅ MySQL conectado com sucesso
🚀 Servidor rodando na porta 3000
📚 Swagger: http://localhost:3000/api-docs
```

---

## 📌 Endpoints

### 🔓 Público

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/status` | Status e versão da API |

### 🔓 Autenticação

| Método | Rota | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ nome, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |

### 🔒 Categorias · Clientes · Produtos · Pedidos

Todas as rotas abaixo exigem os headers:
```
Authorization: Bearer <token>
x-user-id: <id_usuario>
```

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/categorias` | Listar categorias |
| GET | `/api/categorias/:id` | Buscar por ID |
| POST | `/api/categorias` | Criar |
| PUT | `/api/categorias/:id` | Atualizar |
| DELETE | `/api/categorias/:id` | Remover |
| GET | `/api/clientes` | Listar clientes |
| GET | `/api/clientes/:id` | Buscar por ID |
| POST | `/api/clientes` | Criar |
| PUT | `/api/clientes/:id` | Atualizar |
| DELETE | `/api/clientes/:id` | Remover |
| GET | `/api/produtos` | Listar produtos (com nome da categoria) |
| GET | `/api/produtos/:id` | Buscar por ID |
| POST | `/api/produtos` | Criar |
| PUT | `/api/produtos/:id` | Atualizar |
| DELETE | `/api/produtos/:id` | Remover |
| GET | `/api/pedidos` | Listar pedidos (com nome do cliente) |
| GET | `/api/pedidos/:id` | Buscar por ID (com itens) |
| POST | `/api/pedidos` | Criar pedido com itens |
| PUT | `/api/pedidos/:id` | Atualizar data/cliente |
| DELETE | `/api/pedidos/:id` | Remover pedido e itens |

---

## 🧪 Exemplo rápido (curl)

```bash
# 1. Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Sara","email":"sara@email.com","password":"senha123"}'

# 2. Login — copie token e id_usuario
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sara@email.com","password":"senha123"}'

# 3. Criar categoria
curl -X POST http://localhost:3000/api/categorias \
  -H "Authorization: Bearer TOKEN" \
  -H "x-user-id: ID" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Eletrônicos"}'

# 4. Criar cliente
curl -X POST http://localhost:3000/api/clientes \
  -H "Authorization: Bearer TOKEN" -H "x-user-id: ID" \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","telefone":"(51)99999-0000","status":"bom"}'

# 5. Criar produto (use o id_categoria do passo 3)
curl -X POST http://localhost:3000/api/produtos \
  -H "Authorization: Bearer TOKEN" -H "x-user-id: ID" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Notebook","valor":3499.90,"estoque":5,"categorias_id_categoria":7}'

# 6. Criar pedido com itens
curl -X POST http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer TOKEN" -H "x-user-id: ID" \
  -H "Content-Type: application/json" \
  -d '{"data":"2026-06-22","clientes_id_cliente":1,"itens":[{"produtos_id_produto":25,"quantidade":2,"valor":3499.90}]}'
```

---

## 🖥️ Swagger

Acesse `http://localhost:3000/api-docs` para testar todos os endpoints interativamente.

No Swagger: clique em **Authorize**, cole o token, e preencha `x-user-id` em cada rota.

---

## 📁 Estrutura do Projeto

```
api_redesocial_mysql/
├── src/
│   ├── config/
│   │   └── database.js              # Pool MySQL com mysql2/promise
│   ├── models/
│   │   ├── usuarioModel.js          # Queries de autenticação
│   │   ├── categoriaModel.js        # CRUD categorias
│   │   ├── clienteModel.js          # CRUD clientes
│   │   ├── produtoModel.js          # CRUD produtos (JOIN categorias)
│   │   └── pedidoModel.js           # CRUD pedidos + itens (transação SQL)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoriaController.js
│   │   ├── clienteController.js
│   │   ├── produtoController.js
│   │   └── pedidoController.js
│   ├── routes/
│   │   ├── apiRoutes.js             # GET /api/status (público)
│   │   ├── authRoutes.js
│   │   ├── categoriaRoutes.js
│   │   ├── clientesRoutes.js
│   │   ├── produtosRoutes.js
│   │   └── pedidosRoutes.js
│   └── middlewares/
│       ├── auth.js                  # JWT + x-user-id
│       └── sanitize.js              # express-validator
├── database.sql                     # Schema loja + tabela usuarios
├── .env.example
├── package.json
├── server.js
└── swagger-output.json              # OpenAPI 3.0
```

---

## 🧠 GitFlow

| Branch | Conteúdo |
|---|---|
| `main` | Versão original MongoDB |
| `feature/migracao-mysql` | Migração base: auth + categorias |
| `feature/crud-clientes-produtos-pedidos` | CRUD completo: clientes, produtos, pedidos |

---

## 🔄 Diferenças em relação à v1 (MongoDB)

| Aspecto | v1 (MongoDB) | v2 (MySQL) |
|---|---|---|
| Banco | MongoDB Atlas | MySQL 8 |
| Driver | Mongoose | mysql2/promise |
| Queries | Mongoose methods | SQL + Prepared Statements |
| Integridade | Sem FKs | FKs + transações SQL |
| Autenticação | Token JWT | Token JWT + x-user-id |

---

## 👩‍💻 Autora

**Sara Amabili Castilhos**
- GitHub: [@SaraCastilhos](https://github.com/SaraCastilhos)
- Disciplina **Criação de Sites** – 2026