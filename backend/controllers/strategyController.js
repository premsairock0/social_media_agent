const hindsightService = require('../services/hindsightService');
const llmService = require('../services/llmService');
const Brand = require('../models/Brand');
const Post = require('../models/Post');
const Trend = require('../models/Trend');

/**
 * Strategy Controller - SocialPulse
 * 
 * Pipeline:
 * User Request + Platform Selection
 *      ↓
 * Hindsight MULTI-ANGLE RECALL (content, platform, engagement, audience)
 *      ↓
 * LLM REASONING & STRATEGY SYNTHESIS
 *      ↓
 * Tailored Social Content / "What Should I Post?" Recommendation
 */

/**
 * Generate platform-specific strategy and post copy
 */
exports.generateStrategy = async (req, res) => {
  try {
    const { 
      idea, 
      platform = 'LinkedIn', 
      goal = 'Engagement', 
      targetAudience = 'Tech Founders & Developers', 
      brandId 
    } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Content idea is required.' });
    }

    // Optional: Retrieve brand context from MongoDB
    let brand = null;
    if (brandId) {
      brand = await Brand.findById(brandId);
    }

    // 1. RECALL multi-angle relevant memories from Hindsight
    const recalledMemories = await hindsightService.recallMultiAngle({
      topic: idea,
      platform,
      audience: targetAudience,
      goal,
    });

    // 2. Pass context to LLM to formulate tailored strategy and write post
    const strategyResult = await llmService.generateStrategy({
      idea,
      platform,
      goal,
      audience: targetAudience,
      memories: recalledMemories,
      brand: brand || { name: 'Acme AI' },
    });

    return res.status(200).json({
      success: true,
      data: {
        idea,
        platform,
        goal,
        ...strategyResult,
      },
    });
  } catch (error) {
    console.error('[StrategyController generateStrategy Error]:', error);
    return res.status(500).json({ error: 'Failed to generate strategy', details: error.message });
  }
};

/**
 * "What Should I Post?" Hero Intelligence Action
 */
exports.whatToPost = async (req, res) => {
  try {
    const { 
      platform = 'LinkedIn', 
      audience = 'Tech Community & Developers', 
      goal = 'Engagement' 
    } = req.body;

    console.log(`[SocialPulse] Running "What Should I Post?" for platform: ${platform}...`);

    // 1. Fetch recent posts from MongoDB to understand historical coverage
    const recentPosts = await Post.find({ platform })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // 2. Fetch relevant trends for this platform
    const trends = await Trend.find({ 
      platform: { $in: [platform, 'All'] },
      active: true 
    })
      .sort({ growthScore: -1 })
      .limit(5)
      .lean();

    // 3. Multi-angle Hindsight recall on high-performing topics and formats
    const memories = await hindsightService.recallMultiAngle({
      topic: `${platform} highest engagement formats and topics`,
      platform,
      audience,
      goal,
    }, 4);

    // 4. Synthesize recommendation via LLM
    const recommendation = await llmService.generateWhatToPost({
      platform,
      recentPosts,
      trends,
      memories,
      audience,
      goal,
    });

    return res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    console.error('[StrategyController whatToPost Error]:', error);
    return res.status(500).json({ error: 'Failed to determine what to post', details: error.message });
  }
};

/**
 * Content Studio Action
 * (Generate caption, improve hook, generate CTA, suggest hashtags, carousel, reel, etc.)
 */
exports.studioAction = async (req, res) => {
  try {
    const { 
      action, 
      platform = 'LinkedIn', 
      input = '', 
      context = '', 
      style = 'Professional', 
      goal = 'Engagement' 
    } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Studio action type is required.' });
    }

    // Recall relevant memories based on input topic and action
    const memories = await hindsightService.recallMemory({
      idea: `${platform} ${action} ${input}`.trim(),
      goal,
    }, 4);

    const result = await llmService.generateStudioAction({
      action,
      platform,
      input,
      context,
      style,
      goal,
      memories,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[StrategyController studioAction Error]:', error);
    return res.status(500).json({ error: 'Failed to execute studio action', details: error.message });
  }
};
