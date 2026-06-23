const pool = require('../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(`
    SELECT p.id_produto, p.nome, p.valor, p.estoque,
           p.categorias_id_categoria,
           c.nome AS categoria_nome
    FROM produtos p
    JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
    ORDER BY p.nome
  `);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(`
    SELECT p.id_produto, p.nome, p.valor, p.estoque,
           p.categorias_id_categoria,
           c.nome AS categoria_nome
    FROM produtos p
    JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
    WHERE p.id_produto = ? LIMIT 1
  `, [id]);
  return rows[0] || null;
};

const create = async ({ nome, valor, estoque = 1, categorias_id_categoria }) => {
  const [result] = await pool.execute(
    'INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)',
    [nome, valor, estoque, categorias_id_categoria]
  );
  return result.insertId;
};

const update = async (id, { nome, valor, estoque, categorias_id_categoria }) => {
  const [result] = await pool.execute(
    'UPDATE produtos SET nome = ?, valor = ?, estoque = ?, categorias_id_categoria = ? WHERE id_produto = ?',
    [nome, valor, estoque, categorias_id_categoria, id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM produtos WHERE id_produto = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = { findAll, findById, create, update, remove };