const pool = require('../config/database');

// Lista todos os pedidos com o nome do cliente
const findAll = async () => {
  const [rows] = await pool.execute(`
    SELECT p.id_pedido, p.data, p.clientes_id_cliente,
           c.nome AS cliente_nome
    FROM pedidos p
    JOIN clientes c ON p.clientes_id_cliente = c.id_cliente
    ORDER BY p.data DESC
  `);
  return rows;
};

// Busca um pedido com seus itens (produtos)
const findById = async (id) => {
  const [pedido] = await pool.execute(`
    SELECT p.id_pedido, p.data, p.clientes_id_cliente,
           c.nome AS cliente_nome
    FROM pedidos p
    JOIN clientes c ON p.clientes_id_cliente = c.id_cliente
    WHERE p.id_pedido = ? LIMIT 1
  `, [id]);

  if (!pedido[0]) return null;

  const [itens] = await pool.execute(`
    SELECT pp.produtos_id_produto, pp.quantidade, pp.valor,
           pr.nome AS produto_nome
    FROM produtos_pedidos pp
    JOIN produtos pr ON pp.produtos_id_produto = pr.id_produto
    WHERE pp.pedidos_id_pedido = ?
  `, [id]);

  return { ...pedido[0], itens };
};

// Cria pedido e seus itens numa transação
const create = async ({ data, clientes_id_cliente, itens }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)',
      [data, clientes_id_cliente]
    );
    const id_pedido = result.insertId;

    for (const item of itens) {
      await conn.execute(
        'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
        [item.produtos_id_produto, id_pedido, item.quantidade, item.valor]
      );
    }

    await conn.commit();
    return id_pedido;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// Atualiza apenas a data e o cliente do pedido (itens ficam para futuro)
const update = async (id, { data, clientes_id_cliente }) => {
  const [result] = await pool.execute(
    'UPDATE pedidos SET data = ?, clientes_id_cliente = ? WHERE id_pedido = ?',
    [data, clientes_id_cliente, id]
  );
  return result.affectedRows;
};

// Remove pedido e seus itens numa transação
const remove = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?', [id]);
    const [result] = await conn.execute('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
    await conn.commit();
    return result.affectedRows;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = { findAll, findById, create, update, remove };