import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getQuests, completeQuest } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['all', 'coding', 'logic', 'career', 'data', 'project'];
const DIFF_COLORS = { easy: 'var(--green)', medium: 'var(--gold)', hard: 'var(--red)', legendary: 'var(--purple)' };
const TAG_COLORS = { coding: 'badge-blue', logic: 'badge-purple', career: 'badge-gold', data: 'badge-green', project: 'badge-blue', backend: 'badge-purple', react: 'badge-blue', sql: 'badge-green', ml: 'badge-purple', interview: 'badge-gold', algorithms: 'badge-blue' };

export default function QuestBoard() {
  const { user, updateUser } = useAuth();
  const [quests, setQuests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchQuests();
  }, [filter]);

  const fetchQuests = async () => {
    setLoading(true);
    try {
      const { data } = await getQuests(filter);
      setQuests(data.quests);
    } catch {
      toast.error('Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!selected) return;
    setCompleting(true);
    try {
      const { data } = await completeQuest(selected._id);
      toast.success(`⚡ Quest Complete! +${data.rewards.xp} XP +${data.rewards.gold} 🪙`);
      if (data.newAchievements?.length > 0) {
        setTimeout(() => toast.success(`🏅 Achievement: ${data.newAchievements[0].name}!`), 500);
      }
      updateUser(data.user);
      setSelected(null);
      fetchQuests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete quest');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="page-title">📜 Quest Board</div>
        <div className="page-sub">Choose your challenge. Earn XP and gold. Level up your career.</div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.9rem', fontWeight: 700, letterSpacing: 1, transition: 'all 0.2s',
            background: filter === cat ? 'rgba(99,102,241,0.15)' : 'none',
            border: `1px solid ${filter === cat ? 'var(--blue)' : 'var(--border2)'}`,
            color: filter === cat ? 'var(--blue2)' : 'var(--text3)',
          }}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Quest List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quests.map((q, i) => (
            <motion.div key={q._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(q)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 12,
                padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
                cursor: 'pointer', transition: 'all 0.2s', opacity: q.completed ? 0.6 : 1,
                borderLeft: `3px solid ${DIFF_COLORS[q.difficulty]}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{q.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 3 }}>
                  {q.completed ? '✅ ' : ''}{q.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 6 }}>{q.description.slice(0, 80)}...</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {q.tags?.map((t) => (
                    <span key={t} className={`badge ${TAG_COLORS[t] || 'badge-blue'}`}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue2)' }}>+{q.xpReward} XP</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold)', marginTop: 2 }}>+{q.goldReward} 🪙</div>
                <span className={`badge badge-${q.difficulty === 'easy' ? 'green' : q.difficulty === 'medium' ? 'gold' : q.difficulty === 'hard' ? 'red' : 'purple'}`} style={{ marginTop: 6 }}>
                  {q.difficulty.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quest Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem', maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
            >
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{selected.icon}</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.2rem', fontWeight: 700, marginBottom: 6 }}>{selected.title}</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span className={`badge badge-${selected.difficulty === 'easy' ? 'green' : selected.difficulty === 'medium' ? 'gold' : 'red'}`}>{selected.difficulty.toUpperCase()}</span>
                {selected.tags?.map((t) => <span key={t} className={`badge ${TAG_COLORS[t] || 'badge-blue'}`}>{t}</span>)}
              </div>
              <p style={{ color: 'var(--text3)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.95rem' }}>{selected.description}</p>
              {selected.codeSnippet && (
                <pre style={{ background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 8, padding: '1rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: 'var(--cyan)', marginBottom: '1rem', overflowX: 'auto', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {selected.codeSnippet}
                </pre>
              )}
              <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem' }}>
                <div className="badge badge-blue" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>✨ +{selected.xpReward} XP</div>
                <div className="badge badge-gold" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>🪙 +{selected.goldReward} GOLD</div>
              </div>
              {selected.completed
                ? <div style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 700 }}>✅ Quest Already Completed!</div>
                : <button className="btn-primary" style={{ width: '100%' }} onClick={handleComplete} disabled={completing}>
                    {completing ? 'Completing...' : '⚡ ACCEPT & COMPLETE QUEST'}
                  </button>
              }
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}