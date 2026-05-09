const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never return password in queries
    },
    avatar: {
      type: String,
      default: '🧙',
    },
    charClass: {
      type: String,
      enum: ['Frontend Wizard', 'Backend Knight', 'Data Ranger', 'DevOps Paladin', 'Full Stack Rogue', 'AI Alchemist'],
      default: 'Frontend Wizard',
    },

    // ── Progression ──
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    xpToNext: { type: Number, default: 500 },
    gold: { type: Number, default: 100 },
    totalXpEarned: { type: Number, default: 0 },

    // ── Stats ──
    questsCompleted: { type: Number, default: 0 },
    bossesSlain: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },

    // ── Skills unlocked ──
    unlockedSkills: [{ type: String }],

    // ── Inventory items ──
    inventory: [
      {
        item: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],

    // ── Achievements ──
    achievements: [
      {
        id: String,
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Completed quest IDs ──
    completedQuests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Level up method
UserSchema.methods.addXP = function (amount) {
  this.xp += amount;
  this.totalXpEarned += amount;
  while (this.xp >= this.xpToNext) {
    this.xp -= this.xpToNext;
    this.level += 1;
    this.xpToNext = Math.floor(this.xpToNext * 1.4);
  }
};

module.exports = mongoose.model('User', UserSchema);