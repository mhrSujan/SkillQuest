import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { wakeBackend } from './utils/api';
import Landing from './components/pages/Landing';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './components/pages/Dashboard';
import QuestBoard from './components/pages/QuestBoard';
import BattleArena from './components/pages/BattleArena';
import SkillTree from './components/pages/SkillTree';
import Leaderboard from './components/pages/Leaderboard';
import './index.css';

useEffect(() => { wakeBackend(); }, []);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  export default function App() {
  useEffect(() => { wakeBackend(); }, []);
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="quests" element={<QuestBoard />} />
        <Route path="battle" element={<BattleArena />} />
        <Route path="skills" element={<SkillTree />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#e2e8f0',
              border: '1px solid rgba(99,102,241,0.3)',
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 600,
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}