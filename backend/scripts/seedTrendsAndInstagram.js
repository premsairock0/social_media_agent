require('dotenv').config();
const mongoose = require('mongoose');
const Trend = require('../models/Trend');
const Post = require('../models/Post');
const PostMetric = require('../models/PostMetric');
const hindsightService = require('../services/hindsightService');
const analyticsService = require('../services/analyticsService');

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is missing');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('[Seed] Connected to MongoDB');

  // 1. Seed Trends
  console.log('[Seed] Seeding Trends...');
  await Trend.deleteMany({});

  const trendsData = [
    {
      topic: 'Autonomous Multi-Agent Orchestration',
      platform: 'All',
      category: 'AI & Engineering',
      growthScore: 94,
      sourceType: 'seed',
      description: 'Developers and founders are moving from single prompts to agent teams with temporal memory and goal autonomy.',
      suggestedAngles: [
        'Why single-prompt LLM wrappers fail in enterprise production',
        'How cognitive memory loops replace complex chain-of-thought prompt engineering',
        'Real-world tradeoffs of multi-agent latency vs reasoning depth'
      ],
      suggestedFormats: ['Technical Story', 'Carousel Breakdown', 'Actionable Playbook'],
      relevanceTags: ['ai', 'agents', 'architecture', 'hindsight'],
    },
    {
      topic: 'Visual Architecture & System Design Carousels',
      platform: 'Instagram',
      category: 'Visual Learning',
      growthScore: 91,
      sourceType: 'seed',
      description: 'Clean visual breakdowns of distributed systems, databases, and microservices are generating high bookmark/save ratios.',
      suggestedAngles: [
        'How 1 index change saved $4,200 on AWS Mongo CPU',
        'Database sharding explained with a 5-slide visual walkthrough',
        'Monolith vs Microservices: When to migrate and when to stay'
      ],
      suggestedFormats: ['Carousel Breakdown', 'Infographic Post'],
      relevanceTags: ['instagram', 'carousel', 'system-design', 'coding'],
    },
    {
      topic: 'Developer Burnout & Async Engineering Culture',
      platform: 'LinkedIn',
      category: 'Engineering Culture',
      growthScore: 88,
      sourceType: 'seed',
      description: 'Leaders are debating the cost of continuous meetings and championing written-first, async decision records (ADRs).',
      suggestedAngles: [
        'How we killed daily standups and saved 60 engineering hours a month',
        'The hidden cognitive tax of context-switching in remote teams',
        'Why good documentation is the highest leverage engineering superpower'
      ],
      suggestedFormats: ['Contrarian Opinion', 'Actionable Playbook'],
      relevanceTags: ['leadership', 'culture', 'productivity'],
    },
    {
      topic: 'Cost-Optimized LLM Inference at Scale',
      platform: 'All',
      category: 'AI Infrastructure',
      growthScore: 89,
      sourceType: 'seed',
      description: 'Teams are slashing GPU spend through semantic caching, prompt distillation, and model routing.',
      suggestedAngles: [
        'How we reduced our LLM API bill by 64% using intelligent router models',
        'Prompt caching benchmarks: What actually moves the needle',
        'The real cost breakdown of running agent pipelines at 100k requests/day'
      ],
      suggestedFormats: ['Case Study', 'Technical Deep-Dive'],
      relevanceTags: ['ai', 'costs', 'optimization'],
    },
    {
      topic: 'Behind-The-Scenes Coding & Terminal Reels',
      platform: 'Instagram',
      category: 'Short Video',
      growthScore: 86,
      sourceType: 'seed',
      description: 'Short 20-30s Reels showing high-focus coding workflows, terminal setups, and bug-hunting have high algorithmic distribution.',
      suggestedAngles: [
        'POV: You spent 4 hours debugging only to find a missing comma in your yaml',
        '3 terminal shortcuts senior developers actually use every day',
        'How I setup my IDE for maximum flow state'
      ],
      suggestedFormats: ['Reel', 'Video Script'],
      relevanceTags: ['reels', 'coding', 'productivity'],
    }
  ];

  await Trend.insertMany(trendsData);
  console.log(`[Seed] Seeded ${trendsData.length} trends.`);

  // 2. Seed Instagram Posts if none exist
  const existingIgPosts = await Post.find({ platform: 'Instagram' });
  if (existingIgPosts.length === 0) {
    console.log('[Seed] Seeding historical Instagram posts...');
    const igPosts = [
      {
        topic: 'System Architecture Breakdown',
        style: 'Visual Carousel',
        hook: 'Swipe through: How we scaled from 1,000 to 100,000 requests without crashing 🚀',
        content: 'Building distributed systems requires understanding where bottlenecks hide. In this 6-slide breakdown, we share the 3 architectural pivots that stabilized our platform.',
        caption: 'Building distributed systems requires understanding where bottlenecks hide. In this 6-slide breakdown, we share the 3 architectural pivots that stabilized our platform.\n\nSwipe through to see the exact diagram ➡️\n\nSave this for your next system design interview!\n\n#systemdesign #softwareengineering #codinglife #backend #devtips',
        platform: 'Instagram',
        format: 'carousel',
        hashtags: ['#systemdesign', '#softwareengineering', '#codinglife', '#backend', '#devtips'],
        visualPrompt: 'High-contrast dark-mode system architecture diagram showing API gateway, Redis cache, and MongoDB replica set with clean glowing connector lines.',
        carouselSlides: [
          'Slide 1: The Bottleneck - Why traditional polling killed our database',
          'Slide 2: Adding an Event-Driven Queue (Kafka/BullMQ)',
          'Slide 3: Read Replicas vs Write Clusters',
          'Slide 4: Compound Indexing Latency Comparisons',
          'Slide 5: Final Architecture & Lessons Learned'
        ],
        isSeed: true,
        metrics: { likes: 780, comments: 62, shares: 140, impressions: 14200 }
      },
      {
        topic: 'Developer Workspace & IDE Setup',
        style: 'Short-Form Reel',
        hook: '3 Terminal tools that save me 2 hours every week ⚡',
        content: '3 Terminal tools that save me 2 hours every week: 1. zoxide for smart jumping 2. fzf for fuzzy search 3. lazygit for lightning Git workflows.',
        caption: 'Stop typing full paths. Here are 3 terminal CLI tools every developer needs in 2026.\n\n1️⃣ zoxide - smart cd that learns your habits\n2️⃣ fzf - interactive command search\n3️⃣ lazygit - terminal Git without friction\n\nWhich terminal setup do you use? Drop it in the comments!\n\n#developer #terminal #coding #productivity #softwareengineer',
        platform: 'Instagram',
        format: 'reel',
        hashtags: ['#developer', '#terminal', '#coding', '#productivity', '#softwareengineer'],
        isSeed: true,
        metrics: { likes: 920, comments: 88, shares: 210, impressions: 16800 }
      },
      {
        topic: 'Generic Motivational Quote',
        style: 'Generic Motivation',
        hook: 'Code every day and never give up on your dreams ✨',
        content: 'Success is not an accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.',
        caption: 'Success is not an accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing. Keep coding! ✨\n\n#motivation #codingquotes #coder #tech',
        platform: 'Instagram',
        format: 'image',
        hashtags: ['#motivation', '#codingquotes', '#coder', '#tech'],
        isSeed: true,
        metrics: { likes: 65, comments: 4, shares: 2, impressions: 5800 }
      },
      {
        topic: '50 Interview Questions Carousel',
        style: 'Visual Resource Carousel',
        hook: 'The 50 questions that make or break senior software interviews 📑',
        content: 'Curated 50 interview questions grouped by System Design, Distributed Databases, API Concurrency, and Team Leadership.',
        caption: 'The 50 questions that make or break senior software interviews 📑\n\nSwipe through for the breakdown by category. Save this post for your interview prep.\n\n#interviewprep #softwareengineer #techcareers #faang #codingbootcamp',
        platform: 'Instagram',
        format: 'carousel',
        hashtags: ['#interviewprep', '#softwareengineer', '#techcareers', '#faang'],
        carouselSlides: [
          'Slide 1: Core System Design',
          'Slide 2: Concurrency & Race Conditions',
          'Slide 3: Database Sharding & Partitioning',
          'Slide 4: Behavioral & Tradeoff Questions',
          'Slide 5: Preparation Framework & Summary'
        ],
        isSeed: true,
        metrics: { likes: 1140, comments: 95, shares: 380, impressions: 18500 }
      }
    ];

    for (const postData of igPosts) {
      const { metrics, ...postFields } = postData;
      const post = new Post(postFields);
      await post.save();

      const rate = analyticsService.calculateEngagementRate(metrics);
      const postMetric = new PostMetric({
        postId: post._id,
        ...metrics,
        engagementRate: rate,
      });
      await postMetric.save();
    }
    console.log(`[Seed] Seeded ${igPosts.length} Instagram posts with metrics.`);

    // Retain a baseline Instagram memory in Hindsight
    try {
      await hindsightService.retainMemory({
        content: 'For Instagram, visual resource carousels and system architecture slide breakdowns generated high bookmarking and engagement (6.0% - 8.7%), while generic motivational quote graphics underperformed at 1.2%.',
        topic: 'Instagram Visual Engagement Patterns',
        style: 'Visual Carousel vs Generic Graphic',
        metrics: { engagementRate: 7.2, impressions: 18500 },
      });
      console.log('[Seed] Retained baseline Instagram experiential memory in Hindsight.');
    } catch (err) {
      console.warn('[Seed] Hindsight retain notice:', err.message);
    }
  } else {
    console.log(`[Seed] Found ${existingIgPosts.length} existing Instagram posts.`);
  }

  await mongoose.disconnect();
  console.log('[Seed] Seeding completed.');
}

seed().catch(err => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
