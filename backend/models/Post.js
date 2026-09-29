const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: false },
    content: { type: String, required: true },
    platform: { type: String, default: 'LinkedIn', enum: ['LinkedIn', 'Instagram'] },
    topic: { type: String, required: true },
    style: { type: String, default: 'Storytelling' },
    goal: { type: String, default: 'Engagement' },
    hook: { type: String, default: '' },
    format: { type: String, default: 'post', enum: ['post', 'carousel', 'reel', 'image', 'story'] },
    caption: { type: String, default: '' },
    hashtags: [{ type: String }],
    visualPrompt: { type: String, default: '' },
    carouselSlides: [{ type: String }],
    status: { type: String, enum: ['draft', 'published', 'analyzed'], default: 'published' },
    isSeed: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
