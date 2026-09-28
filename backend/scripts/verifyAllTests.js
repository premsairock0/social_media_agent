const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== TEST 1: Hallucination Prevention ===');
  const genResponse = await fetch(`${API_BASE}/strategy/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idea: 'Create a LinkedIn post about top 50 interview questions.',
      objective: 'Engagement'
    })
  });
  const genData = await genResponse.json();

  const generatedPost = genData.data.generatedPost;
  const whyStrategy = genData.data.whyThisStrategy;
  console.log('GENERATED POST:\n', generatedPost);
  console.log('\nWHY THIS STRATEGY:\n', whyStrategy);

  // Check for forbidden hallucinations
  const lower = generatedPost.toLowerCase();
  const forbiddenPhrases = [
    'landed me my first',
    'three top tech firms',
    'interview-to-offer ratio',
    'i got offers',
    'my offers',
    'salary'
  ];
  const foundHallucinations = forbiddenPhrases.filter(p => lower.includes(p));
  console.log('Hallucination Check Result:', foundHallucinations.length === 0 ? 'PASSED (Clean, zero invented claims)' : `FAILED (Found: ${foundHallucinations.join(', ')})`);

  console.log('\n=== TEST 2: Small Performance Sample (<100 impressions) ===');
  const smallResponse = await fetch(`${API_BASE}/performance/record`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'LinkedIn post on top 50 interview questions (Early Test)',
      style: 'Technical Story',
      impressions: 10,
      likes: 1,
      comments: 0,
      shares: 0
    })
  });
  const smallRes = await smallResponse.json();

  console.log('Small Sample Result:');
  console.log('- Engagement Rate:', smallRes.data.metrics.engagementRate + '%');
  console.log('- Delta vs Baseline:', smallRes.data.comparison.delta + '%');
  console.log('- Performance Label:', smallRes.data.comparison.performanceLabel);
  console.log('- Is Small Sample:', smallRes.data.comparison.isSmallSample);
  console.log('- Learned Reflection:', smallRes.data.learnedExperience);

  console.log('\n=== TEST 3: Large Performance Sample (12000 impressions) ===');
  const largeResponse = await fetch(`${API_BASE}/performance/record`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'High Scale Software Interview Architecture Review',
      style: 'Technical Story',
      impressions: 12000,
      likes: 650,
      comments: 75,
      shares: 40
    })
  });
  const largeRes = await largeResponse.json();

  console.log('Large Sample Result:');
  console.log('- Engagement Rate:', largeRes.data.metrics.engagementRate + '%');
  console.log('- Benchmark Rate:', largeRes.data.comparison.benchmarkRate + '%');
  console.log('- Delta vs Baseline:', largeRes.data.comparison.delta + '%');
  console.log('- Performance Label:', largeRes.data.comparison.performanceLabel);
  console.log('- Is Small Sample:', largeRes.data.comparison.isSmallSample);
  console.log('- Learned Reflection:', largeRes.data.learnedExperience);

  console.log('\n=== TEST 4: Follow-up Recall Propagation ===');
  const recallResponse = await fetch(`${API_BASE}/strategy/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idea: 'Software Engineering Coding Interview Preparation Framework',
      objective: 'Engagement'
    })
  });
  const recallRes = await recallResponse.json();

  console.log('Follow-up Recall Count:', recallRes.data.memoriesUsed?.length || 0);
  console.log('Top Recalled Memories:');
  recallRes.data.memoriesUsed?.slice(0, 3).forEach((m, i) => {
    console.log(`  [${i+1}] (Score: ${m.relevanceScore}) ${m.content.slice(0, 110)}...`);
  });

  console.log('\n=== ALL 4 TESTS COMPLETED ===');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
});
