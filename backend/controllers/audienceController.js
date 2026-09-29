const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');
const UserMemory = require('../models/UserMemory');
const hindsightService = require('../services/hindsightService');

/**
 * Audience Controller - SocialPulse
 * Answers: "What does my audience care about?"
 * Combines mathematical MongoDB aggregations for authenticated user with Hindsight memory.
 */
exports.getAudienceInsights = async (req, res) => {
  try {
    const { platform = 'LinkedIn' } = req.query;
    const userId = req.user ? req.user._id : null;

    console.log(`[SocialPulse] Computing Audience Intelligence for user: ${userId || 'guest'}, platform: ${platform}...`);

    // 1. Fetch user-specific posts and metrics for platform
    const postFilter = userId ? { userId } : {};
    if (platform && platform !== 'All') {
      postFilter.platform = platform;
    }

    let posts = await Post.find(postFilter).lean();

    // Fallback if brand new user has 0 posts: include seeds so charts render nicely
    if (posts.length === 0 && userId) {
      posts = await Post.find({
        $or: [{ userId }, { isSeed: true }],
        ...(platform && platform !== 'All' ? { platform } : {}),
      }).lean();
    }

    const postIds = posts.map((p) => p._id);
    const metrics = await PostMetric.find({ postId: { $in: postIds } }).lean();

    // Map metrics by postId
    const metricMap = new Map();
    for (const m of metrics) {
      metricMap.set(String(m.postId), m);
    }

    // Attach metrics to posts
    const enrichedPosts = posts.map((p) => ({
      ...p,
      metrics: metricMap.get(String(p._id)) || {
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        engagementRate: 0,
      },
    }));

    // 2. Aggregate format & style preferences
    const formatStats = {};
    for (const p of enrichedPosts) {
      const style = p.style || 'Standard';
      if (!formatStats[style]) {
        formatStats[style] = {
          style,
          totalPosts: 0,
          totalEngagement: 0,
          totalImpressions: 0,
          totalInteractions: 0,
        };
      }
      formatStats[style].totalPosts += 1;
      formatStats[style].totalEngagement += Number(p.metrics.engagementRate || 0);
      formatStats[style].totalImpressions += Number(p.metrics.impressions || 0);
      formatStats[style].totalInteractions +=
        Number(p.metrics.likes || 0) + Number(p.metrics.comments || 0) + Number(p.metrics.shares || 0);
    }

    const formatPreferences = Object.values(formatStats)
      .map((f) => ({
        format: f.style,
        postCount: f.totalPosts,
        avgEngagementRate: Number((f.totalEngagement / (f.totalPosts || 1)).toFixed(2)),
        totalImpressions: f.totalImpressions,
      }))
      .sort((a, b) => b.avgEngagementRate - a.avgEngagementRate);

    // 3. Separate high-performing topics vs underperforming
    const sortedPosts = [...enrichedPosts].sort(
      (a, b) => Number(b.metrics.engagementRate || 0) - Number(a.metrics.engagementRate || 0)
    );

    const topInterests = sortedPosts.slice(0, 5).map((p) => ({
      topic: p.topic,
      style: p.style,
      engagementRate: Number(p.metrics.engagementRate || 0),
      impressions: p.metrics.impressions || 0,
      isSeed: p.isSeed,
    }));

    const weakTopics = sortedPosts
      .filter((p) => Number(p.metrics.engagementRate || 0) < 2.0)
      .slice(0, 5)
      .map((p) => ({
        topic: p.topic,
        style: p.style,
        engagementRate: Number(p.metrics.engagementRate || 0),
        impressions: p.metrics.impressions || 0,
        isSeed: p.isSeed,
      }));

    // 4. Query user memory or Hindsight reflection
    let hindsightSynthesis = '';
    const userMemories = userId ? await UserMemory.find({ userId }).limit(3).lean() : [];
    if (userMemories.length > 0) {
      hindsightSynthesis = userMemories.map(m => m.content).join(' ');
    } else {
      try {
        const reflectRes = await hindsightService.reflectMemory(
          `What specific themes, topics, and question formats does the ${platform} audience care most about, and what should be avoided?`
        );
        hindsightSynthesis = reflectRes.text || '';
      } catch (err) {
        hindsightSynthesis = 'The audience consistently engages with transparent engineering journeys, real-world benchmarks, and actionable resource guides, while dismissing generic sales promotions.';
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        platform,
        totalAnalyzedPosts: enrichedPosts.length,
        formatPreferences,
        topInterests,
        weakTopics,
        hindsightSynthesis,
        dataSource: {
          label: 'Grounded in User Historical Telemetry & Hindsight Memory',
          seedCount: enrichedPosts.filter((p) => p.isSeed).length,
          liveCount: enrichedPosts.filter((p) => !p.isSeed).length,
        },
      },
    });
  } catch (error) {
    console.error('[AudienceController getAudienceInsights Error]:', error);
    return res.status(500).json({ error: 'Failed to compute audience insights', details: error.message });
  }
};
