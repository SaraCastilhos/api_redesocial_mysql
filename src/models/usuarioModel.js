const pool = require('../config/database');

/**
 * Garante que a tabela `usuarios` existe no banco loja.
 * Chamada uma vez na inicialização do servidor (ver server.js).
 */
const criarTabelaUsuarios = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario   INT UNSIGNED NOT NULL AUTO_INCREMENT,
      nome         VARCHAR(100) NOT NULL,
      email        VARCHAR(150) NOT NULL,
      senha_hash   VARCHAR(255) NOT NULL,
      criado_em    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id_usuario),
      UNIQUE KEY uq_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
  `);
};

/**
 * Busca usuário pelo e-mail (prepared statement).
 */
const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

/**
 * Busca usuário pelo ID (prepared statement).
 */
const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_usuario, nome, email, criado_em FROM usuarios WHERE id_usuario = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

/**
 * Cria novo usuário (prepared statement).
 * Recebe a senha JÁ HASHEADA (o hash é feito no authController com bcrypt).
 */
const create = async ({ nome, email, senhaHash }) => {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );
  return result.insertId;
};

module.exports = { criarTabelaUsuarios, findByEmail, findById, create };