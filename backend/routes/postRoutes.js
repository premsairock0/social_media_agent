const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// All post routes are protected by JWT verification
router.use(protect);

// GET /api/posts/stats
router.get('/stats', postController.getDashboardStats);

// GET /api/posts
router.get('/', postController.getPosts);

// POST /api/posts
router.post('/', postController.createPost);

module.exports = router;
