# 📱 Rede Social API v2 – Migração para MySQL

![GitHub repo size](https://img.shields.io/github/repo-size/SaraCastilhos/api_redesocial_mysql)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens)

API RESTful migrada de NoSQL (MongoDB) para banco de dados relacional **MySQL**, desenvolvida como trabalho acadêmico. Esta versão implementa autenticação stateless via JWT adaptada para MySQL, rota pública de monitoramento e CRUD completo de Categorias com dupla camada de proteção.

> **Versão anterior (MongoDB):** [`api_redesocial`](https://github.com/SaraCastilhos/api_redesocial)

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologias |
|---|---|
| **Runtime** | Node.js (≥ 18) |
| **Framework** | Express |
| **Banco de Dados** | MySQL 8 + mysql2 (driver com Promises) |
| **Autenticação** | JWT (jsonwebtoken) + bcrypt (hash de senhas) |
| **Segurança** | Helmet, express-validator, Prepared Statements |
| **Documentação** | Swagger UI (OpenAPI 3.0) |
| **Dev Tools** | Nodemon, GitFlow |

---

## ✨ Funcionalidades desta versão

### 🔓 Rota Pública
- [x] `GET /api/status` — retorna versão e status da API sem necessidade de autenticação

### 👥 Autenticação (MySQL)
- [x] Registro de usuários com hash bcrypt (tabela `usuarios` no banco `loja`)
- [x] Login com geração de token JWT (válido por 7 dias)
- [x] Proteção de rotas via middleware `auth.js`

### 🗂️ Categorias (CRUD protegido)
- [x] Listar todas as categorias
- [x] Buscar categoria por ID
- [x] Criar categoria
- [x] Atualizar categoria
- [x] Remover categoria

> Todas as rotas de Categorias exigem **dois** controles de acesso simultâneos:
> 1. Header `Authorization: Bearer <token>` — obtido no login
> 2. Header `x-user-id` — ID do usuário, deve coincidir com o token

### 🔒 Segurança e Boas Práticas
- [x] Senhas criptografadas com bcrypt (hash + salt)
- [x] **Prepared Statements** em 100% das queries SQL (previne SQL Injection)
- [x] Validação e sanitização de entradas (previne XSS)
- [x] Proteção de headers HTTP com Helmet
- [x] Variáveis de ambiente via `dotenv`
- [x] Arquitetura MVC

---

## 📦 Como Executar o Projeto

### 📋 Pré-requisitos

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MySQL](https://www.mysql.com/) 8.0 (local) ou MySQL Workbench

### 🔧 Instalação

**1. Clone o repositório**
```bash
git clone https://github.com/SaraCastilhos/api_redesocial_mysql.git
cd api_redesocial_mysql
git checkout feature/migracao-mysql
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure o banco de dados**

Abra o MySQL Workbench e execute o arquivo `database.sql` (na raiz do projeto). Ele cria o banco `loja` com todas as tabelas necessárias, incluindo a tabela `usuarios` para autenticação.

```bash
# Ou via terminal:
mysql -u root -p < database.sql
```

**4. Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais reais:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD="sua_senha_aqui"
DB_NAME=loja
DB_PORT=3306

JWT_SECRET=uma_chave_super_secreta_e_longa
PORT=3000
```

> ⚠️ Se sua senha contiver `#`, envolva o valor entre aspas duplas: `DB_PASSWORD="#suaSenha"`. O caractere `#` é interpretado como comentário em arquivos `.env` sem aspas.

**5. Inicie o servidor**
```bash
npm run dev
```

No terminal você verá:
```
✅ MySQL conectado com sucesso
🚀 Servidor rodando na porta 3000
📚 Swagger: http://localhost:3000/api-docs
🟢 Status:  http://localhost:3000/api/status
```

---

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `DB_HOST` | Host do MySQL | `localhost` |
| `DB_USER` | Usuário do MySQL | `root` |
| `DB_PASSWORD` | Senha do MySQL (use aspas se tiver `#`) | `"#minhaSenha"` |
| `DB_NAME` | Nome do banco de dados | `loja` |
| `DB_PORT` | Porta do MySQL | `3306` |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT | `chave_longa_e_aleatoria` |
| `PORT` | Porta do servidor Node | `3000` |

> ⚠️ **Nunca versione o `.env`**. Ele está no `.gitignore`.

---

## 📌 Endpoints da API

### 🔓 Status (público)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/status` | Retorna versão e status da API |

### 🔓 Autenticação (públicos)

| Método | Rota | Descrição | Body |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar novo usuário | `{ "nome", "email", "password" }` |
| POST | `/api/auth/login` | Login — retorna token e id_usuario | `{ "email", "password" }` |

### 🔒 Categorias (requer token Bearer + header x-user-id)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/categorias` | Listar todas as categorias |
| GET | `/api/categorias/:id` | Buscar categoria por ID |
| POST | `/api/categorias` | Criar nova categoria |
| PUT | `/api/categorias/:id` | Atualizar categoria |
| DELETE | `/api/categorias/:id` | Remover categoria |

> **Como autenticar nas rotas de Categorias:**
> ```
> Authorization: Bearer <token_obtido_no_login>
> x-user-id: <id_usuario_obtido_no_login>
> ```

---

## 🧪 Exemplo de Uso (Postman / curl)

**1. Registrar usuário**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Sara","email":"sara@email.com","password":"senha123"}'
```

**2. Login — copie o `token` e o `id_usuario` da resposta**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sara@email.com","password":"senha123"}'
```

**3. Criar categoria (substitua TOKEN e ID pelos valores do login)**
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Authorization: Bearer TOKEN" \
  -H "x-user-id: ID" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Eletrônicos"}'
```

**4. Teste de bloqueio (sem autenticação — deve retornar 401)**
```bash
curl http://localhost:3000/api/categorias
```

---

## 🖥️ Documentação Swagger

Após iniciar o servidor, acesse:

👉 **http://localhost:3000/api-docs**

Para testar rotas protegidas no Swagger UI:
1. Faça login em `POST /api/auth/login` e copie o `token` e o `id_usuario`
2. Clique em **Authorize** (cadeado) e cole o token (sem a palavra "Bearer")
3. Em cada rota de Categorias, preencha o campo **`x-user-id`** com o `id_usuario`

---

## 📁 Estrutura do Projeto (MVC)

```
api_redesocial_mysql/
├── src/
│   ├── config/
│   │   └── database.js          # Pool MySQL com mysql2/promise
│   ├── models/
│   │   ├── usuarioModel.js      # Queries SQL para autenticação
│   │   └── categoriaModel.js    # Queries SQL para categorias (prepared statements)
│   ├── controllers/
│   │   ├── authController.js    # Registro, login, bcrypt
│   │   └── categoriaController.js # CRUD com validações
│   ├── routes/
│   │   ├── apiRoutes.js         # GET /api/status (público)
│   │   ├── authRoutes.js        # POST /api/auth/register e /login
│   │   └── categoriaRoutes.js   # Rotas protegidas de categorias
│   ├── middlewares/
│   │   ├── auth.js              # Validação JWT + x-user-id
│   │   └── sanitize.js          # Validação com express-validator
├── database.sql                 # Schema completo do banco loja + tabela usuarios
├── .env.example                 # Modelo das variáveis de ambiente
├── .gitignore
├── package.json
├── server.js                    # Ponto de entrada
├── swagger-output.json          # Documentação OpenAPI 3.0
└── README.md
```

---

## 🧠 GitFlow Utilizado

- `main` — versão MongoDB (original)
- `feature/migracao-mysql` — migração para MySQL (esta versão)
- Próximas features: `feature/crud-produtos`, `feature/crud-clientes`, etc.

---

## 🔄 Diferenças em relação à versão anterior (MongoDB)

| Aspecto | v1 (MongoDB) | v2 (MySQL) |
|---|---|---|
| Banco de dados | MongoDB Atlas (NoSQL) | MySQL 8 (relacional) |
| Driver | Mongoose (ODM) | mysql2/promise (pool) |
| Queries | Métodos Mongoose (`.find()`, `.save()`) | SQL com Prepared Statements |
| Hash de senha | bcrypt via Mongoose middleware | bcrypt no controller |
| Autenticação | Token JWT | Token JWT + x-user-id obrigatório |
| Schema | Mongoose Schema | Tabelas SQL (`database.sql`) |

---

## 👩‍💻 Autora

**Sara Amabili Castilhos**
- GitHub: [@SaraCastilhos](https://github.com/SaraCastilhos)
- Trabalho desenvolvido para a disciplina **Criação de Sites** – 2026