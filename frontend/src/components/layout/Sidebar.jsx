import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/quests', icon: '📜', label: 'Quests' },
  { path: '/battle', icon: '⚔️', label: 'Battle' },
  { path: '/skills', icon: '🌲', label: 'Skills' },
  { path: '/leaderboard', icon: '🏆', label: 'Ranks' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const xpPct = user ? Math.min(100, Math.round((user.xp / user.xpToNext) * 100)) : 0;

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="sidebar-desktop">
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.85rem', fontWeight: 900, background: 'linear-gradient(135deg, #818cf8, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1.5rem', letterSpacing: 2 }}>
          ⚡ SKILLQUEST
        </div>

        {/* Player card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 12, padding: 12, marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 8px', border: '2px solid rgba(99,102,241,0.4)' }}>
            {user?.avatar || '🧙'}
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.username}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--blue2)', letterSpacing: 1, fontFamily: "'Share Tech Mono', monospace" }}>{user?.charClass?.toUpperCase()}</div>
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

        {/* Nav */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text3)', letterSpacing: 2, padding: '0 8px', marginBottom: 4, fontFamily: "'Share Tech Mono', monospace" }}>NAVIGATE</div>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                borderRadius: 8, fontSize: '0.95rem', fontWeight: 600,
                transition: 'all 0.2s', marginBottom: 2, textDecoration: 'none', width: '100%',
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
          <div style={{ fontSize: '0.65rem', color: 'var(--text3)', letterSpacing: 2, padding: '0 8px', marginBottom: 4, fontFamily: "'Share Tech Mono', monospace" }}>ACCOUNT</div>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: '0.95rem', fontWeight: 600, width: '100%' }}>
            <span>🚪</span> Logout
          </button>
        </div>

        <div style={{ marginTop: 'auto', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>🪙</span>
          <div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1rem', fontWeight: 700, color: 'var(--gold)' }}>{(user?.gold || 0).toLocaleString()}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>GOLD</div>
          </div>
        </div>
      </aside>

      {/* ── MOBILE TOP NAV ── */}
      <nav className="mobile-nav">
        {/* Top bar */}
        <div className="mobile-nav-bar">
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #818cf8, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 2 }}>
            ⚡ SKILLQUEST
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.75rem', color: 'var(--gold)' }}>🪙 {(user?.gold || 0).toLocaleString()}</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.7rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--gold)', borderRadius: 20, padding: '2px 8px' }}>LVL {user?.level}</div>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: '1px solid var(--border2)', borderRadius: 6, color: 'var(--text)', cursor: 'pointer', padding: '4px 8px', fontSize: '1rem' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Nav links row */}
        <div className="mobile-nav-links">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '6px 10px', borderRadius: 8, textDecoration: 'none', fontSize: '0.65rem',
                fontWeight: 700, letterSpacing: 0.5, fontFamily: "'Rajdhani', sans-serif",
                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: isActive ? 'var(--blue2)' : 'var(--text3)',
                flexShrink: 0,
              })}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 10px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 0.5, fontFamily: "'Rajdhani', sans-serif", flexShrink: 0 }}>
            <span style={{ fontSize: '1.1rem' }}>🚪</span>
            Logout
          </button>
        </div>

        {/* Dropdown menu (hamburger) */}
        {menuOpen && (
          <div className="mobile-dropdown" onClick={() => setMenuOpen(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border2)' }}>
              <div style={{ fontSize: '2rem' }}>{user?.avatar || '🧙'}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{user?.username}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--blue2)', fontFamily: "'Share Tech Mono', monospace" }}>{user?.charClass?.toUpperCase()}</div>
              </div>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 4 }}>
                <span>XP Progress</span><span>{user?.xp} / {user?.xpToNext}</span>
              </div>
              <div className="xp-bar-track"><div className="xp-bar-fill" style={{ width: xpPct + '%' }} /></div>
            </div>
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>🪙 {(user?.gold || 0).toLocaleString()} GOLD</div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}