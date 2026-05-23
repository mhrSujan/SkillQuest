import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getLeaderboard } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';


const SORTS = [
  { key: 'totalXpEarned', label: 'TOP XP' },
  { key: 'questsCompleted', label: 'MOST QUESTS' },
  { key: 'gold', label: 'RICHEST' },
  { key: 'bossesSlain', label: 'BOSS SLAYER' },
];

const RANK_STYLES = { 0: '#ffd700', 1: '#c0c0c0', 2: '#cd7f32' };
const RANK_EMOJI = { 0: '🥇', 1: '🥈', 2: '🥉' };

export default function Leaderboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [sort, setSort] = useState('totalXpEarned');
  const [loading, setLoading] = useState(true);

  const fetchLB = useCallback(async () => {
  setLoading(true);
  try {
    const { data: res } = await getLeaderboard(sort);
    setData(res.leaderboard);
  } catch {
    toast.error('Failed to load leaderboard');
  } finally {
    setLoading(false);
  }
}, [sort]);

useEffect(() => {
  fetchLB();
}, [fetchLB]);



  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="page-title">🏆 Leaderboard</div>
        <div className="page-sub">Global rankings of the greatest developer heroes.</div>
      </div>

      {/* Sort tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {SORTS.map((s) => (
          <button key={s.key} onClick={() => setSort(s.key)} style={{
            padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.9rem', fontWeight: 700, letterSpacing: 1, transition: 'all 0.2s',
            background: sort === s.key ? 'rgba(99,102,241,0.15)' : 'none',
            border: `1px solid ${sort === s.key ? 'var(--blue)' : 'var(--border2)'}`,
            color: sort === s.key ? 'var(--blue2)' : 'var(--text3)',
          }}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 16, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px 100px', padding: '12px 20px', background: 'var(--bg2)', borderBottom: '1px solid var(--border2)', fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: 1, fontFamily: "'Share Tech Mono', monospace" }}>
            <div>RANK</div><div>HERO</div><div>XP</div><div>QUESTS</div><div>GOLD</div><div>BOSSES</div>
          </div>

          {data.map((u, i) => {
            const isMe = user?.username === u.username;
            return (
              <motion.div key={u._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px 100px',
                  padding: '14px 20px', borderBottom: '1px solid var(--border2)',
                  alignItems: 'center', background: isMe ? 'rgba(99,102,241,0.08)' : 'transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { if (!isMe) e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
                onMouseLeave={(e) => { if (!isMe) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '1rem', color: RANK_STYLES[i] || 'var(--text3)' }}>
                  {RANK_EMOJI[i] || `#${i + 1}`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{u.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{u.username}{isMe ? ' (You)' : ''}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontFamily: "'Share Tech Mono', monospace" }}>LVL {u.level} · {u.charClass}</div>
                  </div>
                </div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue2)' }}>{(u.totalXpEarned || u.xp || 0).toLocaleString()}</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.9rem', fontWeight: 700, color: 'var(--green)' }}>{u.questsCompleted}</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold)' }}>{(u.gold || 0).toLocaleString()}</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.9rem', fontWeight: 700, color: 'var(--purple)' }}>{u.bossesSlain || 0}</div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}