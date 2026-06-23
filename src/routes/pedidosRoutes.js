const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { listar, buscarPorId, criar, atualizar, remover } = require('../controllers/pedidoController');
const { validatePedido, handleErrors } = require('../middlewares/sanitize');

const authEstrito = auth(true);

router.get('/',      authEstrito, listar);
router.get('/:id',  authEstrito, buscarPorId);
router.post('/',    authEstrito, validatePedido, handleErrors, criar);
router.put('/:id',  authEstrito, validatePedido, handleErrors, atualizar);
router.delete('/:id', authEstrito, remover);

module.exports = router;