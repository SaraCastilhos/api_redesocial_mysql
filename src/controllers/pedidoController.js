const pedidoModel = require('../models/pedidoModel');

exports.listar = async (req, res) => {
  try {
    const pedidos = await pedidoModel.findAll();
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const pedido = await pedidoModel.findById(req.params.id);
    if (!pedido) return res.status(404).json({ msg: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const { data, clientes_id_cliente, itens } = req.body;
    const novoId = await pedidoModel.create({ data, clientes_id_cliente, itens });
    const criado = await pedidoModel.findById(novoId);
    res.status(201).json(criado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const existe = await pedidoModel.findById(req.params.id);
    if (!existe) return res.status(404).json({ msg: 'Pedido não encontrado' });
    const { data, clientes_id_cliente } = req.body;
    await pedidoModel.update(req.params.id, { data, clientes_id_cliente });
    const atualizado = await pedidoModel.findById(req.params.id);
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const existe = await pedidoModel.findById(req.params.id);
    if (!existe) return res.status(404).json({ msg: 'Pedido não encontrado' });
    await pedidoModel.remove(req.params.id);
    res.json({ msg: 'Pedido removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};