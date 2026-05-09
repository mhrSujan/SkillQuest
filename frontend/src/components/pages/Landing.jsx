import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const stats = [
  { num: '1,247', lbl: 'HEROES' },
  { num: '8,934', lbl: 'QUESTS DONE' },
  { num: '342', lbl: 'BOSSES SLAIN' },
  { num: '99.2%', lbl: 'HIRED RATE' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f2a 50%, #0a0a0f 100%)',
      position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '2rem',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.4,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'relative', zIndex: 2, maxWidth: 800 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'inline-block', background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.4)', color: 'var(--blue2)',
            fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
            letterSpacing: 3, padding: '6px 20px', borderRadius: 20, marginBottom: '1.5rem',
          }}
        >
          ⚡ DEVELOPER RPG v2.0
        </motion.div>

        <h1 style={{
          fontFamily: "'Orbitron', monospace", fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 900, lineHeight: 1.1, marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #fff 0%, #818cf8 40%, #a855f7 70%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          SKILL<br />QUEST
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text2)', marginBottom: '0.5rem', letterSpacing: 2, fontWeight: 300 }}>
          LEVEL UP YOUR CAREER
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--text3)', marginBottom: '2.5rem', maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Transform your dev journey into an epic RPG. Complete coding quests, battle interview bosses, and unlock legendary skills.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <button className="btn-primary" onClick={() => navigate('/register')}>⚔️ START GAME</button>
          <button className="btn-secondary" onClick={() => navigate('/login')}>🔑 LOGIN</button>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {stats.map((s) => (
            <div key={s.lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '2rem', fontWeight: 900, color: 'var(--gold)' }}>{s.num}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)', letterSpacing: 1 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}