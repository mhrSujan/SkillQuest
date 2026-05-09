const mongoose = require('mongoose');

const BossSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emoji: { type: String, default: '👺' },
    title: { type: String, required: true },
    maxHp: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, default: 5 },
    xpReward: { type: Number, required: true },
    goldReward: { type: Number, required: true },
    requiredSkill: { type: String, default: 'None' },
    requiredLevel: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    defeatedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    defeatCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BattleLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    boss: { type: mongoose.Schema.Types.ObjectId, ref: 'Boss', required: true },
    bossName: String,
    result: { type: String, enum: ['victory', 'defeat'], required: true },
    xpEarned: { type: Number, default: 0 },
    goldEarned: { type: Number, default: 0 },
    turnsPlayed: { type: Number, default: 0 },
    playerHpRemaining: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Boss = mongoose.model('Boss', BossSchema);
const BattleLog = mongoose.model('BattleLog', BattleLogSchema);

module.exports = { Boss, BattleLog };