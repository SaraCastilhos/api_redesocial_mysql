require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

// Conectar ao MongoDB
console.log('MONGODB_URI:', process.env.MONGODB_URI);
connectDB();

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
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});