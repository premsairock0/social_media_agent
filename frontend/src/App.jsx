import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
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
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="what-to-post" element={<WhatShouldIPost />} />
            <Route path="create" element={<ContentStudio />} />
            <Route path="strategy" element={<StrategyView />} />
            <Route path="audience" element={<AudienceIntelligence />} />
            <Route path="trends" element={<TrendIntelligence />} />
            <Route path="history" element={<ContentHistory />} />
            <Route path="performance" element={<PerformanceLogger />} />
            <Route path="insights" element={<LearnedInsights />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
