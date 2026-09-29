const express = require('express');
const router = express.Router();
const hindsightService = require('../services/hindsightService');
const UserMemory = require('../models/UserMemory');
const { protect } = require('../middleware/auth');

// Protect all memory routes
router.use(protect);

// GET /api/memory - Get all user-specific retained memories
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user-specific memories from MongoDB
    const userMemories = await UserMemory.find({ userId }).sort({ createdAt: -1 });

    if (userMemories.length > 0) {
      const formatted = userMemories.map((m) => ({
        id: m._id,
        content: m.content,
        date: m.createdAt,
        factType: m.factType || 'learned_experience',
        topic: m.topic,
        style: m.style,
        metrics: m.metrics,
      }));
      return res.status(200).json({ success: true, count: formatted.length, data: formatted });
    }

    // Fallback to initial memories from Hindsight bank
    const memories = await hindsightService.getAllMemories();
    return res.status(200).json({ success: true, count: memories.length, data: memories });
  } catch (error) {
    console.error('[MemoryRoutes Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch memories', details: error.message });
  }
});

// GET /api/memory/reflect - Synthesize high-level patterns for user
router.get('/reflect', async (req, res) => {
  try {
    const userId = req.user._id;
    const userMemories = await UserMemory.find({ userId }).limit(10);

    const memorySnippet = userMemories.map(m => `- ${m.content}`).join('\n');
    const prompt = req.query.prompt || `Based on these experiences for ${req.user.name}:\n${memorySnippet || 'General engagement telemetry'}\nSummarize what content styles and topics drive high engagement and what should be avoided.`;
    
    const reflection = await hindsightService.reflectMemory(prompt);
    return res.status(200).json({ success: true, data: reflection });
  } catch (error) {
    console.error('[Memory Reflect Error]:', error);
    return res.status(500).json({ error: 'Failed to reflect on memories', details: error.message });
  }
});

module.exports = router;
