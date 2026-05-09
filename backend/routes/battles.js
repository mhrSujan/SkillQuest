const express = require('express');
const router = express.Router();
const { Boss, BattleLog } = require('../models/Battle');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ── GET /api/battles/bosses ──
router.get('/bosses', protect, async (req, res) => {
  try {
    const bosses = await Boss.find({ isActive: true });
    res.json({ success: true, bosses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/battles/result ── Save battle result
router.post('/result', protect, async (req, res) => {
  try {
    const { bossId, result, turnsPlayed, playerHpRemaining } = req.body;

    const boss = await Boss.findById(bossId);
    if (!boss) return res.status(404).json({ success: false, message: 'Boss not found' });

    const user = await User.findById(req.user._id);
    let xpEarned = 0;
    let goldEarned = 0;
    const newAchievements = [];

    if (result === 'victory') {
      xpEarned = boss.xpReward;
      goldEarned = boss.goldReward;
      user.addXP(xpEarned);
      user.gold += goldEarned;
      user.bossesSlain += 1;

      boss.defeatCount += 1;
      boss.defeatedBy.push(user._id);

      if (user.bossesSlain === 1) {
        const ach = { id: 'first_slay', name: 'First Slay', icon: '⚔️' };
        user.achievements.push(ach);
        newAchievements.push(ach);
      }
      if (user.bossesSlain === 5) {
        const ach = { id: 'boss_hunter', name: 'Boss Hunter', icon: '🐉' };
        user.achievements.push(ach);
        newAchievements.push(ach);
      }

      await boss.save();
    }

    // Log the battle
    await BattleLog.create({
      user: user._id,
      boss: boss._id,
      bossName: boss.name,
      result,
      xpEarned,
      goldEarned,
      turnsPlayed: turnsPlayed || 0,
      playerHpRemaining: playerHpRemaining || 0,
    });

    await user.save();

    res.json({
      success: true,
      result,
      rewards: { xp: xpEarned, gold: goldEarned },
      user: {
        level: user.level,
        xp: user.xp,
        xpToNext: user.xpToNext,
        gold: user.gold,
        bossesSlain: user.bossesSlain,
      },
      newAchievements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/battles/seed ── Seed bosses
router.post('/seed', async (req, res) => {
  try {
    await Boss.deleteMany({});
    const bosses = [
      { name: 'HR GATEKEEPER', emoji: '👔', title: 'The Resume Rejecter', maxHp: 150, attack: 15, defense: 5, xpReward: 600, goldReward: 300, requiredSkill: 'Resume Writing', requiredLevel: 1 },
      { name: 'LEETCODE BEAST', emoji: '🦁', title: 'The Algorithm Destroyer', maxHp: 200, attack: 25, defense: 8, xpReward: 900, goldReward: 450, requiredSkill: 'Algorithms', requiredLevel: 3 },
      { name: 'BUG DRAGON', emoji: '🐉', title: 'Ancient Terror of Bugs', maxHp: 300, attack: 30, defense: 12, xpReward: 1200, goldReward: 600, requiredSkill: 'Debugging', requiredLevel: 5 },
      { name: 'DEADLINE TITAN', emoji: '⏰', title: 'Lord of Impossible Timelines', maxHp: 250, attack: 22, defense: 10, xpReward: 1000, goldReward: 500, requiredSkill: 'Project Management', requiredLevel: 4 },
    ];
    await Boss.insertMany(bosses);
    res.json({ success: true, message: `${bosses.length} bosses seeded!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;