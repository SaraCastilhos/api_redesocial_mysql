const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

/**
 * Middleware de autenticação JWT.
 *
 * Valida o token Bearer e, opcionalmente, exige que o id_usuario
 * informado no body/header corresponda ao id do token — requisito
 * de segurança do CRUD de Categorias.
 *
 * @param {boolean} exigirIdUsuario - quando true, rejeita a requisição se
 *   o campo `id_usuario` do body/header não bater com o token.
 */
const auth = (exigirIdUsuario = false) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Valida que o usuário ainda existe no MySQL
    const usuario = await usuarioModel.findById(decoded.id);
    if (!usuario) return res.status(401).json({ msg: 'Usuário não encontrado' });

    req.user = usuario; // { id_usuario, nome, email, criado_em }

    // ── Validação extra: id_usuario deve ser informado e coincidir ──────────
    if (exigirIdUsuario) {
      // Aceita tanto header x-user-id quanto body.id_usuario
      const idInformado = req.headers['x-user-id'] || req.body?.id_usuario;

      if (!idInformado) {
        return res.status(401).json({
          msg: 'ID do usuário não informado. Envie x-user-id no header ou id_usuario no body.'
        });
      }

      if (String(idInformado) !== String(usuario.id_usuario)) {
        return res.status(403).json({
          msg: 'ID do usuário não corresponde ao token informado.'
        });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = auth;