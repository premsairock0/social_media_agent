const express = require('express');
const router = express.Router();
const strategyController = require('../controllers/strategyController');

// POST /api/strategy/generate
router.post('/generate', strategyController.generateStrategy);

module.exports = router;
