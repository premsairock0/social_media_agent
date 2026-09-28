const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');
const analyticsService = require('../services/analyticsService');
const llmService = require('../services/llmService');
const hindsightService = require('../services/hindsightService');

/**
 * Performance Controller
 * 
 * Pipeline:
 * Post Metrics Input
 *        ↓
 * analyticsService (compute engagement rate & benchmark delta)
 *        ↓
 * llmService (synthesize qualitative experience / learning)
 *        ↓
 * hindsightService RETAIN (store learned experience in long-term memory)
 */
exports.recordAndLearn = async (req, res) => {
  try {
    const { postId, likes = 0, comments = 0, shares = 0, impressions = 0 } = req.body;

    // 1. Calculate engagement rate using Analytics Service
    const engagementRate = analyticsService.calculateEngagementRate({
      likes,
      comments,
      shares,
      impressions,
    });

    // 2. Fetch or create post in MongoDB
    let post = null;
    if (postId) {
      post = await Post.findById(postId);
    }
    if (!post) {
      post = new Post({
        topic: req.body.topic || 'AI & Engineering',
        style: req.body.style || 'Narrative Case Study',
        hook: req.body.hook || 'Key takeaways from our latest release',
        content: req.body.content || req.body.hook || 'Content text...',
        platform: 'LinkedIn',
        status: 'published',
      });
      await post.save();
    }

    // 3. Save or update metric record in MongoDB
    const postMetric = new PostMetric({
      postId: post._id || null,
      likes,
      comments,
      shares,
      impressions,
      engagementRate,
      recordedAt: new Date(),
    });
    await postMetric.save();

    // 4. Compare against benchmark (sample-size aware)
    const comparison = analyticsService.compareWithBenchmark(engagementRate, 2.5, impressions);

    // 5. LLM transforms raw metrics into a meaningful qualitative experience
    const reflection = await llmService.generateReflection({
      post,
      metrics: { likes, comments, shares, impressions, engagementRate },
      comparison,
    });

    // 6. RETAIN this qualitative experience in Hindsight
    const retainedMemory = await hindsightService.retainMemory({
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
    });

    return res.status(200).json({
      success: true,
      data: {
        metrics: postMetric,
        comparison,
        learnedExperience: reflection.learningStatement,
        retainedMemory,
      },
    });
  } catch (error) {
    console.error('[PerformanceController Error]:', error);
    return res.status(500).json({ error: 'Failed to record performance and learn', details: error.message });
  }
};
