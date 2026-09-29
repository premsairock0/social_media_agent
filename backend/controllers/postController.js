const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');
const UserMemory = require('../models/UserMemory');
const hindsightService = require('../services/hindsightService');

/**
 * GET /api/posts
 * Fetch user-specific posts (filterable by platform)
 */
exports.getPosts = async (req, res) => {
  try {
    const { platform } = req.query;
    const userId = req.user ? req.user._id : null;

    // Filter by user ID if authenticated
    const filter = userId ? { userId } : {};

    if (platform && platform !== 'All') {
      filter.platform = platform;
    }

    let posts = await Post.find(filter).sort({ createdAt: -1 });

    // Fallback if brand new user has 0 posts: also show public seeds so dashboard isn't completely empty
    if (posts.length === 0 && userId) {
      posts = await Post.find({
        $or: [{ userId }, { isSeed: true }],
        ...(platform && platform !== 'All' ? { platform } : {}),
      }).sort({ createdAt: -1 });
    }
    
    // Fetch metrics for each post
    const postsWithMetrics = await Promise.all(
      posts.map(async (p) => {
        const metric = await PostMetric.findOne({ postId: p._id }).sort({ recordedAt: -1 });
        return {
          ...p.toObject(),
          isSeed: p.isSeed === true,
          metrics: metric || { likes: 0, comments: 0, shares: 0, impressions: 0, engagementRate: 0 },
        };
      })
    );

    res.status(200).json({ success: true, count: postsWithMetrics.length, data: postsWithMetrics });
  } catch (error) {
    console.error('[getPosts Error]:', error);
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
};

/**
 * POST /api/posts
 * Create new user-specific post
 */
exports.createPost = async (req, res) => {
  try {
    const { 
      content, 
      topic, 
      style, 
      goal, 
      hook, 
      platform = 'LinkedIn', 
      format = 'post',
      caption,
      hashtags,
      visualPrompt,
      carouselSlides,
      brandId, 
      isSeed = false 
    } = req.body;

    const post = new Post({ 
      userId: req.user ? req.user._id : undefined,
      content, 
      topic, 
      style, 
      goal, 
      hook, 
      platform,
      format,
      caption: caption || content,
      hashtags: hashtags || [],
      visualPrompt,
      carouselSlides,
      brandId, 
      isSeed 
    });

    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('[createPost Error]:', error);
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
};

/**
 * GET /api/posts/stats
 * Dashboard aggregated stats scoped to authenticated user
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const { platform } = req.query;
    const userId = req.user ? req.user._id : null;
    
    const postFilter = userId ? { userId } : {};
    if (platform && platform !== 'All') {
      postFilter.platform = platform;
    }

    let posts = await Post.find(postFilter);

    // If new user has no posts yet, fallback to seed posts to calculate baseline
    if (posts.length === 0 && userId) {
      posts = await Post.find({
        $or: [{ userId }, { isSeed: true }],
        ...(platform && platform !== 'All' ? { platform } : {}),
      });
    }

    const postIds = posts.map(p => p._id);
    const metrics = await PostMetric.find(postIds.length > 0 ? { postId: { $in: postIds } } : {});

    const totalPosts = posts.length;
    let avgEngagement = 0;
    if (metrics.length > 0) {
      const sum = metrics.reduce((acc, m) => acc + (Number(m.engagementRate) || 0), 0);
      avgEngagement = Number((sum / metrics.length).toFixed(2));
    }

    // Aggregate by style for user
    const styleAgg = {};
    for (const p of posts) {
      const metric = metrics.find((m) => m.postId && m.postId.toString() === p._id.toString());
      if (metric) {
        if (!styleAgg[p.style]) styleAgg[p.style] = { totalRate: 0, count: 0 };
        styleAgg[p.style].totalRate += Number(metric.engagementRate) || 0;
        styleAgg[p.style].count += 1;
      }
    }

    let bestStyle = platform === 'Instagram' ? 'Visual Carousel' : 'Technical Storytelling';
    let maxAvg = 0;
    for (const [style, data] of Object.entries(styleAgg)) {
      const avg = data.totalRate / (data.count || 1);
      if (avg > maxAvg) {
        maxAvg = avg;
        bestStyle = style;
      }
    }

    // Fetch user-specific memories from MongoDB
    let userMemories = userId ? await UserMemory.find({ userId }).sort({ createdAt: -1 }).limit(10) : [];
    
    // If user has none yet, fetch from Hindsight bank
    let totalMemories = userMemories.length;
    let recentLearnings = [];

    if (totalMemories > 0) {
      recentLearnings = userMemories.slice(0, 5).map((m) => ({
        id: m._id,
        text: m.content,
        date: m.createdAt,
        type: m.factType || 'learned_experience',
      }));
    } else {
      const cloudMemories = await hindsightService.listMemories(100);
      totalMemories = cloudMemories.length;
      recentLearnings = cloudMemories.slice(0, 5).map((m) => ({
        id: m.id,
        text: m.content,
        date: m.date,
        type: m.factType,
      }));
    }

    return res.status(200).json({
      success: true,
      data: {
        platform: platform || 'All',
        totalPosts,
        avgEngagement,
        bestContentType: bestStyle,
        bestContentAvg: Number(maxAvg.toFixed(2)),
        totalMemories,
        benchmarkRate: 2.5,
        recentLearnings,
        bankId: hindsightService.bankId,
        user: req.user ? { name: req.user.name, email: req.user.email } : null,
      },
    });
  } catch (error) {
    console.error('[DashboardStats Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
  }
};
