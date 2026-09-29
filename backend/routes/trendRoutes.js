const express = require('express');
const router = express.Router();
const trendController = require('../controllers/trendController');

// GET /api/trends
router.get('/', trendController.getTrends);

// POST /api/trends/connect-to-content
router.post('/connect-to-content', trendController.connectTrendToContent);

module.exports = router;
