require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const hindsightService = require('../services/hindsightService');

async function runTest() {
  console.log('====================================================');
  console.log('       MINIMAL HINDSIGHT CONNECTIVITY TEST           ');
  console.log('====================================================');
  console.log(`Bank ID: ${process.env.HINDSIGHT_BANK_ID}`);
  console.log(`Base URL: ${process.env.HINDSIGHT_BASE_URL}`);

  // 1. Meaningful experience to retain
  const testExperience = {
    content: 'A transparent engineering retrospective on building AI agent memory pipelines generated 680 likes, 112 comments, and 58 shares. The post outperformed our typical baseline by 45%, showing that engineering teams on LinkedIn heavily engage with honest technical tradeoffs over hype.',
    topic: 'AI Agent Memory Architecture',
    style: 'Technical Retrospective',
    metrics: { likes: 680, comments: 112, shares: 58, impressions: 16500 },
  };

  console.log('\n[1/3] RETAINING experience to Hindsight...');
  const retainResult = await hindsightService.retainMemory(testExperience);
  console.log('Retain API Call Success:', retainResult.success === true);
  console.log('Items Count:', retainResult.items_count);

  console.log('\n[2/3] RECALLING experience from Hindsight...');
  const query = 'How do engineering teams respond to transparent technical tradeoffs?';
  const recalledMemories = await hindsightService.recallMemory(query, 3);
  console.log(`Recalled ${recalledMemories.length} memories for query: "${query}"`);

  recalledMemories.forEach((mem, i) => {
    console.log(`\n--- Recalled Memory #${i + 1} ---`);
    console.log(`ID: ${mem.id}`);
    console.log(`Content: ${mem.content}`);
    console.log(`Relevance Score: ${mem.relevanceScore}`);
  });

  console.log('\n[3/3] REFLECTING on memory bank...');
  const reflection = await hindsightService.reflectMemory('Summarize the top performing content strategy.');
  console.log('Reflection Synthesis:');
  console.log(reflection.text);

  console.log('\n====================================================');
  console.log('  LIVE HINDSIGHT CONNECTIVITY TEST COMPLETED!        ');
  console.log('====================================================');
}

runTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
