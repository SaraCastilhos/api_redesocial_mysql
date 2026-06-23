const pool = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id_cliente, nome, telefone, status FROM clientes ORDER BY nome'
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_cliente, nome, telefone, status FROM clientes WHERE id_cliente = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ nome, telefone, status = 'medio' }) => {
  const [result] = await pool.execute(
    'INSERT INTO clientes (nome, telefone, status) VALUES (?, ?, ?)',
    [nome, telefone, status]
  );
  return result.insertId;
};

const update = async (id, { nome, telefone, status }) => {
  const [result] = await pool.execute(
    'UPDATE clientes SET nome = ?, telefone = ?, status = ? WHERE id_cliente = ?',
    [nome, telefone, status, id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM clientes WHERE id_cliente = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = { findAll, findById, create, update, remove };