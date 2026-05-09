import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sq_token');
      localStorage.removeItem('sq_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// ── Quests ──
export const getQuests = (category) => api.get('/quests', { params: { category } });
export const completeQuest = (questId) => api.post(`/quests/${questId}/complete`);
export const seedQuests = () => api.post('/quests/seed');

// ── Battles ──
export const getBosses = () => api.get('/battles/bosses');
export const saveBattleResult = (data) => api.post('/battles/result', data);
export const seedBosses = () => api.post('/battles/seed');

// ── Users ──
export const getLeaderboard = (sort) => api.get('/users/leaderboard', { params: { sort } });
export const unlockSkill = (skillId, cost) => api.post('/users/unlock-skill', { skillId, cost });
export const updateProfile = (data) => api.put('/users/profile', data);

export default api;