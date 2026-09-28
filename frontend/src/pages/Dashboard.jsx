import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { 
  BarChart3, 
  BrainCircuit, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardStats();
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Unable to load live dashboard statistics. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header & Value Proposition */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Audience Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            SocialMind learns what works for <span className="font-semibold text-slate-700">your specific audience</span> by retaining post outcomes and recalling past experiences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Create Content</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Posts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Posts</span>
            <BarChart3 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats?.totalPosts ?? 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">in MongoDB</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">LinkedIn historical tracking</p>
        </div>

        {/* Average Engagement */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Average Engagement</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {loading ? '...' : `${stats?.avgEngagement ?? 0}%`}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              +{((stats?.avgEngagement ?? 0) - (stats?.benchmarkRate ?? 2.5)).toFixed(2)}% vs baseline
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Benchmark baseline: 2.50%</p>
        </div>

        {/* Best Performing Content Type */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Top Performing Style</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <p className="text-sm font-bold text-slate-900 truncate">
              {loading ? '...' : stats?.bestContentType ?? 'Technical Story'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Avg rate: <span className="font-semibold text-emerald-600">{stats?.bestContentAvg ?? 0}%</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Derived from real metrics</p>
        </div>

        {/* Audience Learning Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Retained Experiences</span>
            <BrainCircuit className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats?.totalMemories ?? 0}
            </span>
            <span className="text-xs text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded">
              Retained Experiences
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bank: Social-Media-Agent</p>
        </div>
      </div>

      {/* Main Grid: Recent Learning & How It Works */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Learning (Actual Insights from Hindsight) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Learning</h2>
              <p className="text-xs text-slate-500">Actual qualitative insights synthesized and retained in Hindsight.</p>
            </div>
            <Link
              to="/insights"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-8 text-center text-sm text-slate-400">Loading memories from Hindsight...</div>
            ) : stats?.recentLearnings?.length > 0 ? (
              stats.recentLearnings.map((item, idx) => {
                const isPositive = !item.text.toLowerCase().includes('underperformed') && !item.text.toLowerCase().includes('ineffective');
                return (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPositive ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-500" />
                      )}
                    </div>
                    <div className="flex-1 text-xs text-slate-700 leading-relaxed">
                      <p>{item.text}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No memories retained yet. Run seeding or log post performance.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: The Cognitive Cycle Demonstration */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">The SocialMind Difference</h2>
            <p className="text-xs text-slate-500">How Hindsight memory prevents generic AI output.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-600 block mb-1">Standard LLM Tools:</span>
              <p className="text-slate-500 font-mono text-[11px]">Prompt → Generic Post (No Memory)</p>
            </div>

            <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200">
              <span className="font-semibold text-blue-900 block mb-1">SocialMind with Hindsight:</span>
              <div className="font-mono text-[11px] text-blue-800 space-y-1">
                <div>1. Historical Experiences in Hindsight</div>
                <div>2. RECALL memories matching new idea</div>
                <div>3. REASON over winning vs failing patterns</div>
                <div>4. GENERATE customized strategy & copy</div>
                <div>5. Log live metrics & FEEDBACK</div>
                <div>6. RETAIN new learning for future posts</div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/create"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <span>Test Memory-Driven Creation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
