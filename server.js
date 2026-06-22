require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const pool = require('./src/config/database');
const { criarTabelaUsuarios } = require('./src/models/usuarioModel');

const authRoutes = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const app = express();

// Helmet com ajuste para permitir o Swagger UI carregar seus assets inline
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.json());

// Rota de documentação Swagger (pública)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
  customCss: `
    .swagger-ui .topbar { background-color: #1a1a2e; }
    .swagger-ui .topbar .link { color: #e94560; }
  `,
  customSiteTitle: 'API Rede Social – Docs'
}));

// Rotas da API

// Rota pública de status
app.use('/api', apiRoutes);

// Rotas de autenticação (públicas)
app.use('/api/auth', authRoutes);

// Rotas protegidas de categorias
app.use('/api/categorias', categoriaRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  await pool.testConnection();        // testa a conexão MySQL antes de subir o servidor
  await criarTabelaUsuarios();        // garante que a tabela usuarios existe no banco loja

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`🟢 Status:  http://localhost:${PORT}/api/status`);
  });
})();