const express = require('express');
const router = express.Router();
const audienceController = require('../controllers/audienceController');

// GET /api/audience/insights?platform=LinkedIn
router.get('/insights', audienceController.getAudienceInsights);

module.exports = router;
