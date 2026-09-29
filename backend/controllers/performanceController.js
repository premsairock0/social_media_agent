const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');
const UserMemory = require('../models/UserMemory');
const analyticsService = require('../services/analyticsService');
const llmService = require('../services/llmService');
const hindsightService = require('../services/hindsightService');

/**
 * Performance Controller
 * User-isolated performance feedback and episodic memory retainment
 */
exports.recordAndLearn = async (req, res) => {
  try {
    const { postId, likes = 0, comments = 0, shares = 0, impressions = 0 } = req.body;
    const userId = req.user._id;

    // 1. Calculate engagement rate using Analytics Service
    const engagementRate = analyticsService.calculateEngagementRate({
      likes,
      comments,
      shares,
      impressions,
    });

    // 2. Fetch or create post in MongoDB scoped to this user
    let post = null;
    if (postId) {
      post = await Post.findOne({ _id: postId, userId });
      if (!post) {
        // Fallback to any post if user was testing seed posts
        post = await Post.findById(postId);
      }
    }

    if (!post) {
      post = new Post({
        userId,
        topic: req.body.topic || 'AI & Engineering',
        style: req.body.style || 'Narrative Case Study',
        hook: req.body.hook || 'Key takeaways from our latest release',
        content: req.body.content || req.body.hook || 'Content text...',
        platform: req.body.platform || 'LinkedIn',
        status: 'published',
      });
      await post.save();
    } else if (req.body.platform && post.platform !== req.body.platform) {
      post.platform = req.body.platform;
      await post.save();
    }

    // 3. Save metric record in MongoDB with userId
    const postMetric = new PostMetric({
      userId,
      postId: post._id || null,
      likes,
      comments,
      shares,
      impressions,
      engagementRate,
      recordedAt: new Date(),
    });
    await postMetric.save();

    // 4. Compare against benchmark
    const comparison = analyticsService.compareWithBenchmark(engagementRate, 2.5, impressions);

    // 5. LLM transforms raw metrics into a meaningful qualitative experience
    const reflection = await llmService.generateReflection({
      post,
      metrics: { likes, comments, shares, impressions, engagementRate },
      comparison,
    });

    // 6. RETAIN this qualitative experience in Hindsight
    let retainedMemory = null;
    try {
      retainedMemory = await hindsightService.retainMemory({
        content: reflection.learningStatement,
        topic: post.topic,
        style: post.style,
        outcome: reflection.outcome,
        metrics: {
          likes,
          comments,
          shares,
          impressions,
          engagementRate,
          userId: String(userId),
        },
        tags: reflection.tags,
      });
    } catch (hindsightErr) {
      console.warn('[Hindsight Retain Warning]:', hindsightErr.message);
    }

    // 7. Store user-scoped memory in MongoDB
    const userMemory = new UserMemory({
      userId,
      content: reflection.learningStatement,
      topic: post.topic,
      style: post.style,
      outcome: reflection.outcome,
      metrics: {
        likes,
        comments,
        shares,
        impressions,
        engagementRate,
      },
      tags: reflection.tags,
      hindsightId: retainedMemory?.id || null,
    });
    await userMemory.save();

    return res.status(200).json({
      success: true,
      data: {
        metrics: postMetric,
        comparison,
        learnedExperience: reflection.learningStatement,
        retainedMemory: userMemory,
      },
    });
  } catch (error) {
    console.error('[PerformanceController Error]:', error);
    return res.status(500).json({ error: 'Failed to record performance and learn', details: error.message });
  }
};
