const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Nome obrigatório').escape(),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter 6+ caracteres').trim()
];

const validatePost = [
  body('title').trim().notEmpty().withMessage('Título obrigatório').escape(),
  body('content').trim().notEmpty().withMessage('Conteúdo obrigatório').escape(),
  body('imageUrl').optional().isURL().withMessage('URL de imagem inválida')
];

const validateComment = [
  body('text').trim().notEmpty().withMessage('Comentário vazio').escape()
];

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();   // ← ESSENCIAL para continuar para o controller
};

module.exports = { validateRegister, validatePost, validateComment, handleErrors };