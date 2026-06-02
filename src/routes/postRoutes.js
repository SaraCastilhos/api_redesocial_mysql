const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { validatePost, validateComment, handleErrors } = require('../middlewares/sanitize');
const {
  createPost, getPosts, getPostById, updatePost, deletePost, toggleLike,
  addComment, deleteComment
} = require('../controllers/postController');

/**
 * @swagger
 * tags:
 *   - name: Postagens
 *     description: CRUD de postagens (requer token Bearer)
 *   - name: Curtidas
 *     description: Curtir e descurtir postagens (requer token Bearer)
 *   - name: Comentários
 *     description: Gerenciar comentários em postagens (requer token Bearer)
 */

router.use(auth);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Listar todas as postagens
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de postagens com autores e comentários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Post'
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Buscar uma postagem por ID
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Postagem encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Post'
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', getPostById);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Criar uma nova postagem
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/PostBody'
 *     responses:
 *       201:
 *         description: Postagem criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Post'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ErrorResponse'
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post('/', validatePost, handleErrors, createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Atualizar uma postagem (somente o autor)
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/PostBody'
 *     responses:
 *       200:
 *         description: Postagem atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Post'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Você só pode editar seus próprios posts
 *       404:
 *         description: Post não encontrado
 */
router.put('/:id', validatePost, handleErrors, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Remover uma postagem (somente o autor)
 *     tags: [Postagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem
 *     responses:
 *       200:
 *         description: Post removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/MessageResponse'
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Você só pode deletar seus próprios posts
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', deletePost);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Curtir ou descurtir uma postagem
 *     tags: [Curtidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem
 *     responses:
 *       200:
 *         description: Operação de curtida realizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/LikeResponse'
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/:id/like', toggleLike);

/**
 * @swagger
 * /api/posts/{id}/comments:
 *   post:
 *     summary: Adicionar um comentário a uma postagem
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CommentBody'
 *     responses:
 *       201:
 *         description: Comentário adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Comment'
 *       400:
 *         description: Dados inválidos (comentário vazio)
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Post não encontrado
 */
router.post('/:id/comments', validateComment, handleErrors, addComment);

/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Remover um comentário (autor do comentário ou dono do post)
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário removido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/MessageResponse'
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Post ou comentário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:postId/comments/:commentId', deleteComment);

module.exports = router;