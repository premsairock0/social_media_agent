const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { protect } = require('../middleware/auth');

// Protected: Only authenticated users can record metrics and retain memories
router.post('/record', protect, performanceController.recordAndLearn);

module.exports = router;
