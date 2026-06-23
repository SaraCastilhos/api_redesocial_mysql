const clienteModel = require('../models/clienteModel');

exports.listar = async (req, res) => {
  try {
    const clientes = await clienteModel.findAll();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const cliente = await clienteModel.findById(req.params.id);
    if (!cliente) return res.status(404).json({ msg: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome, telefone, status } = req.body;
    const novoId = await clienteModel.create({ nome, telefone, status });
    res.status(201).json({ id_cliente: novoId, nome, telefone, status: status || 'medio' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const existe = await clienteModel.findById(req.params.id);
    if (!existe) return res.status(404).json({ msg: 'Cliente não encontrado' });
    const { nome, telefone, status } = req.body;
    await clienteModel.update(req.params.id, { nome, telefone, status });
    res.json({ id_cliente: Number(req.params.id), nome, telefone, status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const existe = await clienteModel.findById(req.params.id);
    if (!existe) return res.status(404).json({ msg: 'Cliente não encontrado' });
    await clienteModel.remove(req.params.id);
    res.json({ msg: 'Cliente removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};