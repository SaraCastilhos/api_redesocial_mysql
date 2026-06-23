const { body, validationResult } = require('express-validator');

// ── Usuários ─────────────────────────────────────────────────────────────────
const validateRegister = [
  body('nome').trim().notEmpty().withMessage('Nome obrigatório').escape(),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

// ── Categorias ────────────────────────────────────────────────────────────────
const validateCategoria = [
  body('nome').trim().notEmpty().withMessage('Nome da categoria é obrigatório').escape()
];

// ── Clientes ──────────────────────────────────────────────────────────────────
const validateCliente = [
  body('nome').trim().notEmpty().withMessage('Nome do cliente é obrigatório').escape(),
  body('telefone').trim().notEmpty().withMessage('Telefone é obrigatório').escape(),
  body('status')
    .optional()
    .isIn(['bom', 'medio', 'ruim'])
    .withMessage('Status deve ser: bom, medio ou ruim')
];

// ── Produtos ──────────────────────────────────────────────────────────────────
const validateProduto = [
  body('nome').trim().notEmpty().withMessage('Nome do produto é obrigatório').escape(),
  body('valor')
    .notEmpty().withMessage('Valor é obrigatório')
    .isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
  body('estoque')
    .optional()
    .isInt({ min: 0 }).withMessage('Estoque deve ser um número inteiro positivo'),
  body('categorias_id_categoria')
    .notEmpty().withMessage('Categoria é obrigatória')
    .isInt({ min: 1 }).withMessage('ID da categoria inválido')
];

// ── Pedidos ───────────────────────────────────────────────────────────────────
const validatePedido = [
  body('data')
    .notEmpty().withMessage('Data é obrigatória')
    .isDate().withMessage('Data deve estar no formato YYYY-MM-DD'),
  body('clientes_id_cliente')
    .notEmpty().withMessage('Cliente é obrigatório')
    .isInt({ min: 1 }).withMessage('ID do cliente inválido'),
  body('itens')
    .optional()
    .isArray({ min: 1 }).withMessage('Itens deve ser um array com pelo menos 1 produto'),
  body('itens.*.produtos_id_produto')
    .optional()
    .isInt({ min: 1 }).withMessage('ID do produto inválido nos itens'),
  body('itens.*.quantidade')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Quantidade deve ser maior que zero'),
  body('itens.*.valor')
    .optional()
    .isFloat({ min: 0 }).withMessage('Valor do item deve ser positivo')
];

// ── Handler de erros (compartilhado por todas as rotas) ──────────────────────
const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateRegister,
  validateCategoria,
  validateCliente,
  validateProduto,
  validatePedido,
  handleErrors
};