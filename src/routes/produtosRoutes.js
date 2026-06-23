const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { listar, buscarPorId, criar, atualizar, remover } = require('../controllers/produtoController');
const { validateProduto, handleErrors } = require('../middlewares/sanitize');

const authEstrito = auth(true);

router.get('/',      authEstrito, listar);
router.get('/:id',  authEstrito, buscarPorId);
router.post('/',    authEstrito, validateProduto, handleErrors, criar);
router.put('/:id',  authEstrito, validateProduto, handleErrors, atualizar);
router.delete('/:id', authEstrito, remover);

module.exports = router;