const Post = require('../models/Post');

// Criar post
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl || '',
      author: req.user._id
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar todos os posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .populate('comments.author', 'name email')
      .sort('-createdAt');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar um post por ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.author', 'name email');
    if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar post (somente autor)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Você só pode editar seus próprios posts' });
    }
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar post (somente autor)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Você só pode deletar seus próprios posts' });
    }
    await post.deleteOne();
    res.json({ msg: 'Post removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Curtir/descurtir
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
    const userId = req.user._id;
    const likedIndex = post.likes.findIndex(id => id.toString() === userId.toString());
    if (likedIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likedIndex, 1);
    }
    await post.save();
    res.json({ likesCount: post.likes.length, liked: likedIndex === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Adicionar comentário
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
    const comment = {
      text: req.body.text,
      author: req.user._id
    };
    post.comments.push(comment);
    await post.save();
    await post.populate('comments.author', 'name email');
    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remover comentário (autor do comentário ou dono do post)
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: 'Comentário não encontrado' });
    if (comment.author.toString() !== req.user._id.toString() && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Não autorizado' });
    }
    comment.deleteOne();
    await post.save();
    res.json({ msg: 'Comentário removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};