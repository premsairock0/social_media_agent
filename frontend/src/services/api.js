import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // Allow sufficient time for LLM + Hindsight Cloud operations
});

// Request interceptor: attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired (except for login/register/reset endpoints)
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/signup') && !currentPath.includes('/forgot-password')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getMe = () => api.get('/auth/me');
export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => api.post('/auth/reset-password', payload);

// AI Chatbot / Agent endpoint (Accessible only to authenticated users)
export const chatWithAgent = (payload) => api.post('/agent/chat', payload);

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
