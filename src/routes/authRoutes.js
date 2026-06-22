const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRegister, handleErrors } = require('../middlewares/sanitize');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Registro e login de usuários
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso – guarde o token e o id_usuario para usar nas rotas de Categorias
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: E-mail já cadastrado ou dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', validateRegister, handleErrors, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário existente – retorna token JWT e id_usuario
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso – copie o token para o botão Authorize e o id_usuario para o header x-user-id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', login);

module.exports = router;