const Trend = require('../models/Trend');
const hindsightService = require('../services/hindsightService');
const llmService = require('../services/llmService');

/**
 * Trend Controller - SocialPulse
 * Manages timely industry momentum topics and connects them to Hindsight memory.
 */

// GET /api/trends
exports.getTrends = async (req, res) => {
  try {
    const { platform, category } = req.query;
    const filter = { active: true };

    if (platform && platform !== 'All') {
      filter.platform = { $in: [platform, 'All'] };
    }
    if (category) {
      filter.category = category;
    }

    const trends = await Trend.find(filter).sort({ growthScore: -1 }).lean();

    return res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error('[TrendController getTrends Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch trends', details: error.message });
  }
};

// POST /api/trends/connect-to-content
// Pipeline: Trend → Platform → Audience → Hindsight Memory → Content Strategy
exports.connectTrendToContent = async (req, res) => {
  try {
    const { 
      trendTopic, 
      platform = 'LinkedIn', 
      category = 'Tech & AI', 
      audience = 'Tech Community & Developers',
      goal = 'Engagement'
    } = req.body;

    if (!trendTopic) {
      return res.status(400).json({ error: 'trendTopic is required' });
    }

    console.log(`[SocialPulse] Connecting Trend "${trendTopic}" on ${platform} to Hindsight Memory...`);

    // 1. Recall Hindsight memories relevant to this trend and platform
    const memories = await hindsightService.recallMultiAngle({
      topic: `${platform} ${trendTopic}`,
      platform,
      audience,
      goal,
    }, 4);

    // 2. Synthesize strategic bridge via LLM
    const prompt = `You are SocialPulse's Trend-to-Content Bridge Engine.
Connect this trending topic to the user's specific audience on ${platform} using recalled Hindsight memories.

Trending Topic: "${trendTopic}" (Category: ${category})
Platform: ${platform}
Audience: ${audience}

RECALLED HINDSIGHT MEMORIES:
${memories.map((m, i) => `Memory #${i + 1}: ${m.content}`).join('\n')}

Instructions:
1. Formulate a platform-tailored hook that capitalizes on the trend without sounding generic or hype-driven.
2. Ground the post in the proven styles from Hindsight (e.g. practical breakdown, honest tradeoffs, architecture insights).
3. Do NOT fabricate personal claims, fake revenue, or unsupported statistics.

Respond strictly in valid JSON:
{
  "trendTopic": "${trendTopic}",
  "platform": "${platform}",
  "strategicAngle": "How to approach this trend authentically",
  "hook": "Compelling first line",
  "recommendedFormat": "${platform === 'Instagram' ? 'Carousel Breakdown' : 'Technical Story Post'}",
  "whyThisWorks": "Connection between the trend and what Hindsight shows this audience cares about",
  "generatedPost": "Complete ready-to-publish ${platform === 'Instagram' ? 'caption with hashtags' : 'LinkedIn post'}",
  "supportingMemories": [
    {
      "memory": "Snippet of relevant memory",
      "application": "How it shaped this post"
    }
  ]
}`;

    const content = await llmService._callLLM(
      [
        { role: 'system', content: 'You are SocialPulse AI. Return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      0.4,
      true
    );

    const parsed = JSON.parse(content);

    return res.status(200).json({
      success: true,
      data: {
        ...parsed,
        memoriesUsed: memories.map(m => ({
          id: m.id,
          content: m.content,
          relevanceScore: m.relevanceScore,
        })),
      },
    });
  } catch (error) {
    console.error('[TrendController connectTrendToContent Error]:', error);
    return res.status(500).json({ error: 'Failed to connect trend to content', details: error.message });
  }
};
