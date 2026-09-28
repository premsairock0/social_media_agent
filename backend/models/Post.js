const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: false },
    content: { type: String, required: true },
    platform: { type: String, default: 'LinkedIn', enum: ['LinkedIn'] },
    topic: { type: String, required: true },
    style: { type: String, default: 'Storytelling' },
    goal: { type: String, default: 'Engagement' },
    hook: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'analyzed'], default: 'published' },
    isSeed: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
