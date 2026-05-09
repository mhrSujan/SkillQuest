# ⚡ SkillQuest — Developer RPG

A gamified full-stack portfolio website where you level up by completing coding, logic, and career quests.

---

## 🗂️ Project Structure

```
skillquest/
├── package.json              ← Root: runs both servers together
├── backend/
│   ├── server.js             ← Express entry point
│   ├── .env                  ← Environment variables
│   ├── package.json
│   ├── config/
│   │   └── db.js             ← MongoDB connection
│   ├── models/
│   │   ├── User.js           ← User schema (XP, level, skills...)
│   │   ├── Quest.js          ← Quest schema
│   │   └── Battle.js         ← Boss + BattleLog schemas
│   ├── routes/
│   │   ├── auth.js           ← Register, Login, /me
│   │   ├── quests.js         ← Get quests, complete quest, seed
│   │   ├── battles.js        ← Get bosses, save result, seed
│   │   └── users.js          ← Leaderboard, unlock skill, profile
│   └── middleware/
│       ├── auth.js           ← JWT protect middleware
│       └── errorHandler.js   ← Global error handler
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js           ← React entry
        ├── index.css          ← Global RPG dark theme
        ├── App.jsx            ← Routes
        ├── context/
        │   └── AuthContext.jsx ← Global user state
        ├── utils/
        │   └── api.js         ← All API calls (axios)
        └── components/
            ├── layout/
            │   ├── AppLayout.jsx  ← Shell with sidebar
            │   └── Sidebar.jsx    ← Navigation + player card
            └── pages/
                ├── Landing.jsx
                ├── Login.jsx
                ├── Register.jsx
                ├── Dashboard.jsx
                ├── QuestBoard.jsx
                ├── BattleArena.jsx
                ├── SkillTree.jsx
                └── Leaderboard.jsx
```

---

## 🛠️ Prerequisites

Install these before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| npm | comes with Node | — |
| MongoDB | Community Edition | https://www.mongodb.com/try/download/community |
| VS Code | latest | https://code.visualstudio.com |

---

## 🚀 Setup — Step by Step

### Step 1 — Install MongoDB (Database)

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" setup)
3. Check "Install MongoDB as a Service" ✓
4. MongoDB will start automatically on your machine

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

**Verify MongoDB is running:**
```bash
mongosh
# You should see a prompt like: test>
# Type exit to quit
```

---

### Step 2 — Clone / Open the Project in VS Code

Open VS Code, then open the `skillquest/` folder:
- File → Open Folder → select `skillquest/`

Open the integrated terminal: `` Ctrl+` `` (or View → Terminal)

---

### Step 3 — Install All Dependencies

In the root terminal:

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

---

### Step 4 — Configure Environment

The `.env` file is already created at `backend/.env`. The default settings work with a local MongoDB install:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillquest
JWT_SECRET=skillquest_super_secret_key_change_in_production_2024
JWT_EXPIRE=30d
NODE_ENV=development
```

**If using MongoDB Atlas (cloud):**
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `MONGO_URI` in `.env`:
```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/skillquest
```

---

### Step 5 — Start the App

From the root `skillquest/` folder:

```bash
npm run dev
```

This starts both servers simultaneously:
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000

Your browser will open automatically at http://localhost:3000

---

### Step 6 — Seed the Database

After the app is running, open a new terminal and run these once to populate quests and bosses:

```bash
# Seed quests (10 quests)
curl -X POST http://localhost:5000/api/quests/seed

# Seed bosses (4 bosses)
curl -X POST http://localhost:5000/api/battles/seed
```

**Windows (if curl isn't available), use PowerShell:**
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/quests/seed
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/battles/seed
```

**Or use the VS Code REST Client extension** — install it, then create `seed.http`:
```
POST http://localhost:5000/api/quests/seed

###

POST http://localhost:5000/api/battles/seed
```

---

## 🗄️ Database — MongoDB Models Explained

### User Collection
Stores every player's account and game state:
```js
{
  username, email, password (hashed),
  avatar, charClass, level, xp, xpToNext, gold,
  questsCompleted, bossesSlain, currentStreak,
  unlockedSkills: [],
  inventory: [{ item, quantity }],
  achievements: [{ id, name, icon }],
  completedQuests: [ObjectId refs]
}
```

### Quest Collection
All quests available on the board:
```js
{
  title, icon, category, difficulty,
  xpReward, goldReward, description,
  codeSnippet, tags, completionCount,
  completedBy: [ObjectId refs]
}
```

### Boss Collection
All bosses in the Battle Arena:
```js
{
  name, emoji, title, maxHp,
  attack, defense, xpReward, goldReward,
  requiredSkill, requiredLevel, defeatCount
}
```

### BattleLog Collection
Records every battle for history/analytics:
```js
{
  user, boss, bossName, result,
  xpEarned, goldEarned, turnsPlayed,
  playerHpRemaining, createdAt
}
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/quests | Yes | Get all quests |
| POST | /api/quests/:id/complete | Yes | Complete a quest |
| POST | /api/quests/seed | No | Seed initial quests |
| GET | /api/battles/bosses | Yes | Get all bosses |
| POST | /api/battles/result | Yes | Save battle result |
| POST | /api/battles/seed | No | Seed initial bosses |
| GET | /api/users/leaderboard | Yes | Global leaderboard |
| POST | /api/users/unlock-skill | Yes | Unlock a skill |
| PUT | /api/users/profile | Yes | Update profile |

---

## 🔧 VS Code Extensions (Recommended)

Install these from the Extensions panel (Ctrl+Shift+X):

- **ES7+ React/Redux/React-Native snippets** — React shortcuts
- **Prettier** — Code formatting
- **REST Client** — Test API routes directly in VS Code
- **MongoDB for VS Code** — Browse your database
- **Auto Rename Tag** — HTML/JSX tag pairing
- **GitLens** — Git history

---

## 🐛 Troubleshooting

**"MongoDB connection failed"**
→ Make sure MongoDB is running: `mongosh` in terminal should connect

**"Port 3000 already in use"**
→ Kill the process: `npx kill-port 3000`

**"Cannot find module"**
→ Run `npm install` inside both `backend/` and `frontend/`

**Blank screen after login**
→ Open browser DevTools (F12) → Console tab for errors

**Quest/Boss list is empty**
→ Run the seed commands in Step 6

---

## 🚢 Deploy to Production

**Frontend** → Vercel (free):
```bash
cd frontend
npm run build
# Push to GitHub, connect repo to vercel.com
```

**Backend** → Railway or Render (free):
1. Push code to GitHub
2. Connect to railway.app or render.com
3. Add environment variables from `.env`
4. Set start command: `node server.js`

**Database** → MongoDB Atlas (free 512MB tier):
- Replace MONGO_URI in production with Atlas connection string

---

## 🌟 What This Demonstrates to Employers

✔ JWT Authentication system  
✔ MongoDB with Mongoose (full data modeling)  
✔ RESTful API design with Express  
✔ React with Context API (global state)  
✔ React Router v6 (protected routes)  
✔ Framer Motion animations  
✔ XP & leveling algorithm  
✔ Battle system logic  
✔ Skill tree with dependency unlocking  
✔ Real-time leaderboard  
✔ Full-stack deployment ready