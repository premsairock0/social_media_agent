const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');
const UserMemory = require('../models/UserMemory');
const llmService = require('../services/llmService');
const hindsightService = require('../services/hindsightService');

/**
 * Chat with SocialPulse AI Agent
 * Protected route: Only authenticated users can access the chatbot/agent
 */
exports.chat = async (req, res) => {
  try {
    const { message, history = [], platform = 'LinkedIn' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    const userId = req.user._id;

    // 1. Fetch user-specific recent posts
    const userPosts = await Post.find({ userId }).sort({ createdAt: -1 }).limit(5).lean();
    
    // Enrich with metrics
    const postsWithMetrics = await Promise.all(
      userPosts.map(async (p) => {
        const metric = await PostMetric.findOne({ postId: p._id }).sort({ recordedAt: -1 }).lean();
        return {
          ...p,
          metrics: metric || { engagementRate: 0 },
        };
      })
    );

    // 2. Fetch user-specific memories
    let memories = await UserMemory.find({ userId }).sort({ createdAt: -1 }).limit(10).lean();

    // If user has no local memories yet, attempt Hindsight recall for the user's query
    if (memories.length === 0) {
      try {
        const recalled = await hindsightService.recallMemory(message, 3);
        memories = recalled.map((m) => ({ content: m.content }));
      } catch (e) {
        // Fallback silently
      }
    }

    // 3. Generate response via LLM
    const reply = await llmService.chatWithAgent({
      message: message.trim(),
      history,
      user: req.user,
      recentPosts: postsWithMetrics,
      memories,
      platform,
    });

    return res.status(200).json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString(),
        user: {
          name: req.user.name,
          email: req.user.email,
        },
      },
    });
  } catch (error) {
    console.error('[AgentController Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate agent response.',
      details: error.message,
    });
  }
};
