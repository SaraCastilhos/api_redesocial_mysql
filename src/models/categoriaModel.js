const pool = require('../config/database');

/**
 * Lista todas as categorias (prepared statement).
 */
const findAll = async () => {
  const [rows] = await pool.execute('SELECT id_categoria, nome FROM categorias ORDER BY nome');
  return rows;
};

/**
 * Busca categoria por ID (prepared statement).
 */
const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_categoria, nome FROM categorias WHERE id_categoria = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

/**
 * Cria nova categoria (prepared statement).
 */
const create = async (nome) => {
  const [result] = await pool.execute(
    'INSERT INTO categorias (nome) VALUES (?)',
    [nome]
  );
  return result.insertId;
};

/**
 * Atualiza categoria (prepared statement).
 */
const update = async (id, nome) => {
  const [result] = await pool.execute(
    'UPDATE categorias SET nome = ? WHERE id_categoria = ?',
    [nome, id]
  );
  return result.affectedRows;
};

/**
 * Remove categoria (prepared statement).
 */
const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM categorias WHERE id_categoria = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = { findAll, findById, create, update, remove };