import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { register } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CLASSES = [
  { name: 'Frontend Wizard', icon: '🧙', desc: 'Frontend' },
  { name: 'Backend Knight', icon: '⚔️', desc: 'Backend' },
  { name: 'Data Ranger', icon: '🏹', desc: 'Data' },
  { name: 'DevOps Paladin', icon: '🛡️', desc: 'DevOps' },
  { name: 'Full Stack Rogue', icon: '🗡️', desc: 'Full Stack' },
  { name: 'AI Alchemist', icon: '⚗️', desc: 'AI/ML' },
];

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [selectedClass, setSelectedClass] = useState('Frontend Wizard');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const selectedIcon = CLASSES.find((c) => c.name === selectedClass)?.icon || '🧙';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await register({ ...form, charClass: selectedClass, avatar: selectedIcon });
      loginUser(data.token, data.user);
      toast.success(`🌟 Hero created! Welcome, ${data.user.username}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
        padding: '2.5rem', width: '100%', maxWidth: 460, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--blue), var(--purple), var(--cyan))' }} />

        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.3rem', fontWeight: 700, color: 'var(--blue2)', marginBottom: '0.3rem' }}>
          🌟 CREATE YOUR HERO
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text3)', marginBottom: '1.5rem' }}>Begin your legendary career journey</div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'USERNAME', key: 'username', type: 'text', placeholder: 'Choose your hero name' },
            { label: 'EMAIL', key: 'email', type: 'email', placeholder: 'hero@realm.dev' },
            { label: 'PASSWORD', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
          ].map((field) => (
            <div key={field.key} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text3)', letterSpacing: 1, marginBottom: 6, fontFamily: "'Share Tech Mono', monospace" }}>{field.label}</label>
              <input className="form-input" type={field.type} placeholder={field.placeholder} required
                value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
            </div>
          ))}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text3)', letterSpacing: 1, marginBottom: 8, fontFamily: "'Share Tech Mono', monospace" }}>CHOOSE CLASS</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {CLASSES.map((cls) => (
                <div key={cls.name}
                  onClick={() => setSelectedClass(cls.name)}
                  style={{
                    background: selectedClass === cls.name ? 'rgba(99,102,241,0.15)' : 'var(--bg2)',
                    border: `1px solid ${selectedClass === cls.name ? 'var(--blue)' : 'var(--border2)'}`,
                    borderRadius: 8, padding: '10px 6px', cursor: 'pointer',
                    textAlign: 'center', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{cls.icon}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)' }}>{cls.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating hero...' : '⚔️ CREATE HERO'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text3)' }}>
          Already a hero? <Link to="/login" style={{ color: 'var(--blue2)', textDecoration: 'none', fontWeight: 700 }}>Login</Link>
        </div>
        <div style={{ marginTop: '8px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text3)', textDecoration: 'none', fontSize: '0.85rem' }}>← Back to Landing</Link>
        </div>
      </motion.div>
    </div>
  );
}