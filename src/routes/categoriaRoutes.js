const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { validateCategoria, handleErrors } = require('../middlewares/sanitize');
const {
  listar, buscarPorId, criar, atualizar, remover
} = require('../controllers/categoriaController');

// Todas as rotas de categorias exigem: token válido + id_usuario correspondente
const authEstrito = auth(true);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário autenticado (deve coincidir com o token)
 *     responses:
 *       200:
 *         description: Lista de categorias
 *       401:
 *         description: Token não fornecido ou ID do usuário ausente
 *       403:
 *         description: ID do usuário não corresponde ao token
 */
router.get('/', authEstrito, listar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', authEstrito, buscarPorId);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaBody'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post('/', authEstrito, validateCategoria, handleErrors, criar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaBody'
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Categoria não encontrada
 */
router.put('/:id', authEstrito, validateCategoria, handleErrors, atualizar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Remover categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria removida
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/:id', authEstrito, remover);

module.exports = router;