import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { login } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data.token, data.user);
      toast.success(`⚡ Welcome back, ${data.user.username}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
        padding: '2.5rem', width: '100%', maxWidth: 420, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--blue), var(--purple), var(--cyan))' }} />
        
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.4rem', fontWeight: 700, color: 'var(--blue2)', marginBottom: '0.3rem' }}>
          ⚔️ RETURN TO REALM
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text3)', marginBottom: '1.5rem' }}>Continue your hero's journey</div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text3)', letterSpacing: 1, marginBottom: 6, fontFamily: "'Share Tech Mono', monospace" }}>USERNAME</label>
            <input className="form-input" type="text" placeholder="Your hero name" required
              value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text3)', letterSpacing: 1, marginBottom: 6, fontFamily: "'Share Tech Mono', monospace" }}>PASSWORD</label>
            <input className="form-input" type="password" placeholder="••••••••" required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Entering...' : '⚡ ENTER THE REALM'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text3)' }}>
          New hero? <Link to="/register" style={{ color: 'var(--blue2)', textDecoration: 'none', fontWeight: 700 }}>Create Account</Link>
        </div>
        <div style={{ marginTop: '8px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text3)', textDecoration: 'none', fontSize: '0.85rem' }}>← Back to Landing</Link>
        </div>
      </motion.div>
    </div>
  );
}