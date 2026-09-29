const mongoose = require('mongoose');

const audienceInsightSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    category: { type: String, required: true }, // e.g., 'topic_stat', 'format_stat', 'engagement_benchmark'
    metricKey: { type: String, required: true },
    metricValue: { type: mongoose.Schema.Types.Mixed, required: true },
    summary: { type: String, required: true }, // Derived statistical sentence
    calculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AudienceInsight', audienceInsightSchema);
