import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ContentHistory from './pages/ContentHistory';
import CreateContent from './pages/CreateContent';
import StrategyView from './pages/StrategyView';
import PerformanceLogger from './pages/PerformanceLogger';
import LearnedInsights from './pages/LearnedInsights';

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="history" element={<ContentHistory />} />
            <Route path="create" element={<CreateContent />} />
            <Route path="strategy" element={<StrategyView />} />
            <Route path="performance" element={<PerformanceLogger />} />
            <Route path="insights" element={<LearnedInsights />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}

