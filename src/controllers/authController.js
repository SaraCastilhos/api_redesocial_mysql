const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

// ─── helpers ────────────────────────────────────────────────────────────────

const gerarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── register ────────────────────────────────────────────────────────────────

exports.register = async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    const existente = await usuarioModel.findByEmail(email);
    if (existente) {
      return res.status(400).json({ msg: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(password, 10);
    const novoId = await usuarioModel.create({ nome, email, senhaHash });

    res.status(201).json({
      id_usuario: novoId,
      nome,
      email,
      token: gerarToken(novoId)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── login ───────────────────────────────────────────────────────────────────

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await usuarioModel.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(password, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }

    res.json({
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      token: gerarToken(usuario.id_usuario)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};