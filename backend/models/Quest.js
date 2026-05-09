const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quest title is required'],
      trim: true,
    },
    icon: { type: String, default: '⚔️' },
    category: {
      type: String,
      enum: ['coding', 'logic', 'career', 'data', 'project'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'legendary'],
      required: true,
    },
    xpReward: { type: Number, required: true },
    goldReward: { type: Number, required: true },
    description: { type: String, required: true },
    codeSnippet: { type: String, default: '' },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    completionCount: { type: Number, default: 0 },
    requiredLevel: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quest', QuestSchema);