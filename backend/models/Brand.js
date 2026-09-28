const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    industry: { type: String, default: 'Tech / AI' },
    targetAudience: { type: String, default: 'Founders, Developers, Tech Leaders' },
    tone: { type: String, default: 'Professional yet conversational, insightful, narrative-driven' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', brandSchema);
