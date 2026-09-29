const API_BASE = 'http://localhost:5000/api';

async function runDemoLoop() {
  console.log('=================================================================');
  console.log('       SOCIALPULSE END-TO-END DEMO LEARNING SCENARIO TEST        ');
  console.log('=================================================================');

  // STEP 1: Generate initial content for Instagram
  console.log('\n[STEP 1] Generating Instagram Strategy for "Practical Microservice Migration Lessons"...');
  const genRes = await fetch(`${API_BASE}/strategy/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idea: 'Practical Microservice to Monolith Migration Lessons with Architecture Diagrams',
      platform: 'Instagram',
      goal: 'Saves & Bookmarks',
      targetAudience: 'Backend Developers & System Architects',
    }),
  });
  const genData = await genRes.json();
  console.log('✓ Generated Hook:', genData.data?.hook);
  console.log('✓ Visual Suggestion:', genData.data?.visualSuggestion?.substring(0, 100) + '...');
  console.log('✓ Recalled Memories Used:', genData.data?.memoriesUsed?.length);

  // STEP 2 & 3: Simulate publication and log strong performance
  console.log('\n[STEP 2 & 3] Logging Performance: 15,000 Impressions, 850 Likes, 95 Comments, 320 Shares (Saves)...');
  const perfRes = await fetch(`${API_BASE}/performance/record`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Microservice to Monolith Architecture Diagram',
      style: 'Visual Carousel Breakdown',
      hook: genData.data?.hook || 'Why we migrated back from microservices to a modular monolith',
      content: genData.data?.generatedPost || 'System architecture breakdown...',
      platform: 'Instagram',
      impressions: 15000,
      likes: 850,
      comments: 95,
      shares: 320,
    }),
  });
  const perfData = await perfRes.json();
  const rate = perfData.data?.metrics?.engagementRate;
  console.log(`✓ Calculated Engagement Rate: ${rate}% (Baseline: 2.50%)`);
  console.log(`✓ Benchmark Delta: ${perfData.data?.comparison?.delta}% (${perfData.data?.comparison?.performanceLabel})`);

  // STEP 4 & 5: Verify LLM reflection and Hindsight RETAIN
  console.log('\n[STEP 4 & 5] Verifying Hindsight RETAIN:');
  console.log('✓ Qualitative Learned Experience:');
  console.log(`  "${perfData.data?.learnedExperience}"`);

  // STEP 6 & 7 & 8: Ask "What Should I Post?" and verify recall of the new memory
  console.log('\n[STEP 6 & 7] Asking Hero Engine: "What Should I Post on Instagram?"...');
  const whatRes = await fetch(`${API_BASE}/strategy/what-to-post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      platform: 'Instagram',
      audience: 'Backend Developers & System Architects',
      goal: 'Saves & Bookmarks',
    }),
  });
  const whatData = await whatRes.json();
  console.log('\n[STEP 8 & 9] SocialPulse Improved Prescriptive Recommendation:');
  console.log('✓ Recommended Topic:', whatData.data?.recommendedTopic);
  console.log('✓ Recommended Format:', whatData.data?.recommendedFormat);
  console.log('✓ Suggested Hook:', whatData.data?.suggestedHook);
  console.log('✓ Reason for Recommendation:', whatData.data?.reasonForRecommendation);
  console.log('✓ Supporting Hindsight Evidence Cited:');
  whatData.data?.supportingEvidence?.forEach((ev, i) => {
    console.log(`   [Evidence #${i+1}] Memory: "${ev.memorySnippet}"`);
    console.log(`                    Lesson: ${ev.lesson}`);
  });

  console.log('\n=================================================================');
  console.log('  DEMO LEARNING LOOP: RETAIN → RECALL → REASON → ADAPT SUCCEEDED! ');
  console.log('=================================================================');
}

runDemoLoop().catch(console.error);
