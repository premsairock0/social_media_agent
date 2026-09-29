const mongoose = require('mongoose');

/**
 * Trend Model
 * 
 * Stores trending social topics, industry themes, and format momentum.
 * Clearly distinguishes between:
 * - 'live' (real-time ingested data)
 * - 'seed' (curated baseline trends)
 * - 'ai_suggested' (synthesized emergent trends)
 */
const trendSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    platform: { type: String, default: 'All', enum: ['LinkedIn', 'Instagram', 'All'] },
    category: { type: String, required: true }, // e.g., 'AI & Tech', 'Engineering Leadership', 'Visual Storytelling'
    growthScore: { type: Number, default: 75 }, // Momentum indicator (0-100)
    sourceType: { type: String, default: 'seed', enum: ['live', 'seed', 'ai_suggested'] },
    description: { type: String, required: true },
    suggestedAngles: [{ type: String }],
    suggestedFormats: [{ type: String }], // e.g. ['Carousel', 'Technical Story', 'Reel']
    relevanceTags: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trend', trendSchema);
