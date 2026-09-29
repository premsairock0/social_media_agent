const express = require('express');
const router = express.Router();
const strategyController = require('../controllers/strategyController');
const { protect } = require('../middleware/auth');

// Protected by JWT: Only authenticated users can access AI strategy generation
router.use(protect);

// POST /api/strategy/generate - Generate full strategy & post copy
router.post('/generate', strategyController.generateStrategy);

// POST /api/strategy/what-to-post - Hero recommendation engine
router.post('/what-to-post', strategyController.whatToPost);

// POST /api/strategy/studio-action - Quick studio micro-actions (captions, hooks, reels, carousels)
router.post('/studio-action', strategyController.studioAction);

module.exports = router;
