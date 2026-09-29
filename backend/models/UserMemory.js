const mongoose = require('mongoose');

const userMemorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      default: 'General',
    },
    style: {
      type: String,
      default: 'Storytelling',
    },
    outcome: {
      type: String,
      default: 'neutral',
    },
    metrics: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
      engagementRate: { type: Number, default: 0 },
    },
    tags: [{ type: String }],
    hindsightId: {
      type: String,
    },
    factType: {
      type: String,
      default: 'learned_experience',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserMemory', userMemorySchema);
