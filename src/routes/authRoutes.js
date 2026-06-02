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
 *             $ref: '#/definitions/RegisterBody'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/AuthResponse'
 *       400:
 *         description: E-mail já cadastrado ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', validateRegister, handleErrors, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário existente
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/LoginBody'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso – retorna token JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', login);

module.exports = router;