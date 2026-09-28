const express = require('express');
const router = express.Router();
const hindsightService = require('../services/hindsightService');

// GET /api/memory - Get all retained memories for "What I've Learned" page
router.get('/', async (req, res) => {
  try {
    const memories = await hindsightService.getAllMemories();
    res.status(200).json({ success: true, count: memories.length, data: memories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memories', details: error.message });
  }
});

// GET /api/memory/reflect - Synthesize high-level patterns
router.get('/reflect', async (req, res) => {
  try {
    const prompt = req.query.prompt || 'Based on all retained experiences, summarize what content styles and topics drive high engagement, and what should be avoided for this audience.';
    const reflection = await hindsightService.reflectMemory(prompt);
    res.status(200).json({ success: true, data: reflection });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reflect on memories', details: error.message });
  }
});

module.exports = router;
