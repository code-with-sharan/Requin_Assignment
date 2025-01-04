const express = require('express');
const router = express.Router();
const { auth, checkRole, isAdminOrSelf } = require('../middleware/auth');
const User = require('../models/User');

// Get all users (admin only)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile (authenticated users)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin or self)
router.put('/:id', auth, isAdminOrSelf, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, email } = req.body;
    user.username = username || user.username;
    user.email = email || user.email;

    // Only admin can change roles
    if (req.user.role === 'admin' && req.body.role) {
      user.role = req.body.role;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 

