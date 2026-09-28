const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');

// POST /api/performance/record
router.post('/record', performanceController.recordAndLearn);

module.exports = router;
