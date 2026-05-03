require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');

// Conectar ao MongoDB
console.log('MONGODB_URI:', process.env.MONGODB_URI);
connectDB();

const app = express();
app.use(helmet());          // segurança nos headers HTTP
app.use(express.json());    // permitir ler JSON no corpo das requisições

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});