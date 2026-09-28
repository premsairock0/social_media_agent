const hindsightService = require('../services/hindsightService');
const llmService = require('../services/llmService');
const Brand = require('../models/Brand');

/**
 * Strategy Controller
 * 
 * Pipeline:
 * user request
 *      ↓
 * Hindsight RECALL (retrieve relevant experiences)
 *      ↓
 * LLM REASON (evaluate memories + brand profile)
 *      ↓
 * Strategy & LinkedIn Post Output
 */
exports.generateStrategy = async (req, res) => {
  try {
    const { idea, goal = 'Engagement', targetAudience = 'Tech Founders & Developers', brandId } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Content idea is required.' });
    }

    // Optional: Retrieve brand context from MongoDB
    let brand = null;
    if (brandId) {
      brand = await Brand.findById(brandId);
    }

    // 1. RECALL relevant memories from Hindsight
    const recalledMemories = await hindsightService.recallMemory({ idea, goal });

    // 2. Pass context to LLM to formulate tailored strategy and write post
    const strategyResult = await llmService.generateStrategy({
      idea,
      goal,
      audience: targetAudience,
      memories: recalledMemories,
      brand: brand || { name: 'Acme AI' },
    });

    return res.status(200).json({
      success: true,
      data: {
        idea,
        goal,
        ...strategyResult,
      },
    });
  } catch (error) {
    console.error('[StrategyController Error]:', error);
    return res.status(500).json({ error: 'Failed to generate strategy', details: error.message });
  }
};
