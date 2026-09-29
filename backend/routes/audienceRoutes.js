const express = require('express');
const router = express.Router();
const audienceController = require('../controllers/audienceController');
const { protect } = require('../middleware/auth');

// Protected: Only authenticated users can access audience intelligence
router.get('/insights', protect, audienceController.getAudienceInsights);

module.exports = router;
