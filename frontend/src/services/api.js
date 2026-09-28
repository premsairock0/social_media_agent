import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // Allow sufficient time for LLM + Hindsight Cloud operations
});

// Dashboard aggregated stats
export const getDashboardStats = () => api.get('/posts/stats');

// Strategy endpoints
export const generateStrategy = (payload) => api.post('/strategy/generate', payload);

// Performance / Learning endpoints
export const recordPerformance = (payload) => api.post('/performance/record', payload);

// Post history endpoints
export const getPosts = () => api.get('/posts');
export const createPost = (payload) => api.post('/posts', payload);

// Hindsight Memory bank endpoints
export const getMemories = () => api.get('/memory');
export const getReflection = (prompt) => api.get('/memory/reflect', { params: prompt ? { prompt } : {} });

export default api;
