import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sq_token');
    const saved = localStorage.getItem('sq_user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      // Silently refresh from server
      getMe()
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('sq_user', JSON.stringify(res.data.user));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('sq_token', token);
    localStorage.setItem('sq_user', JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('sq_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('sq_token');
    localStorage.removeItem('sq_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};