const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('nome').trim().notEmpty().withMessage('Nome obrigatório').escape(),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

const validateCategoria = [
  body('nome').trim().notEmpty().withMessage('Nome da categoria é obrigatório').escape()
];

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateRegister, validateCategoria, handleErrors };