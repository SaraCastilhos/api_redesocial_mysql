const produtoModel = require('../models/produtoModel');

exports.listar = async (req, res) => {
  try {
    const produtos = await produtoModel.findAll();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const produto = await produtoModel.findById(req.params.id);
    if (!produto) return res.status(404).json({ msg: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome, valor, estoque, categorias_id_categoria } = req.body;
    const novoId = await produtoModel.create({ nome, valor, estoque, categorias_id_categoria });
    res.status(201).json({ id_produto: novoId, nome, valor, estoque: estoque ?? 1, categorias_id_categoria });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const existe = await produtoModel.findById(req.params.id);
    if (!existe) return res.status(404).json({ msg: 'Produto não encontrado' });
    const { nome, valor, estoque, categorias_id_categoria } = req.body;
    await produtoModel.update(req.params.id, { nome, valor, estoque, categorias_id_categoria });
    res.json({ id_produto: Number(req.params.id), nome, valor, estoque, categorias_id_categoria });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const existe = await produtoModel.findById(req.params.id);
    if (!existe) return res.status(404).json({ msg: 'Produto não encontrado' });
    await produtoModel.remove(req.params.id);
    res.json({ msg: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};