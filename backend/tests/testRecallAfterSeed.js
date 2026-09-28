const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const hindsightService = require('../services/hindsightService');

async function testRecall() {
  console.log('====================================================');
  console.log('       POST-SEEDING HINDSIGHT RECALL TEST           ');
  console.log('====================================================');
  console.log(`Bank: ${process.env.HINDSIGHT_BANK_ID}`);

  const question = 'What types of content have historically performed well for this audience?';
  console.log(`\nQuery: "${question}"\n`);

  console.log('--- Calling hindsightService.recallMemory ---');
  const memories = await hindsightService.recallMemory(question, 5);

  console.log(`\nRecalled ${memories.length} relevant memories:`);
  memories.forEach((m, idx) => {
    console.log(`\n[Memory #${idx + 1}] (Score: ${m.relevanceScore})`);
    console.log(`Context: ${m.context || 'N/A'}`);
    console.log(`Content: ${m.content}`);
  });

  console.log('\n--- Calling hindsightService.reflectMemory ---');
  const reflection = await hindsightService.reflectMemory(
    'Based on all retained experiences, summarize what styles and topics succeed vs what fails for this audience.'
  );

  console.log('\n[Hindsight Strategic Reflection Output]:\n');
  console.log(reflection.text);

  console.log('\n====================================================');
  console.log('  RECALL & REFLECTION TEST COMPLETED SUCCESSFULLY!  ');
  console.log('====================================================');
}

testRecall().catch((err) => {
  console.error('Recall test error:', err);
  process.exit(1);
});
