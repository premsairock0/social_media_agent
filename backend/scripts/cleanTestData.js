const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');

async function cleanTestData() {
  await connectDB();
  console.log('[CleanData] Connected to MongoDB');

  // Identify the 3 test records created for the "top 50 interview questions" testing
  const dupIds = [
    new mongoose.Types.ObjectId('6aba233f198f2e8306ee0fce'),
    new mongoose.Types.ObjectId('6aba235a198f2e8306ee0fd2'),
    new mongoose.Types.ObjectId('6aba2385198f2e8306ee0fd6'),
  ];

  const delPosts = await Post.deleteMany({ _id: { $in: dupIds } });
  const delMetrics = await PostMetric.deleteMany({ postId: { $in: dupIds } });
  console.log(`[CleanData] Safely removed ${delPosts.deletedCount} duplicate test posts and ${delMetrics.deletedCount} metrics.`);

  // Mark all posts: first 20 are historical seed data, rest are live demo user experiences
  const remaining = await Post.find().sort({ createdAt: 1 });
  console.log(`[CleanData] Remaining posts count: ${remaining.length}`);

  for (let i = 0; i < remaining.length; i++) {
    const isSeed = i < 20;
    await Post.updateOne({ _id: remaining[i]._id }, { $set: { isSeed } });
    console.log(`[Post #${i + 1}] "${remaining[i].topic}" -> isSeed: ${isSeed}`);
  }

  console.log('[CleanData] Data cleanup and isSeed labeling complete!');
  process.exit(0);
}

cleanTestData().catch((err) => {
  console.error('[CleanData Error]:', err);
  process.exit(1);
});
