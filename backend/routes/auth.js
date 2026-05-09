const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper: generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// ── POST /api/auth/register ──
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('charClass').notEmpty().withMessage('Class is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const { username, email, password, charClass, avatar } = req.body;

      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Username or email already taken' });
      }

      const user = await User.create({
        username,
        email,
        password,
        charClass,
        avatar: avatar || '🧙',
        inventory: [{ item: 'health_potion', quantity: 3 }],
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          charClass: user.charClass,
          level: user.level,
          xp: user.xp,
          xpToNext: user.xpToNext,
          gold: user.gold,
          questsCompleted: user.questsCompleted,
          bossesSlain: user.bossesSlain,
          unlockedSkills: user.unlockedSkills,
          inventory: user.inventory,
          achievements: user.achievements,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ── POST /api/auth/login ──
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username }).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      // Update streak
      const today = new Date().toDateString();
      const lastActive = new Date(user.lastActiveDate).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (lastActive === yesterday) {
        user.currentStreak += 1;
        if (user.currentStreak > user.longestStreak) user.longestStreak = user.currentStreak;
      } else if (lastActive !== today) {
        user.currentStreak = 1;
      }
      user.lastActiveDate = new Date();
      await user.save();

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          charClass: user.charClass,
          level: user.level,
          xp: user.xp,
          xpToNext: user.xpToNext,
          gold: user.gold,
          questsCompleted: user.questsCompleted,
          bossesSlain: user.bossesSlain,
          currentStreak: user.currentStreak,
          unlockedSkills: user.unlockedSkills,
          inventory: user.inventory,
          achievements: user.achievements,
          completedQuests: user.completedQuests,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ── GET /api/auth/me ──
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('completedQuests', 'title category');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;