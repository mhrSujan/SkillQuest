import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, color }) => (
  <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: 1, marginBottom: 6, fontFamily: "'Share Tech Mono', monospace" }}>{label}</div>
    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.6rem', fontWeight: 700, color }}>{value}</div>
    <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '2rem', opacity: 0.12 }}>{icon}</div>
  </div>
);

const activeQuests = [
  { icon: '🔧', title: 'Optimize SQL Query', desc: 'Reduce query time by 80%', pct: 60, color: 'var(--blue)' },
  { icon: '📝', title: 'Interview Prep', desc: 'Study system design', pct: 30, color: 'var(--gold)' },
  { icon: '🌐', title: 'Build Portfolio Site', desc: 'Deploy live project', pct: 85, color: 'var(--green)' },
];

const recentActivity = [
  { icon: '🐛', text: 'Fixed Memory Leak in React App', xp: '+300 XP', time: '2 hours ago' },
  { icon: '⚔️', text: 'Defeated LeetCode Beast', xp: '+750 XP', time: 'Yesterday' },
  { icon: '🏹', text: 'Built REST API Quest', xp: '+500 XP', time: '2 days ago' },
  { icon: '📝', text: 'Resume Boss Defeated', xp: '+400 XP', time: '3 days ago' },
];

const achievements = [
  { icon: '🔥', name: 'First Blood', desc: 'Complete first quest' },
  { icon: '⚡', name: 'Speed Runner', desc: '5 quests in one day' },
  { icon: '🐉', name: 'Dragon Slayer', desc: 'Defeat Bug Dragon' },
  { icon: '💎', name: 'Diamond Coder', desc: 'Reach 2000+ XP' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const xpPct = user ? Math.min(100, Math.round((user.xp / user.xpToNext) * 100)) : 0;

  return (
    <div style={{ padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="page-title">📊 Hero Dashboard</div>
          <div className="page-sub">Welcome back, <span style={{ color: 'var(--blue2)', fontWeight: 700 }}>{user?.username}</span>! Keep grinding, hero.</div>
        </div>

        {/* Level progress bar */}
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '3rem' }}>{user?.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '1.1rem' }}>{user?.username}</span>
                <span className="badge badge-gold" style={{ marginLeft: 8 }}>LVL {user?.level}</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{user?.xp} / {user?.xpToNext} XP</span>
            </div>
            <div className="xp-bar-track" style={{ height: 10 }}>
              <div className="xp-bar-fill" style={{ width: xpPct + '%' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 4 }}>{xpPct}% to Level {(user?.level || 0) + 1}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.2rem', color: 'var(--gold)' }}>{user?.charClass?.split(' ')[0]}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{user?.charClass?.split(' ')[1]}</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard label="TOTAL XP" value={(user?.xp || 0).toLocaleString()} icon="✨" color="var(--blue2)" />
          <StatCard label="GOLD" value={(user?.gold || 0).toLocaleString()} icon="🪙" color="var(--gold)" />
          <StatCard label="QUESTS DONE" value={user?.questsCompleted || 0} icon="📜" color="var(--green)" />
          <StatCard label="BOSSES SLAIN" value={user?.bossesSlain || 0} icon="⚔️" color="var(--purple)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Recent Activity */}
          <div className="card">
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue2)', marginBottom: '1rem', letterSpacing: 1 }}>⚡ RECENT ACTIVITY</div>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border2)' : 'none' }}>
                <span style={{ fontSize: '1.2rem' }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.text}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{a.time}</div>
                </div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.8rem', color: 'var(--blue2)' }}>{a.xp}</div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="card">
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue2)', marginBottom: '1rem', letterSpacing: 1 }}>🏅 ACHIEVEMENTS</div>
            {achievements.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < achievements.length - 1 ? '1px solid var(--border2)' : 'none' }}>
                <span style={{ fontSize: '1.3rem' }}>{a.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{a.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Quests */}
        <div className="card">
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue2)', marginBottom: '1rem', letterSpacing: 1 }}>🗺️ ACTIVE QUESTS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {activeQuests.map((q, i) => (
              <div key={i} style={{ background: 'var(--bg2)', borderRadius: 10, padding: 12, border: `1px solid ${q.color}33` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{q.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{q.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 8 }}>{q.desc}</div>
                <div className="xp-bar-track" style={{ height: 4 }}>
                  <div style={{ height: '100%', width: q.pct + '%', background: q.color, borderRadius: 4, transition: 'width 0.6s' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 4 }}>{q.pct}% complete</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}