const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../../config/db');
const Post = require('../../models/Post');
const PostMetric = require('../../models/PostMetric');
const hindsightService = require('../../services/hindsightService');
const analyticsService = require('../../services/analyticsService');
const historicalPosts = require('./historicalPosts.json');

/**
 * Experience Builder
 * 
 * Transforms raw post attributes and numerical metrics into qualitative,
 * high-leverage agent memories suitable for Hindsight retention.
 */
function buildMeaningfulExperience(post, metrics, comparison) {
  const isPositive = comparison.percentageDifference > 0;
  
  if (isPositive) {
    return {
      content: `A ${post.style} post on "${post.topic}" with hook "${post.hook}" received ${metrics.likes} likes, ${metrics.comments} comments, and ${metrics.shares} shares (${metrics.engagementRate}% engagement rate). The post ${comparison.performanceLabel} the benchmark by ${comparison.percentageDifference}%, demonstrating that practical first-person storytelling, transparent technical breakdown, and honest tradeoffs strongly resonate with this audience.`,
      topic: post.topic,
      style: post.style,
      outcome: 'positive',
      metrics,
      tags: [post.topic, post.style, 'high-performer'],
    };
  } else {
    return {
      content: `A ${post.style} post on "${post.topic}" with hook "${post.hook}" received only ${metrics.likes} likes and ${metrics.comments} comments (${metrics.engagementRate}% engagement rate). The post ${comparison.performanceLabel} the account benchmark by ${Math.abs(comparison.percentageDifference)}%, confirming that promotional announcements, generic listicles, and sales pitches fail to generate meaningful engagement with this audience.`,
      topic: post.topic,
      style: post.style,
      outcome: 'negative',
      metrics,
      tags: [post.topic, post.style, 'low-performer', 'avoid'],
    };
  }
}

async function seed() {
  console.log('====================================================');
  console.log('--- Starting SocialMind Database & Hindsight Seeding ---');
  console.log('====================================================');
  console.log(`Bank ID: ${process.env.HINDSIGHT_BANK_ID}`);
  console.log(`Total Posts to Seed: ${historicalPosts.length}`);

  await connectDB();

  // Clear existing MongoDB posts to prevent duplicates during repeated seeds
  try {
    await Post.deleteMany({});
    await PostMetric.deleteMany({});
    console.log('[MongoDB] Cleared existing posts and metrics collections for clean seed.');
  } catch (err) {
    console.log('[MongoDB Notice]: Could not clear collections:', err.message);
  }

  const BENCHMARK_RATE = 2.5;
  let seededCount = 0;

  for (const item of historicalPosts) {
    // 1. Calculate engagement rate
    const engagementRate = analyticsService.calculateEngagementRate(item.metrics);
    const metricsWithRate = { ...item.metrics, engagementRate };

    // 2. Persist Post to MongoDB
    try {
      const post = new Post({
        content: item.content,
        topic: item.topic,
        style: item.style,
        hook: item.hook,
        platform: 'LinkedIn',
        status: 'published',
      });
      const savedPost = await post.save();

      const postMetric = new PostMetric({
        postId: savedPost._id,
        ...metricsWithRate,
      });
      await postMetric.save();
    } catch (err) {
      console.warn(`[MongoDB Save Warning]: ${err.message}`);
    }

    // 3. Compare with benchmark
    const comparison = analyticsService.compareWithBenchmark(engagementRate, BENCHMARK_RATE);

    // 4. Experience Builder generates qualitative learning statement
    const experience = buildMeaningfulExperience(item, metricsWithRate, comparison);

    // 5. Retain experience in Hindsight
    await hindsightService.retainMemory(experience);
    seededCount++;
    console.log(`[Seed ${seededCount}/${historicalPosts.length}] Retained: "${item.topic}" (${item.style})`);
  }

  console.log('\n====================================================');
  console.log(`--- Seeding Complete: ${seededCount} posts persisted and retained in Hindsight! ---`);
  console.log('====================================================');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
