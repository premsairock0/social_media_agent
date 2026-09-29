import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // Allow sufficient time for LLM + Hindsight Cloud operations
});

// Dashboard aggregated stats (filterable by platform)
export const getDashboardStats = (platform) => 
  api.get('/posts/stats', { params: platform && platform !== 'All' ? { platform } : {} });

// Strategy & Generation endpoints
export const generateStrategy = (payload) => api.post('/strategy/generate', payload);
export const whatToPost = (payload) => api.post('/strategy/what-to-post', payload);
export const studioAction = (payload) => api.post('/strategy/studio-action', payload);

// Performance / Learning endpoints
export const recordPerformance = (payload) => api.post('/performance/record', payload);

// Post history endpoints
export const getPosts = (platform) => 
  api.get('/posts', { params: platform && platform !== 'All' ? { platform } : {} });
export const createPost = (payload) => api.post('/posts', payload);

// Audience Intelligence endpoints
export const getAudienceInsights = (platform) => 
  api.get('/audience/insights', { params: platform && platform !== 'All' ? { platform } : {} });

// Trend Intelligence endpoints
export const getTrends = (platform, category) => 
  api.get('/trends', { params: { ...(platform ? { platform } : {}), ...(category ? { category } : {}) } });
export const connectTrendToContent = (payload) => 
  api.post('/trends/connect-to-content', payload);

// Hindsight Memory bank endpoints
export const getMemories = () => api.get('/memory');
export const getReflection = (prompt) => 
  api.get('/memory/reflect', { params: prompt ? { prompt } : {} });

export default api;
