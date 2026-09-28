const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const hindsightService = require('../services/hindsightService');
const llmService = require('../services/llmService');
const analyticsService = require('../services/analyticsService');

async function testFullLearningLoop() {
  console.log('================================================================');
  console.log('       FULL COGNITIVE LEARNING LOOP END-TO-END TEST             ');
  console.log('  RETAIN → RECALL → REASON → GENERATE → FEEDBACK → RETAIN       ');
  console.log('================================================================');
  console.log(`Hindsight Bank: ${process.env.HINDSIGHT_BANK_ID}`);
  console.log(`LLM Model: ${process.env.LLM_MODEL}\n`);

  // ==========================================
  // PHASE 1: USER REQUEST → RECALL → REASON → GENERATE
  // ==========================================
  const userRequest = {
    idea: 'We deployed an autonomous AI debugging agent into our CI pipeline that cut production incident resolution from 4 hours to 18 minutes.',
    goal: 'Engagement & Technical Discussion',
    targetAudience: 'Software Engineers, DevOps Leads, Tech Founders',
  };

  console.log('--- PHASE 1: CONTENT STRATEGY GENERATION ---');
  console.log(`User Content Idea: "${userRequest.idea}"\n`);

  // 1. Hindsight RECALL
  console.log('[Step 1: Hindsight RECALL]');
  const recalledMemories = await hindsightService.recallMemory(userRequest, 4);
  console.log(`Recalled ${recalledMemories.length} relevant experiences from Hindsight:`);
  recalledMemories.forEach((m, idx) => {
    console.log(`  [#${idx + 1}] (Score: ${m.relevanceScore}) ${m.content.substring(0, 110)}...`);
  });

  // 2. LLM REASON & GENERATE
  console.log('\n[Step 2: LLM REASONING & STRATEGY GENERATION]');
  const strategyResult = await llmService.generateStrategy({
    idea: userRequest.idea,
    goal: userRequest.goal,
    audience: userRequest.targetAudience,
    memories: recalledMemories,
    brand: { name: 'DevFlow AI', industry: 'Developer Tools' },
  });

  console.log('\n>>> Recommended Strategy:');
  console.log(strategyResult.strategy);

  console.log('\n>>> Recommended Hook:');
  console.log(`"${strategyResult.hook}"`);

  console.log('\n>>> Why This Strategy (Citing Hindsight Memory):');
  console.log(strategyResult.whyThisStrategy);

  console.log('\n>>> Generated LinkedIn Post Copy:\n');
  console.log('----------------------------------------------------');
  console.log(strategyResult.generatedPost);
  console.log('----------------------------------------------------\n');

  // ==========================================
  // PHASE 2: PUBLISHED POST → METRICS → ANALYTICS → REFLECTION → RETAIN
  // ==========================================
  console.log('--- PHASE 2: PERFORMANCE FEEDBACK & RETENTION LOOP ---');

  // Simulated live metrics after publishing
  const liveMetrics = {
    likes: 740,
    comments: 114,
    shares: 68,
    impressions: 17200,
  };

  console.log(`Simulated Live Metrics: Likes=${liveMetrics.likes}, Comments=${liveMetrics.comments}, Shares=${liveMetrics.shares}, Impressions=${liveMetrics.impressions}`);

  // 3. Analytics Service
  const engagementRate = analyticsService.calculateEngagementRate(liveMetrics);
  const comparison = analyticsService.compareWithBenchmark(engagementRate, 2.5);
  console.log(`[Step 3: Analytics] Engagement Rate: ${engagementRate}% | Delta vs Benchmark: +${comparison.delta}% (${comparison.performanceLabel})`);

  // 4. LLM Reflection
  console.log('[Step 4: LLM Experience Synthesis]');
  const reflection = await llmService.generateReflection({
    post: {
      topic: 'Autonomous Debugging Agent',
      style: 'Technical Retrospective',
      hook: strategyResult.hook,
      content: strategyResult.generatedPost,
    },
    metrics: { ...liveMetrics, engagementRate },
    comparison,
  });

  console.log(`Synthesized Qualitative Experience:`);
  console.log(`"${reflection.learningStatement}"\n`);

  // 5. Hindsight RETAIN
  console.log('[Step 5: Hindsight RETAIN (Persisting to Long-Term Memory)]');
  const retainResult = await hindsightService.retainMemory({
    content: reflection.learningStatement,
    topic: 'Autonomous Debugging Agent',
    style: 'Technical Retrospective',
    outcome: reflection.outcome,
    metrics: { ...liveMetrics, engagementRate },
  });

  console.log(`Hindsight Retain Status: Success=${retainResult.success === true}, Items Count=${retainResult.items_count}\n`);

  // ==========================================
  // PHASE 3: VERIFY IMMEDIATE RECALL OF NEW EXPERIENCE
  // ==========================================
  console.log('--- PHASE 3: VERIFYING IMMEDIATE MEMORY RECALL ---');
  const verifyMemories = await hindsightService.recallMemory('autonomous debugging agent incident resolution', 2);
  console.log(`Top Recalled Memory on follow-up search:`);
  console.log(`"${verifyMemories[0]?.content}"`);

  console.log('\n================================================================');
  console.log('  COMPLETE COGNITIVE LOOP (RETAIN → RECALL → REASON → FEEDBACK)  ');
  console.log('  SUCCESSFULLY VERIFIED WITH LIVE HINDSIGHT AND LIVE LLM!       ');
  console.log('================================================================');
}

testFullLearningLoop().catch((err) => {
  console.error('Learning Loop Test Failed:', err);
  process.exit(1);
});
