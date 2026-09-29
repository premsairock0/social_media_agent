const express = require('express');
const router = express.Router();
const trendController = require('../controllers/trendController');
const { protect } = require('../middleware/auth');

// Protected by JWT: Only authenticated users can access trend intelligence
router.use(protect);

// GET /api/trends
router.get('/', trendController.getTrends);

// POST /api/trends/connect-to-content
router.post('/connect-to-content', trendController.connectTrendToContent);

module.exports = router;
