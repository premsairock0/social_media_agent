require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const strategyRoutes = require('./routes/strategyRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const postRoutes = require('./routes/postRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const trendRoutes = require('./routes/trendRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/strategy', strategyRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/audience', audienceRoutes);
app.use('/api/trends', trendRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    agent: 'SocialPulse — AI Social Engagement & Intelligence Agent',
    tagline: 'Understand your audience. Learn from your content. Create what matters.',
    hindsightStatus: 'active',
    platforms: ['LinkedIn', 'Instagram'],
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[SocialPulse Backend] Server running on port ${PORT}`);
});

module.exports = app;
