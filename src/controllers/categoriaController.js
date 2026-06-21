const categoriaModel = require('../models/categoriaModel');

// ─── GET /api/categorias ─────────────────────────────────────────────────────
exports.listar = async (req, res) => {
  try {
    const categorias = await categoriaModel.findAll();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /api/categorias/:id ─────────────────────────────────────────────────
exports.buscarPorId = async (req, res) => {
  try {
    const categoria = await categoriaModel.findById(req.params.id);
    if (!categoria) return res.status(404).json({ msg: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /api/categorias ────────────────────────────────────────────────────
exports.criar = async (req, res) => {
  try {
    const { nome } = req.body;
    const novoId = await categoriaModel.create(nome);
    res.status(201).json({ id_categoria: novoId, nome });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ─── PUT /api/categorias/:id ─────────────────────────────────────────────────
exports.atualizar = async (req, res) => {
  try {
    const existe = await categoriaModel.findById(req.params.id);
    if (!existe) return res.status(404).json({ msg: 'Categoria não encontrada' });

    const { nome } = req.body;
    await categoriaModel.update(req.params.id, nome);
    res.json({ id_categoria: Number(req.params.id), nome });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ─── DELETE /api/categorias/:id ──────────────────────────────────────────────
exports.remover = async (req, res) => {
  try {
    const existe = await categoriaModel.findById(req.params.id);
    if (!existe) return res.status(404).json({ msg: 'Categoria não encontrada' });

    await categoriaModel.remove(req.params.id);
    res.json({ msg: 'Categoria removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};