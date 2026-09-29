import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] via-[#DDD6FE]/40 to-[#F3E8FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-white shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin text-white" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-slate-800 text-sm">Authenticating Kazam</h3>
            <p className="text-xs text-slate-500 mt-1">Verifying secure session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
