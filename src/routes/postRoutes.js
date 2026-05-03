const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { validatePost, validateComment, handleErrors } = require('../middlewares/sanitize');
const {
  createPost, getPosts, getPostById, updatePost, deletePost, toggleLike,
  addComment, deleteComment
} = require('../controllers/postController');

router.use(auth);

router.post('/', validatePost, handleErrors, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', validatePost, handleErrors, updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLike);
router.post('/:id/comments', validateComment, handleErrors, addComment);
router.delete('/:postId/comments/:commentId', deleteComment);

module.exports = router;