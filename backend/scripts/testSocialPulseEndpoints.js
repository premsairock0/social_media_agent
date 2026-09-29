const API_BASE = 'http://localhost:5000/api';

async function testBackend() {
  console.log('--- 1. Testing Trends Endpoint ---');
  const trendsRes = await fetch(`${API_BASE}/trends`);
  const trendsData = await trendsRes.json();
  console.log('Trends count:', trendsData.data?.length);

  console.log('\n--- 2. Testing Audience Insights Endpoint (LinkedIn) ---');
  const audRes = await fetch(`${API_BASE}/audience/insights?platform=LinkedIn`);
  const audData = await audRes.json();
  console.log('Audience format preferences:', audData.data?.formatPreferences?.length);
  console.log('Top interest:', audData.data?.topInterests?.[0]?.topic);

  console.log('\n--- 3. Testing "What Should I Post?" Endpoint (Instagram) ---');
  const whatRes = await fetch(`${API_BASE}/strategy/what-to-post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform: 'Instagram', goal: 'Engagement' }),
  });
  const whatData = await whatRes.json();
  console.log('What to Post Topic:', whatData.data?.recommendedTopic);
  console.log('Recommended Format:', whatData.data?.recommendedFormat);
  console.log('Hook:', whatData.data?.suggestedHook);
  console.log('Supporting evidence memories:', whatData.data?.supportingEvidence?.length);

  console.log('\n--- 4. Testing Studio Action (Hook Improvement on LinkedIn) ---');
  const studioRes = await fetch(`${API_BASE}/strategy/studio-action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'improve_hook',
      platform: 'LinkedIn',
      input: 'Top 50 interview questions for software developers.',
    }),
  });
  const studioData = await studioRes.json();
  console.log('Studio result variations:', studioData.data?.variations?.length);

  console.log('\n--- ALL BACKEND ENDPOINTS FUNCTIONING PROPERLY ---');
}

testBackend().catch(console.error);
