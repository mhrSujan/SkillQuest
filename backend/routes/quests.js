const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ── GET /api/quests ── Get all quests (with optional category filter)
router.get('/', protect, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;

    const quests = await Quest.find(filter).sort({ difficulty: 1, xpReward: 1 });

    // Mark which quests the current user has completed
    const completedIds = req.user.completedQuests.map((id) => id.toString());
    const questsWithStatus = quests.map((q) => ({
      ...q.toObject(),
      completed: completedIds.includes(q._id.toString()),
    }));

    res.json({ success: true, quests: questsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/quests/:id/complete ── Complete a quest
router.post('/seed', async (req, res) => {
  if (req.headers['x-seed-secret'] !== process.env.SEED_SECRET) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const quest = await Quest.findById(req.params.id);
    if (!quest) return res.status(404).json({ success: false, message: 'Quest not found' });

    const user = await User.findById(req.user._id);

    // Check if already completed
    if (user.completedQuests.includes(quest._id)) {
      return res.status(400).json({ success: false, message: 'Quest already completed' });
    }

    // Award XP and gold
    user.addXP(quest.xpReward);
    user.gold += quest.goldReward;
    user.questsCompleted += 1;
    user.completedQuests.push(quest._id);

    // Check achievements
    const newAchievements = [];
    if (user.questsCompleted === 1) {
      const ach = { id: 'first_blood', name: 'First Blood', icon: '🔥' };
      user.achievements.push(ach);
      newAchievements.push(ach);
    }
    if (user.questsCompleted === 10) {
      const ach = { id: 'quest_hunter', name: 'Quest Hunter', icon: '🏹' };
      user.achievements.push(ach);
      newAchievements.push(ach);
    }
    if (user.xp >= 2000 || user.totalXpEarned >= 2000) {
      if (!user.achievements.find((a) => a.id === 'diamond_coder')) {
        const ach = { id: 'diamond_coder', name: 'Diamond Coder', icon: '💎' };
        user.achievements.push(ach);
        newAchievements.push(ach);
      }
    }

    await user.save();

    // Update quest stats
    quest.completionCount += 1;
    quest.completedBy.push(user._id);
    await quest.save();

    res.json({
      success: true,
      message: 'Quest completed!',
      rewards: { xp: quest.xpReward, gold: quest.goldReward },
      user: {
        level: user.level,
        xp: user.xp,
        xpToNext: user.xpToNext,
        gold: user.gold,
        questsCompleted: user.questsCompleted,
      },
      newAchievements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/quests/seed ── Seed initial quests (run once)
router.post('/seed', async (req, res) => {
  try {
    await Quest.deleteMany({});
    const quests = [
      { title: 'Fix the Memory Leak', icon: '🐛', category: 'coding', difficulty: 'easy', xpReward: 300, goldReward: 150, description: 'A React component is re-rendering infinitely and eating memory. Find and fix the useEffect bug causing the memory leak.', codeSnippet: 'useEffect(() => {\n  const timer = setInterval(() => {\n    fetchData(); // BUG: no cleanup!\n  }, 1000);\n}, []);\n\n// Fix: add return () => clearInterval(timer)', tags: ['coding', 'react'] },
      { title: 'Build a REST API', icon: '🌐', category: 'coding', difficulty: 'medium', xpReward: 500, goldReward: 250, description: 'Build a full CRUD REST API using Node.js and Express with proper error handling, middleware, and MongoDB integration.', codeSnippet: 'app.get("/users", async (req, res) => {\n  const users = await User.find();\n  res.json(users);\n});', tags: ['coding', 'backend'] },
      { title: 'Optimize SQL Query', icon: '⚡', category: 'data', difficulty: 'medium', xpReward: 450, goldReward: 200, description: 'A production query is taking 8 seconds. Add proper indexes and rewrite it to run under 100ms.', codeSnippet: 'SELECT * FROM orders o\nJOIN users u ON o.user_id = u.id\nWHERE o.created_at > "2024-01-01"\nORDER BY o.total DESC;', tags: ['data', 'sql'] },
      { title: 'Solve Binary Search', icon: '🧩', category: 'logic', difficulty: 'easy', xpReward: 250, goldReward: 100, description: 'Implement binary search on a rotated sorted array. Return the index of the target element, or -1 if not found.', codeSnippet: 'function search(nums, target) {\n  // Your solution here\n}', tags: ['logic', 'algorithms'] },
      { title: 'System Design: Twitter', icon: '🏗️', category: 'career', difficulty: 'hard', xpReward: 800, goldReward: 400, description: 'Design a scalable Twitter-like system handling 10M users, 100M tweets/day. Cover load balancing, caching, and CDN.', codeSnippet: '// Components: API Gateway, Tweet Service,\n// Timeline Service, Media CDN, Redis Cache', tags: ['career', 'system-design'] },
      { title: 'Craft Your Resume', icon: '📄', category: 'career', difficulty: 'easy', xpReward: 400, goldReward: 200, description: 'Tailor your resume for a senior developer role. Include quantified achievements, strong action verbs, and ATS keywords.', codeSnippet: '// Formula: [Action Verb] + [Task] + [Result]', tags: ['career'] },
      { title: 'Build Job Tracker App', icon: '📱', category: 'project', difficulty: 'hard', xpReward: 1000, goldReward: 500, description: 'Build a full-stack job application tracker with auth, CRUD, analytics charts, and email reminders.', codeSnippet: '// Stack: React + Node + MongoDB\n// Features: JWT Auth, Kanban, Analytics', tags: ['project', 'coding'] },
      { title: 'Debug React Performance', icon: '🔍', category: 'coding', difficulty: 'medium', xpReward: 500, goldReward: 220, description: 'Profile a slow React app using DevTools. Identify unnecessary re-renders and fix with memo, useMemo, and useCallback.', codeSnippet: 'const List = React.memo(({ items, onSelect }) => {\n  // add useMemo + useCallback\n});', tags: ['coding', 'react'] },
      { title: 'Machine Learning Pipeline', icon: '🤖', category: 'data', difficulty: 'legendary', xpReward: 1500, goldReward: 750, description: 'Build an end-to-end ML pipeline: data ingestion, feature engineering, model training, evaluation, and deployment.', codeSnippet: '# 1. Ingestion  2. Features\n# 3. Train  4. Evaluate  5. Deploy', tags: ['data', 'ml'] },
      { title: 'Mock Interview Battle', icon: '🎤', category: 'career', difficulty: 'hard', xpReward: 900, goldReward: 450, description: 'Complete a 45-minute mock technical interview. Answer coding and behavioral questions under time pressure.', codeSnippet: '// Q1: Two Sum\n// Q2: LRU Cache\n// Q3: Merge K Lists\n// Behavioral: STAR Method', tags: ['career', 'interview'] },
    ];
    await Quest.insertMany(quests);
    res.json({ success: true, message: `${quests.length} quests seeded!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;