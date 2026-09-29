import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { useContent } from '../context/ContentContext';
import { 
  BarChart3, 
  BrainCircuit, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Linkedin,
  Instagram,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FormattedText from '../components/common/FormattedText';

export default function Dashboard() {
  const { platform, setPlatform } = useContent();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardStats(platform);
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
  }, [platform]);

  return (
    <div className="space-y-8">
      {/* Header & Value Proposition */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-indigo-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              AI Engagement & Intelligence Agent
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Kazam Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#AAB4CC] font-medium mt-1">
            "Understand your audience. Learn from your content. Create what matters."
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Platform Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-[#101625] p-1 rounded-lg border border-slate-200 dark:border-indigo-500/20">
            <button
              onClick={() => setPlatform('LinkedIn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                platform === 'LinkedIn'
                  ? 'bg-white dark:bg-[#172033] text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <Linkedin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={() => setPlatform('Instagram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                platform === 'Instagram'
                  ? 'bg-white dark:bg-[#172033] text-pink-700 dark:text-pink-400 shadow-sm border border-slate-200 dark:border-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <Instagram className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
              <span>Instagram</span>
            </button>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-indigo-500/25 bg-white dark:bg-[#121A2A] hover:bg-slate-50 dark:hover:bg-[#172033] text-slate-700 dark:text-[#F5F7FF] hover:text-slate-900 text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* HERO BANNER: "What Should I Post?" */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
              Hero Decision Engine
            </span>
            <span className="text-xs text-blue-200 font-semibold">Platform: {platform}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Unsure What to Post on {platform} Today?
          </h2>
          <p className="text-xs text-blue-100/90 leading-relaxed">
            Kazam synthesizes your historical engagement outcomes, active Hindsight memories, and current momentum trends to prescribe the optimal topic, format, and copy.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/what-to-post"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold shadow-md transition-all"
          >
            <HelpCircle className="h-4 w-4 text-blue-700" />
            <span>What Should I Post?</span>
            <ArrowRight className="h-3.5 w-3.5 text-blue-700" />
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600/40 hover:bg-blue-600/60 border border-white/20 text-white text-xs font-semibold transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Content Studio</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Posts */}
        <div className="bg-white dark:bg-[#121A2A] p-5 rounded-xl border border-slate-200 dark:border-indigo-500/25 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Posts ({platform})</span>
            <BarChart3 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : stats?.totalPosts ?? 0}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">in MongoDB</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">Platform telemetry</p>
        </div>

        {/* Average Engagement */}
        <div className="bg-white dark:bg-[#121A2A] p-5 rounded-xl border border-slate-200 dark:border-indigo-500/25 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Average Engagement</span>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : `${stats?.avgEngagement ?? 0}%`}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              +{((stats?.avgEngagement ?? 0) - (stats?.benchmarkRate ?? 2.5)).toFixed(2)}% vs baseline
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">Account baseline: 2.50%</p>
        </div>

        {/* Best Performing Content Type */}
        <div className="bg-white dark:bg-[#121A2A] p-5 rounded-xl border border-slate-200 dark:border-indigo-500/25 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Top Performing Style</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {loading ? '...' : stats?.bestContentType ?? 'Technical Story'}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
              Avg rate: <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats?.bestContentAvg ?? 0}%</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">Derived from {platform} metrics</p>
        </div>

        {/* Retained Experiences */}
        <div className="bg-white dark:bg-[#121A2A] p-5 rounded-xl border border-slate-200 dark:border-indigo-500/25 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Retained Experiences</span>
            <BrainCircuit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : stats?.totalMemories ?? 0}
            </span>
            <span className="text-xs font-bold bg-[#EEF2FF] text-[#2563EB] border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/40 px-2.5 py-0.5 rounded-md shadow-xs">
              Retained Experiences
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">Bank: Social-Media-Agent</p>
        </div>
      </div>

      {/* Main Grid: Recent Learning & How It Works */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Learning from Hindsight */}
        <div className="lg:col-span-7 bg-white dark:bg-[#121A2A] rounded-xl border border-slate-200 dark:border-indigo-500/25 shadow-sm p-6 space-y-5 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-indigo-500/20 pb-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Recent Experiences Retained in Hindsight
              </h2>
            </div>
            <Link
              to="/insights"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                Retrieving active memories from Hindsight Cloud...
              </div>
            ) : stats?.recentLearnings?.length > 0 ? (
              stats.recentLearnings.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-indigo-500/20 bg-[#F8FAFC] dark:bg-[#172033] text-xs space-y-1.5 shadow-sm transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-blue-700 dark:text-blue-400 font-bold">Memory #{idx + 1}</span>
                    {item.date && (
                      <span className="font-mono">{new Date(item.date).toLocaleDateString()}</span>
                    )}
                  </div>
                  <FormattedText text={item.text} className="text-slate-800 dark:text-[#E2E8F0] leading-relaxed font-sans text-xs" />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center font-medium">
                No memories retained yet.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Quick Navigation Hub */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Access Card */}
          <div className="bg-white dark:bg-[#121A2A] rounded-xl border border-slate-200 dark:border-indigo-500/25 shadow-sm p-6 space-y-4 transition-colors">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-indigo-500/20 pb-3">
              Intelligence Modules
            </h2>

            <div className="space-y-2.5">
              <Link
                to="/what-to-post"
                className="flex items-center justify-between p-3.5 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-[#F0F7FF] dark:bg-blue-950/25 hover:bg-blue-100/70 dark:hover:bg-blue-950/40 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      What Should I Post?
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Prescriptive next-post recommendation</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </Link>

              <Link
                to="/create"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-indigo-500/20 bg-white dark:bg-[#172033]/60 hover:bg-slate-50 dark:hover:bg-[#172033] hover:border-slate-300 dark:hover:border-indigo-500/40 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Content Studio
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Captions, hooks, reels & carousels</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </Link>

              <Link
                to="/audience"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-indigo-500/20 bg-white dark:bg-[#172033]/60 hover:bg-slate-50 dark:hover:bg-[#172033] hover:border-slate-300 dark:hover:border-indigo-500/40 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Audience Intelligence
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Interests, preferred formats & weak topics</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </Link>

              <Link
                to="/trends"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-indigo-500/20 bg-white dark:bg-[#172033]/60 hover:bg-slate-50 dark:hover:bg-[#172033] hover:border-slate-300 dark:hover:border-indigo-500/40 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Trend Intelligence
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Bridge momentum trends to your audience</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Cognitive Learning Loop Concept */}
          <div className="p-4 rounded-xl bg-slate-900 dark:bg-[#0A0E1A] text-white border border-slate-800 dark:border-indigo-500/20 space-y-2 text-xs shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
              Continuous Intelligence
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              "Kazam learns what works for YOUR audience and uses that knowledge to improve what you post next."
            </p>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              MongoDB: Structured Telemetry • Hindsight: Experiential Memory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
