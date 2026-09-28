const mongoose = require('mongoose');

/**
 * AudienceInsight Model
 * 
 * NOTE: This collection stores CACHED / DERIVED STATISTICAL APPLICATION METRICS only!
 * It does NOT replace or duplicate Hindsight memory.
 * 
 * Example MongoDB AudienceInsight:
 * - "AI topics have 32% higher average engagement"
 * - "Posts published on Tuesday mornings average 480 impressions"
 * 
 * In contrast, Hindsight stores qualitative, episodic agent memories such as:
 * - "This audience repeatedly responds positively to personal technical stories about AI agents."
 */
const audienceInsightSchema = new mongoose.Schema(
  {
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
