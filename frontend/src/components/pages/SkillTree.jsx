import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { unlockSkill } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const SKILL_TREE = [
  {
    branch: 'Frontend', icon: '🎨', color: 'var(--blue)',
    skills: [
      { id: 'html', name: 'HTML5 Mastery', cost: 0, desc: 'Semantic HTML, accessibility' },
      { id: 'css', name: 'CSS Wizardry', cost: 100, desc: 'Flexbox, Grid, animations' },
      { id: 'js', name: 'JavaScript Core', cost: 200, desc: 'ES6+, async, closures' },
      { id: 'react', name: 'React Master', cost: 400, desc: 'Hooks, Context, Performance' },
      { id: 'ts', name: 'TypeScript', cost: 500, desc: 'Type system, generics' },
      { id: 'next', name: 'Next.js Legend', cost: 800, desc: 'SSR, ISR, App Router' },
    ],
  },
  {
    branch: 'Backend', icon: '⚙️', color: 'var(--purple)',
    skills: [
      { id: 'node', name: 'Node.js Basics', cost: 0, desc: 'Runtime, modules, npm' },
      { id: 'express', name: 'Express.js', cost: 200, desc: 'REST APIs, middleware' },
      { id: 'mongo', name: 'MongoDB', cost: 300, desc: 'NoSQL, aggregations' },
      { id: 'auth', name: 'JWT Auth', cost: 400, desc: 'Authentication flows' },
      { id: 'redis', name: 'Redis Cache', cost: 600, desc: 'Caching, pub/sub' },
      { id: 'micro', name: 'Microservices', cost: 1000, desc: 'Architecture patterns' },
    ],
  },
  {
    branch: 'Data & AI', icon: '📊', color: 'var(--green)',
    skills: [
      { id: 'sql', name: 'SQL Fundamentals', cost: 0, desc: 'Queries, joins, indexes' },
      { id: 'python', name: 'Python Core', cost: 150, desc: 'Data manipulation, OOP' },
      { id: 'pandas', name: 'Pandas/NumPy', cost: 300, desc: 'Data analysis' },
      { id: 'ml', name: 'Machine Learning', cost: 600, desc: 'sklearn, model training' },
      { id: 'dl', name: 'Deep Learning', cost: 900, desc: 'Neural networks, PyTorch' },
      { id: 'llm', name: 'LLM Engineering', cost: 1200, desc: 'Prompting, RAG, agents' },
    ],
  },
  {
    branch: 'Leadership', icon: '👑', color: 'var(--gold)',
    skills: [
      { id: 'git', name: 'Git Mastery', cost: 0, desc: 'Branching, PRs, CI/CD' },
      { id: 'agile', name: 'Agile/Scrum', cost: 200, desc: 'Sprint planning, retros' },
      { id: 'code-review', name: 'Code Review', cost: 350, desc: 'Feedback, standards' },
      { id: 'system-design', name: 'System Design', cost: 700, desc: 'Scalable architecture' },
      { id: 'mentoring', name: 'Mentoring', cost: 900, desc: 'Teaching, team growth' },
      { id: 'exec-presence', name: 'Exec Presence', cost: 1500, desc: 'Leadership excellence' },
    ],
  },
];

export default function SkillTree() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(null);
  const userSkills = user?.unlockedSkills || [];

  const handleUnlock = async (branchIdx, skillIdx, skill) => {
    const branch = SKILL_TREE[branchIdx];
    const prevUnlocked = skillIdx === 0 || userSkills.includes(branch.skills[skillIdx - 1].id);
    if (!prevUnlocked) { toast.error('🔒 Unlock previous skills first!'); return; }
    if (userSkills.includes(skill.id)) { toast.error('Already unlocked!'); return; }
    if ((user?.xp || 0) < skill.cost) { toast.error('❌ Not enough XP!'); return; }

    setLoading(skill.id);
    try {
      const { data } = await unlockSkill(skill.id, skill.cost);
      updateUser({ unlockedSkills: data.unlockedSkills, xp: data.xp });
      toast.success(`✨ Unlocked: ${skill.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unlock skill');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="page-title">🌲 Skill Tree</div>
        <div className="page-sub">Spend XP to unlock skills. Each branch opens new quest types.</div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.2rem' }}>✨</span>
        <span style={{ color: 'var(--text3)' }}>Available XP:</span>
        <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, color: 'var(--blue2)', fontSize: '1.1rem' }}>{user?.xp || 0}</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text3)' }}>Click available skills to unlock</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {SKILL_TREE.map((branch, bi) => {
          const unlockedCount = branch.skills.filter((s) => userSkills.includes(s.id)).length;
          return (
            <motion.div key={branch.branch} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: bi * 0.1 }} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem', paddingBottom: 10, borderBottom: '1px solid var(--border2)' }}>
                <span style={{ fontSize: '1.5rem' }}>{branch.icon}</span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.9rem', fontWeight: 700, color: branch.color }}>{branch.branch}</span>
                <span style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: branch.color }}>{unlockedCount}/{branch.skills.length}</span>
              </div>
              {branch.skills.map((skill, si) => {
                const isUnlocked = userSkills.includes(skill.id);
                const prevUnlocked = si === 0 || userSkills.includes(branch.skills[si - 1].id);
                const isAvailable = !isUnlocked && prevUnlocked;
                const state = isUnlocked ? 'unlocked' : isAvailable ? 'available' : 'locked';
                return (
                  <div key={skill.id} onClick={() => isAvailable && handleUnlock(bi, si, skill)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px', borderRadius: 8, marginBottom: 4, cursor: isAvailable ? 'pointer' : 'default', transition: 'all 0.2s', background: isAvailable ? 'transparent' : 'transparent' }}
                    onMouseEnter={(e) => { if (isAvailable) e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: isUnlocked ? 'var(--green)' : isAvailable ? branch.color : 'var(--text3)', boxShadow: isUnlocked ? '0 0 6px rgba(16,185,129,0.5)' : isAvailable ? `0 0 6px ${branch.color}66` : 'none' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: state === 'locked' ? 'var(--text3)' : 'var(--text)' }}>{skill.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{skill.desc}</div>
                    </div>
                    {isUnlocked && <span style={{ color: 'var(--green)', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace" }}>✓ LEARNED</span>}
                    {isAvailable && (
                      <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace' " }}>
                        {loading === skill.id ? '...' : skill.cost > 0 ? `${skill.cost} XP` : 'FREE'}
                      </span>
                    )}
                    {state === 'locked' && <span style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>🔒</span>}
                  </div>
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}