const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Post = require('../models/Post');

// Get all posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post (authors and admins only)
router.post('/', auth, checkRole(['author', 'admin']), async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user.id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post (admin or author of the post)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is admin or the author of the post
    if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, content } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;

    // Only admin can change the author
    if (req.user.role === 'admin' && req.body.author) {
      post.author = req.body.author;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (admin or author of the post)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is admin or the author of the post
    if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 