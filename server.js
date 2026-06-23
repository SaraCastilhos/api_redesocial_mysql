require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const pool = require('./src/config/database');
const { criarTabelaUsuarios } = require('./src/models/usuarioModel');

const authRoutes      = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const clientesRoutes  = require('./src/routes/clientesRoutes');
const produtosRoutes  = require('./src/routes/produtosRoutes');
const pedidosRoutes   = require('./src/routes/pedidosRoutes');
const apiRoutes       = require('./src/routes/apiRoutes');

// Swagger
const swaggerUi   = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

// Documentação Swagger (pública)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
  customCss: `
    .swagger-ui .topbar { background-color: #1a1a2e; }
    .swagger-ui .topbar .link { color: #e94560; }
  `,
  customSiteTitle: 'API Rede Social – Docs'
}));

// Rotas
app.use('/api',           apiRoutes);       // GET /api/status (público)
app.use('/api/auth',      authRoutes);      // POST /api/auth/register e /login
app.use('/api/categorias', categoriaRoutes); // CRUD categorias (protegido)
app.use('/api/clientes',  clientesRoutes);  // CRUD clientes   (protegido)
app.use('/api/produtos',  produtosRoutes);  // CRUD produtos   (protegido)
app.use('/api/pedidos',   pedidosRoutes);   // CRUD pedidos    (protegido)

const PORT = process.env.PORT || 3000;

(async () => {
  await pool.testConnection();
  await criarTabelaUsuarios();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`🟢 Status:  http://localhost:${PORT}/api/status`);
  });
})();