const mongoose = require('mongoose');

const postMetricSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 }, // ((likes + comments + shares) / impressions) * 100
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PostMetric', postMetricSchema);
