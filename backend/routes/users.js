const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ── GET /api/users/leaderboard ──
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const { sort = 'totalXpEarned' } = req.query;
    const sortField = ['totalXpEarned', 'questsCompleted', 'gold', 'bossesSlain'].includes(sort) ? sort : 'totalXpEarned';

    const users = await User.find({})
      .select('username avatar charClass level xp totalXpEarned gold questsCompleted bossesSlain currentStreak')
      .sort({ [sortField]: -1 })
      .limit(50);

    res.json({ success: true, leaderboard: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/users/unlock-skill ──
router.post('/unlock-skill', protect, async (req, res) => {
  try {
    const { skillId, cost } = req.body;
    const user = await User.findById(req.user._id);

    if (user.unlockedSkills.includes(skillId)) {
      return res.status(400).json({ success: false, message: 'Skill already unlocked' });
    }

    const availableXP = Math.max(0, user.xp - 500); // keep a buffer
    if (availableXP < cost) {
      return res.status(400).json({ success: false, message: 'Not enough XP' });
    }

    user.xp -= cost;
    user.unlockedSkills.push(skillId);
    await user.save();

    res.json({
      success: true,
      message: 'Skill unlocked!',
      unlockedSkills: user.unlockedSkills,
      xp: user.xp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/users/profile/:username ──
router.get('/profile/:username', protect, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── PUT /api/users/profile ── Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { avatar, charClass } = req.body;
    const user = await User.findById(req.user._id);
    if (avatar) user.avatar = avatar;
    if (charClass) user.charClass = charClass;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;