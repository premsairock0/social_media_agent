import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Opening Page
import Landing from './pages/Landing';

// Public Auth Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

// Protected Dashboard & Agent Pages
import Dashboard from './pages/Dashboard';
import AgentChat from './pages/AgentChat';
import WhatShouldIPost from './pages/WhatShouldIPost';
import ContentStudio from './pages/ContentStudio';
import StrategyView from './pages/StrategyView';
import AudienceIntelligence from './pages/AudienceIntelligence';
import TrendIntelligence from './pages/TrendIntelligence';
import ContentHistory from './pages/ContentHistory';
import PerformanceLogger from './pages/PerformanceLogger';
import LearnedInsights from './pages/LearnedInsights';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ContentProvider>
            <Routes>
              {/* Cinematic Landing Screen */}
              <Route path="/" element={<Landing />} />

            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Dashboard & Agent Routes (Authenticated Users Only) */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agent" element={<AgentChat />} />
              <Route path="/what-to-post" element={<WhatShouldIPost />} />
              <Route path="/create" element={<ContentStudio />} />
              <Route path="/strategy" element={<StrategyView />} />
              <Route path="/audience" element={<AudienceIntelligence />} />
              <Route path="/trends" element={<TrendIntelligence />} />
              <Route path="/history" element={<ContentHistory />} />
              <Route path="/performance" element={<PerformanceLogger />} />
              <Route path="/insights" element={<LearnedInsights />} />
            </Route>

            {/* Catch-all redirect to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ContentProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
}
