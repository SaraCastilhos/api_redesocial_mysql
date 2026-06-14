# 📱 Rede Social API – Backend com Node.js, Express, MongoDB e JWT

![GitHub repo size](https://img.shields.io/github/repo-size/SaraCastilhos/api_redesocial)
![GitHub language count](https://img.shields.io/github/languages/count/SaraCastilhos/api_redesocial)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens)

API RESTful completa para uma rede social, desenvolvida como trabalho acadêmico. Permite cadastro de usuários, criação de postagens, comentários, curtidas e gerenciamento de permissões com autenticação stateless via JWT. Inclui documentação interativa com **Swagger UI**.

---

## 🛠️ Tecnologias Utilizadas

| Categoria         | Tecnologias                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| **Runtime**       | Node.js                                                                     |
| **Framework**     | Express                                                                     |
| **Banco de Dados**| MongoDB + Mongoose (ODM)                                                    |
| **Autenticação**  | JSON Web Tokens (JWT) + bcrypt (hash de senhas)                             |
| **Segurança**     | Helmet (proteção de headers), express-validator (sanitização/validação)     |
| **Documentação**  | Swagger UI + swagger-autogen (geração automática)                           |
| **Dev Tools**     | Nodemon (recarga automática), GitFlow                                       |

---

## ✨ Funcionalidades Principais

### 👥 Autenticação
- [x] Registro de novos usuários (name, email, password)
- [x] Login com geração de token JWT (válido por 7 dias)
- [x] Proteção de rotas via middleware `auth.js`

### 📝 Postagens
- [x] Criar postagem (título, conteúdo, imagem opcional)
- [x] Listar todas as postagens (com autor e comentários populados)
- [x] Buscar postagem por ID
- [x] Atualizar postagem (somente autor)
- [x] Excluir postagem (somente autor)

### ❤️ Curtidas
- [x] Curtir / descurtir uma postagem (toggle)
- [x] Contagem de curtidas retornada em tempo real

### 💬 Comentários
- [x] Adicionar comentário a uma postagem
- [x] Remover comentário (autor do comentário **ou** dono do post)

### 🔒 Segurança e Boas Práticas
- [x] Senhas criptografadas com bcrypt (hash + salt)
- [x] Validação e sanitização de entradas (previne NoSQL injection e XSS)
- [x] Proteção de headers HTTP com Helmet
- [x] Variáveis de ambiente via `dotenv` (`.env`)
- [x] Arquitetura MVC (Model-View-Controller)

---

## 🖥️ Demonstração Visual – Documentação Interativa

O projeto inclui **Swagger UI** com todos os endpoints documentados e testáveis diretamente no navegador.

Após iniciar o servidor, acesse:

👉 **http://localhost:3000/api-docs**

Lá você poderá:
- Ver todos os endpoints organizados por tags (Autenticação, Postagens, Curtidas, Comentários)
- Ler os schemas de requisição e resposta
- Testar chamadas reais à API (inclusive com token JWT)

---

## 📦 Como Executar o Projeto

### 📋 Pré‑requisitos

Antes de começar, certifique‑se de ter instalado em sua máquina:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MongoDB](https://www.mongodb.com/) – local ou Atlas (nuvem)

### 🔧 Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/SaraCastilhos/api_redesocial.git
   cd api_redesocial
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   - Copie o arquivo de exemplo:
     ```bash
     cp .env.example .env
     ```
   - Edite o `.env` com suas credenciais reais:
     ```env
     MONGODB_URI=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/redesocial
     JWT_SECRET=uma_chave_super_secreta_e_dificil
     PORT=3000
     ```

4. **Inicie o servidor**
   ```bash
   npm run dev
   ```
   O servidor será iniciado em modo desenvolvimento (com Nodemon).  
   A API estará disponível em `http://localhost:3000`.

5. **Acesse a documentação Swagger**  
   Abra o navegador em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

---

## 🔑 Variáveis de Ambiente (`.env`)

| Variável       | Descrição                                                                 | Exemplo                                                  |
|----------------|---------------------------------------------------------------------------|----------------------------------------------------------|
| `MONGODB_URI`  | String de conexão com o MongoDB (local ou Atlas)                         | `mongodb+srv://user:pass@cluster.mongodb.net/redesocial` |
| `JWT_SECRET`   | Chave secreta para assinar os tokens JWT (use uma string longa e aleatória) | `minha_chave_secreta_123`                                |
| `PORT`         | Porta onde o servidor irá rodar (padrão: 3000)                           | `3000`                                                   |

> ⚠️ **Nunca versione o arquivo `.env`**. Ele está incluído no `.gitignore`.

---

## 📌 Endpoints da API

### 🔓 Autenticação (públicos)

| Método | Rota                     | Descrição                          | Corpo (JSON)                            |
|--------|--------------------------|------------------------------------|------------------------------------------|
| POST   | `/api/auth/register`     | Registrar novo usuário             | `{ "name": "...", "email": "...", "password": "..." }` |
| POST   | `/api/auth/login`        | Login e obtenção de token          | `{ "email": "...", "password": "..." }`  |

### 🔒 Postagens (requer token Bearer)

| Método | Rota                     | Descrição                                   | Autenticação |
|--------|--------------------------|-----------------------------------------------|---------------|
| GET    | `/api/posts`             | Listar todas as postagens (com comentários)  | ✅ Bearer     |
| GET    | `/api/posts/:id`         | Buscar postagem por ID                       | ✅ Bearer     |
| POST   | `/api/posts`             | Criar nova postagem                          | ✅ Bearer     |
| PUT    | `/api/posts/:id`         | Atualizar postagem (somente autor)          | ✅ Bearer     |
| DELETE | `/api/posts/:id`         | Remover postagem (somente autor)            | ✅ Bearer     |
| POST   | `/api/posts/:id/like`    | Curtir / descurtir uma postagem             | ✅ Bearer     |

### 💬 Comentários (requer token Bearer)

| Método | Rota                                     | Descrição                                   | Autenticação |
|--------|------------------------------------------|---------------------------------------------|---------------|
| POST   | `/api/posts/:id/comments`               | Adicionar comentário a um post              | ✅ Bearer     |
| DELETE | `/api/posts/:postId/comments/:commentId`| Remover comentário (autor ou dono do post)  | ✅ Bearer     |

> 📌 **Como enviar o token**: inclua no header `Authorization: Bearer <seu_token_jwt>`

---

## 🧪 Exemplo de Uso (com `curl`)

**Registro de usuário**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"123456"}'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

**Criar postagem (substitua TOKEN pelo retornado no login)**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Meu primeiro post","content":"Olá mundo!"}'
```

---

## 📁 Estrutura do Projeto (MVC)

```
api_redesocial/
├── src/
│   ├── config/
│   │   └── db.js               # Conexão com MongoDB
│   ├── models/
│   │   ├── User.js             # Schema de usuário (bcrypt, compare)
│   │   └── Post.js             # Schema de post (com subdocumento comments)
│   ├── controllers/
│   │   ├── authController.js   # Registro, login, geração de token
│   │   └── postController.js   # CRUD, like, comentários
│   ├── routes/
│   │   ├── authRoutes.js       # Rotas públicas de autenticação
│   │   └── postRoutes.js       # Rotas protegidas (posts, likes, comments)
│   ├── middlewares/
│   │   ├── auth.js             # Validação do token JWT
│   │   └── sanitize.js         # Validação com express-validator
├── .env.example                # Modelo das variáveis de ambiente
├── .gitignore
├── package.json
├── server.js                   # Ponto de entrada (configura o app)
├── swagger.js                  # Geração automática da documentação
├── swagger-output.json         # Arquivo gerado (não editar manualmente)
└── README.md                   # Este arquivo
```

---

## 🧠 GitFlow Utilizado

- `main` – versão estável e publicada
- `develop` – branch de integração contínua
- `feature/*` – desenvolvimento de novas funcionalidades

---

## 👩‍💻 Autora

**Sara Amabili Castilhos**  
- GitHub: [@SaraCastilhos](https://github.com/SaraCastilhos)  
- Trabalho desenvolvido para a disciplina **Criação de Sites** – 2026.
