import express from 'express';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'forever_and_always_love_token_2026';

// Sign up / Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, senderName, recipientName, customTexts } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }

    const existing = await dbService.findUserByUsername(cleanUsername);
    if (existing) {
      return res.status(400).json({ error: 'Username is already taken. Please pick another one.' });
    }

    const newUser = await dbService.createUser({
      username: cleanUsername,
      password,
      senderName: senderName?.trim() || 'Romeo',
      recipientName: recipientName?.trim() || 'Juliet',
      customTexts,
      role: 'lover',
    });

    const token = jwt.sign(
      { id: newUser._id || newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '60d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id || newUser.id,
        username: newUser.username,
        senderName: newUser.senderName,
        recipientName: newUser.recipientName,
        proposalNote: newUser.proposalNote,
        customTexts: newUser.customTexts,
        shareCode: newUser.shareCode || newUser.username,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({ error: 'Failed to create account: ' + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = await dbService.findUserByUsername(cleanUsername);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id || user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '60d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        senderName: user.senderName || 'Romeo',
        recipientName: user.recipientName || 'Juliet',
        proposalNote: user.proposalNote,
        customTexts: user.customTexts,
        shareCode: user.shareCode || user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// Check current user session
router.get('/me', requireAuth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id || req.user.id,
      username: req.user.username,
      senderName: req.user.senderName || 'Romeo',
      recipientName: req.user.recipientName || 'Juliet',
      proposalNote:
        req.user.proposalNote ||
        'Every heartbeat, every dawn, every ordinary Tuesday — I want them all with you.',
      customTexts: req.user.customTexts,
      shareCode: req.user.shareCode || req.user.username,
      role: req.user.role,
    },
  });
});

// Update couple names, proposal note, and customTexts in user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { senderName, recipientName, proposalNote, customTexts } = req.body;
    const userId = req.user._id || req.user.id;
    const updated = await dbService.updateUserProfile(userId, {
      senderName,
      recipientName,
      proposalNote,
      customTexts,
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: updated._id || updated.id,
        username: updated.username,
        senderName: updated.senderName,
        recipientName: updated.recipientName,
        proposalNote: updated.proposalNote,
        customTexts: updated.customTexts,
        shareCode: updated.shareCode || updated.username,
        role: updated.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
