const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    
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
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { content, topic, style, goal, hook, brandId, isSeed = false } = req.body;
    const post = new Post({ content, topic, style, goal, hook, brandId, isSeed });
    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const hindsightService = require('../services/hindsightService');
    const posts = await Post.find();
    const metrics = await PostMetric.find();

    const totalPosts = posts.length;
    let avgEngagement = 0;
    if (metrics.length > 0) {
      const sum = metrics.reduce((acc, m) => acc + (Number(m.engagementRate) || 0), 0);
      avgEngagement = Number((sum / metrics.length).toFixed(2));
    }

    // Aggregate by style
    const styleAgg = {};
    for (const p of posts) {
      const metric = metrics.find((m) => m.postId && m.postId.toString() === p._id.toString());
      if (metric) {
        if (!styleAgg[p.style]) styleAgg[p.style] = { totalRate: 0, count: 0 };
        styleAgg[p.style].totalRate += Number(metric.engagementRate) || 0;
        styleAgg[p.style].count += 1;
      }
    }

    let bestStyle = 'Technical Storytelling';
    let maxAvg = 0;
    for (const [style, data] of Object.entries(styleAgg)) {
      const avg = data.totalRate / data.count;
      if (avg > maxAvg) {
        maxAvg = avg;
        bestStyle = style;
      }
    }

    // Fetch real memories from Hindsight (using limit 100 for comprehensive count)
    const memories = await hindsightService.listMemories(100);
    const totalMemories = memories.length;

    const recentLearnings = memories.slice(0, 5).map((m) => ({
      id: m.id,
      text: m.content,
      date: m.date,
      type: m.factType,
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalPosts,
        avgEngagement,
        bestContentType: bestStyle,
        bestContentAvg: Number(maxAvg.toFixed(2)),
        totalMemories,
        benchmarkRate: 2.5,
        recentLearnings,
        bankId: hindsightService.bankId,
      },
    });
  } catch (error) {
    console.error('[DashboardStats Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
  }
};
