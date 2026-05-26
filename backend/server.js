const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : true,  // allows any origin in dev
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Routes ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quests', require('./routes/quests'));
app.use('/api/battles', require('./routes/battles'));
app.use('/api/users', require('./routes/users'));

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '⚡ SkillQuest API is running!' });
});

// ── Error handler (must be last) ──
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n⚡ SkillQuest API running on http://localhost:${PORT}`);
  console.log(`🗄️  MongoDB: ${process.env.MONGO_URI}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}\n`);
});