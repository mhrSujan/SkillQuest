import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/quests', icon: '📜', label: 'Quest Board' },
  { path: '/battle', icon: '⚔️', label: 'Battle Arena' },
  { path: '/skills', icon: '🌲', label: 'Skill Tree' },
  { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
];

const styles = {
  sidebar: {
    width: 220, minHeight: '100vh', background: 'var(--bg2)',
    borderRight: '1px solid var(--border2)', display: 'flex',
    flexDirection: 'column', padding: '1.5rem 1rem', flexShrink: 0,
  },
  logo: {
    fontFamily: "'Orbitron', monospace", fontSize: '0.85rem', fontWeight: 900,
    background: 'linear-gradient(135deg, #818cf8, #a855f7)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    marginBottom: '1.5rem', letterSpacing: 2,
  },
  playerCard: {
    background: 'var(--surface)', border: '1px solid var(--border2)',
    borderRadius: 12, padding: 12, marginBottom: '1.5rem', textAlign: 'center',
  },
  avatar: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--blue), var(--purple))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.6rem', margin: '0 auto 8px',
    border: '2px solid rgba(99,102,241,0.4)',
  },
  navLabel: {
    fontSize: '0.65rem', color: 'var(--text3)', letterSpacing: 2,
    padding: '0 8px', marginBottom: 4, fontFamily: "'Share Tech Mono', monospace",
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
    borderRadius: 8, color: 'var(--text3)', fontSize: '0.95rem', fontWeight: 600,
    transition: 'all 0.2s', marginBottom: 2, textDecoration: 'none', width: '100%',
  },
  goldBox: {
    marginTop: 'auto', background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10,
    padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8,
  },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const xpPct = user ? Math.min(100, Math.round((user.xp / user.xpToNext) * 100)) : 0;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>⚡ SKILLQUEST</div>

      <div style={styles.playerCard}>
        <div style={styles.avatar}>{user?.avatar || '🧙'}</div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.username}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--blue2)', letterSpacing: 1, fontFamily: "'Share Tech Mono', monospace" }}>
          {user?.charClass?.toUpperCase()}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--gold)', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontFamily: "'Orbitron', monospace", fontWeight: 700, marginTop: 6 }}>
          LVL {user?.level}
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 3 }}>
            <span>XP</span><span>{user?.xp}/{user?.xpToNext}</span>
          </div>
          <div className="xp-bar-track"><div className="xp-bar-fill" style={{ width: xpPct + '%' }} /></div>
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={styles.navLabel}>NAVIGATE</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: isActive ? 'var(--blue2)' : 'var(--text3)',
            })}
          >
            <span style={{ fontSize: '1rem', width: 18, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <div style={styles.navLabel}>ACCOUNT</div>
        <button onClick={() => { logout(); navigate('/'); }}
          style={{ ...styles.navItem, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--red)' }}>
          <span>🚪</span> Logout
        </button>
      </div>

      <div style={styles.goldBox}>
        <span style={{ fontSize: '1.2rem' }}>🪙</span>
        <div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1rem', fontWeight: 700, color: 'var(--gold)' }}>
            {(user?.gold || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>GOLD</div>
        </div>
      </div>
    </aside>
  );
}