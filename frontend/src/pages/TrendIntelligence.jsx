import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { getTrends, connectTrendToContent } from '../services/api';
import { 
  Flame, 
  Sparkles, 
  Check, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  Linkedin, 
  Instagram,
  Bot,
  Cloud,
  Users,
  TrendingUp,
  Globe,
  Database,
  FileText,
  ArrowRight,
  Activity,
  Layers,
  CheckCircle2,
  Share2,
  Cpu,
  Palette,
  BarChart2,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ==========================================================================
   Circular Momentum Score Indicator
   ========================================================================== */
const MomentumGauge = ({ score = 85, color = 'blue' }) => {
  const radius = 24;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap = {
    blue: {
      gradientId: 'grad-blue',
      startColor: '#38bdf8',
      endColor: '#2563eb',
      track: '#e2e8f0',
      trackDark: '#1e293b',
      text: 'text-blue-600 dark:text-blue-400'
    },
    purple: {
      gradientId: 'grad-purple',
      startColor: '#c084fc',
      endColor: '#7c3aed',
      track: '#e2e8f0',
      trackDark: '#1e293b',
      text: 'text-purple-600 dark:text-purple-400'
    },
    emerald: {
      gradientId: 'grad-emerald',
      startColor: '#34d399',
      endColor: '#059669',
      track: '#e2e8f0',
      trackDark: '#1e293b',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="relative w-[68px] h-[68px] rounded-full bg-white/95 dark:bg-[#0D1322]/95 backdrop-blur-md p-1 shadow-lg border border-white/80 dark:border-indigo-500/30 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 60 60">
        <defs>
          <linearGradient id={scheme.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={scheme.startColor} />
            <stop offset="100%" stopColor={scheme.endColor} />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-100 dark:text-slate-800"
          strokeWidth={strokeWidth}
        />

        {/* Progress Arc */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke={`url(#${scheme.gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center Score & Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
        <div className="flex items-baseline justify-center">
          <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
            {score}
          </span>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 leading-none">/100</span>
        </div>
        <span className={`text-[6.5px] font-extrabold ${scheme.text} tracking-wider uppercase leading-none mt-0.5`}>
          MOMENTUM
        </span>
      </div>
    </div>
  );
};

/* ==========================================================================
   Abstract Visual Card Banner Illustration (Fallback when no image)
   ========================================================================== */
const CardBannerVisual = ({ variant = 0 }) => {
  if (variant === 0) {
    // AI & Multi-Agent Cyber Grid (Blue/Cyan)
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1528] via-[#0F2042] to-[#1E1B4B] overflow-hidden">
        {/* Subtle grid mesh */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
            backgroundSize: '16px 16px'
          }}
        />
        {/* Ambient glow nodes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-blue-500/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl pointer-events-none" />
        
        {/* Futuristic Agent Silhouette Artwork */}
        <svg className="absolute bottom-0 right-1/2 translate-x-1/2 w-44 h-36 opacity-75" viewBox="0 0 200 160" fill="none">
          <rect x="50" y="30" width="100" height="70" rx="18" fill="url(#bot-grad)" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="80" cy="65" r="9" fill="#38BDF8" className="animate-pulse" />
          <circle cx="120" cy="65" r="9" fill="#38BDF8" className="animate-pulse" />
          <path d="M75 82 Q 100 92 125 82" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <rect x="25" y="45" width="12" height="40" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
          <rect x="163" y="45" width="12" height="40" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
          <path d="M100 30 V 15 M95 15 H 105" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="bot-grad" x1="50" y1="30" x2="150" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E293B" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === 1) {
    // Visual Learning / System Architecture Matrix (Violet/Purple)
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0B2E] via-[#2A114D] to-[#3B0764] overflow-hidden">
        {/* Subtle grid mesh */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(192, 132, 252, 0.4) 1px, transparent 0)`,
            backgroundSize: '16px 16px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-purple-500/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-fuchsia-400/20 rounded-full blur-xl pointer-events-none" />

        {/* Layered Carousel Slides Artwork */}
        <svg className="absolute bottom-1 right-1/2 translate-x-1/2 w-48 h-36 opacity-85" viewBox="0 0 200 150" fill="none">
          <rect x="25" y="40" width="70" height="90" rx="10" fill="#1E1B4B" stroke="#A855F7" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <rect x="105" y="40" width="70" height="90" rx="10" fill="#1E1B4B" stroke="#A855F7" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <rect x="55" y="25" width="90" height="110" rx="14" fill="#2E1065" stroke="#C084FC" strokeWidth="1.5" />
          {/* Play/Flow button */}
          <circle cx="100" cy="75" r="18" fill="url(#play-grad)" stroke="#E9D5FF" strokeWidth="1" />
          <polygon points="96,68 108,75 96,82" fill="#FFFFFF" />
          <defs>
            <linearGradient id="play-grad" x1="82" y1="57" x2="118" y2="93" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" />
              <stop offset="1" stopColor="#7E22CE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Variant 2: Cloud / Infrastructure Server Cluster (Electric Cyan/Emerald)
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#061727] via-[#0B253D] to-[#04334C] overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(45, 212, 191, 0.4) 1px, transparent 0)`,
          backgroundSize: '16px 16px'
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Cloud & Server Cluster Artwork */}
      <svg className="absolute bottom-2 right-1/2 translate-x-1/2 w-48 h-36 opacity-80" viewBox="0 0 200 150" fill="none">
        <rect x="35" y="55" width="130" height="24" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
        <rect x="35" y="85" width="130" height="24" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
        <circle cx="48" cy="67" r="3" fill="#34D399" />
        <circle cx="58" cy="67" r="3" fill="#38BDF8" />
        <circle cx="48" cy="97" r="3" fill="#34D399" />
        <circle cx="58" cy="97" r="3" fill="#38BDF8" />
        {/* Floating cloud overlay */}
        <path d="M100 25 C90 25 82 32 82 41 C76 41 70 46 70 52 C70 58 76 63 82 63 H120 C126 63 131 58 131 52 C131 47 127 43 122 42 C122 33 112 25 100 25 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" opacity="0.85" />
      </svg>
    </div>
  );
};

export default function TrendIntelligence() {
  const { platform, setPlatform } = useContent();
  const navigate = useNavigate();

  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active filter chip
  const [selectedFilter, setSelectedFilter] = useState('All Trends');

  // Connecting state
  const [connectingTrend, setConnectingTrend] = useState(null);
  const [connectedStrategy, setConnectedStrategy] = useState(null);
  const [copied, setCopied] = useState(false);

  const filterChips = [
    'All Trends',
    'AI & Engineering',
    'Productivity',
    'Design & UI',
    'Marketing',
    'Founders',
    'Data & Analytics',
  ];

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTrends(platform);
      setTrends(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch trends:', err);
      setError('Unable to load trends. Please check backend connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [platform]);

  const handleConnect = async (trend) => {
    setConnectingTrend(trend.topic);
    setError(null);
    try {
      const res = await connectTrendToContent({
        trendTopic: trend.topic,
        platform,
        category: trend.category,
      });
      setConnectedStrategy(res.data.data);
    } catch (err) {
      console.error('Failed to connect trend to content:', err);
      setError('Failed to generate trend bridge strategy.');
    } finally {
      setConnectingTrend(null);
    }
  };

  const handleCopy = () => {
    if (!connectedStrategy?.generatedPost) return;
    navigator.clipboard.writeText(connectedStrategy.generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to categorize & color-code metadata
  const getCategoryMeta = (category = '', idx = 0) => {
    const cat = category.toLowerCase();
    if (cat.includes('visual') || cat.includes('design') || cat.includes('carousel') || idx % 3 === 1) {
      return {
        color: 'purple',
        badgeBg: 'bg-white/90 dark:bg-[#0D1322]/90',
        badgeText: 'text-purple-700 dark:text-purple-300',
        Icon: Layers,
        label: category || 'Visual Learning',
        bannerVariant: 1
      };
    }
    if (cat.includes('infra') || cat.includes('cloud') || cat.includes('gpu') || cat.includes('scale') || idx % 3 === 2) {
      return {
        color: 'emerald',
        badgeBg: 'bg-white/90 dark:bg-[#0D1322]/90',
        badgeText: 'text-cyan-700 dark:text-cyan-300',
        Icon: Cloud,
        label: category || 'AI Infrastructure',
        bannerVariant: 2
      };
    }
    return {
      color: 'blue',
      badgeBg: 'bg-white/90 dark:bg-[#0D1322]/90',
      badgeText: 'text-blue-700 dark:text-blue-300',
      Icon: Bot,
      label: category || 'AI & Engineering',
      bannerVariant: 0
    };
  };

  // Filter trends based on active chip
  const filteredTrends = trends.filter((t) => {
    if (selectedFilter === 'All Trends') return true;
    const searchTarget = `${t.category || ''} ${t.topic || ''} ${t.description || ''} ${(t.relevanceTags || []).join(' ')}`.toLowerCase();
    if (selectedFilter === 'AI & Engineering') {
      return searchTarget.includes('ai') || searchTarget.includes('engineering') || searchTarget.includes('agent') || searchTarget.includes('llm');
    }
    if (selectedFilter === 'Productivity') {
      return searchTarget.includes('productiv') || searchTarget.includes('workflow') || searchTarget.includes('efficiency');
    }
    if (selectedFilter === 'Design & UI') {
      return searchTarget.includes('design') || searchTarget.includes('ui') || searchTarget.includes('visual') || searchTarget.includes('carousel');
    }
    if (selectedFilter === 'Marketing') {
      return searchTarget.includes('market') || searchTarget.includes('growth') || searchTarget.includes('social');
    }
    if (selectedFilter === 'Founders') {
      return searchTarget.includes('founder') || searchTarget.includes('startup') || searchTarget.includes('build');
    }
    if (selectedFilter === 'Data & Analytics') {
      return searchTarget.includes('data') || searchTarget.includes('analytic') || searchTarget.includes('metric') || searchTarget.includes('database');
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ==========================================================================
          1. Header Section
          ========================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-slate-200 dark:border-indigo-500/20 pb-6">
        <div>
          <span className="text-[11px] font-black tracking-wider uppercase text-blue-600 dark:text-blue-400 block mb-1">
            EXTERNAL MOMENTUM INTELLIGENCE
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Trend
            </span>{' '}
            Intelligence
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium max-w-2xl">
            Connect external momentum topics to your <span className="font-bold text-slate-900 dark:text-white">{platform}</span> audience via Hindsight experiential memory.
          </p>
        </div>

        {/* Right Header Visual & Badge */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Visual Orb Capsule */}
          <div className="hidden sm:flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#121A2A] border border-slate-200 dark:border-indigo-500/25 shadow-sm">
            <div className="flex items-center -space-x-1.5 pl-1">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-xs">
                <Instagram className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="w-7 h-7 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                in
              </span>
              <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-700/30 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Verified Momentum Signals
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>

          {/* Quick Platform Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-[#101625] p-1 rounded-xl border border-slate-200 dark:border-indigo-500/20">
            <button
              onClick={() => setPlatform('LinkedIn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                platform === 'Instagram'
                  ? 'bg-white dark:bg-[#172033] text-pink-700 dark:text-pink-400 shadow-sm border border-slate-200 dark:border-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <Instagram className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
              <span>Instagram</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ==========================================================================
          2. Trend-to-Content Pipeline (5-Step Visual Process)
          ========================================================================== */}
      <div className="bg-white dark:bg-[#121A2A] rounded-2xl border border-slate-200 dark:border-indigo-500/25 p-5 sm:p-6 shadow-sm transition-colors">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-indigo-500/15">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/40">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Trend-to-Content Pipeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              From real-world momentum to grounded, high-performing content.
            </p>
          </div>
        </div>

        {/* 5 Connected Steps Grid / Flex */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-3 items-start">
          {/* Step 01: TREND */}
          <div className="flex items-start gap-3 relative">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">01</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">TREND</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                Identify rising topics from external signals
              </p>
            </div>
            <ArrowRight className="hidden lg:block w-4 h-4 text-slate-300 dark:text-slate-600 self-center absolute -right-2 top-3 pointer-events-none" />
          </div>

          {/* Step 02: PLATFORM */}
          <div className="flex items-start gap-3 relative">
            <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/50 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 shadow-xs">
              {platform === 'Instagram' ? <Instagram className="w-5 h-5" /> : <Linkedin className="w-5 h-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-pink-600 dark:text-pink-400 font-mono">02</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">PLATFORM</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                Match with your target platform ({platform})
              </p>
            </div>
            <ArrowRight className="hidden lg:block w-4 h-4 text-slate-300 dark:text-slate-600 self-center absolute -right-2 top-3 pointer-events-none" />
          </div>

          {/* Step 03: AUDIENCE */}
          <div className="flex items-start gap-3 relative">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 font-mono">03</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">AUDIENCE</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                Align with audience needs & interests
              </p>
            </div>
            <ArrowRight className="hidden lg:block w-4 h-4 text-slate-300 dark:text-slate-600 self-center absolute -right-2 top-3 pointer-events-none" />
          </div>

          {/* Step 04: HINDSIGHT */}
          <div className="flex items-start gap-3 relative">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 font-mono">04</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">HINDSIGHT</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                Enrich with past experiences and learnings
              </p>
            </div>
            <ArrowRight className="hidden lg:block w-4 h-4 text-slate-300 dark:text-slate-600 self-center absolute -right-2 top-3 pointer-events-none" />
          </div>

          {/* Step 05: CONTENT */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">05</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">CONTENT</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                Generate a grounded, high-converting post
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          3. Trend Filter Chips & Action Row
          ========================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {filterChips.map((chip) => {
            const isActive = selectedFilter === chip;
            return (
              <button
                key={chip}
                onClick={() => setSelectedFilter(chip)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-white dark:bg-[#121A2A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-indigo-500/20 hover:bg-slate-50 dark:hover:bg-[#172033] hover:border-slate-300 font-medium'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <button
          onClick={fetchTrends}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-indigo-500/20 bg-white dark:bg-[#121A2A] hover:bg-slate-50 dark:hover:bg-[#172033] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all shadow-xs shrink-0 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Trends</span>
        </button>
      </div>

      {/* ==========================================================================
          Connected Strategy Modal / Drawer Output
          ========================================================================== */}
      {connectedStrategy && (
        <div className="bg-white dark:bg-[#121A2A] rounded-2xl border-2 border-blue-500/40 dark:border-indigo-500/40 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-indigo-500/15 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 px-2.5 py-0.5 rounded-md">
                Trend Bridge Output
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">
                {connectedStrategy.trendTopic}
              </h3>
            </div>
            <button
              onClick={() => setConnectedStrategy(null)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#172033] transition"
            >
              Close Preview
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Strategic Angle & Hook
              </span>
              <div className="p-4 bg-slate-50 dark:bg-[#172033] rounded-xl border border-slate-200 dark:border-indigo-500/20 space-y-2 text-xs">
                <p className="font-bold text-slate-900 dark:text-white text-sm">"{connectedStrategy.hook}"</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{connectedStrategy.strategicAngle}</p>
                <span className="inline-block text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                  Format: {connectedStrategy.recommendedFormat}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Why This Works (Hindsight Evidence)
              </span>
              <div className="p-4 bg-slate-50 dark:bg-[#172033] rounded-xl border border-slate-200 dark:border-indigo-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                <p className="leading-relaxed">{connectedStrategy.whyThisWorks}</p>
                {connectedStrategy.supportingMemories?.map((m, idx) => (
                  <div key={idx} className="border-t border-slate-200 dark:border-indigo-500/15 pt-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-blue-700 dark:text-blue-400">Memory: </span>"{m.memory}"
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Post */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Ready-To-Publish Draft
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/50 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Post'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-sans text-xs whitespace-pre-wrap leading-relaxed shadow-inner">
              {connectedStrategy.generatedPost}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          4. Redesigned Premium Intelligence Trend Cards
          ========================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-[#121A2A] rounded-[1.75rem] border border-slate-200 dark:border-indigo-500/20 overflow-hidden shadow-xs animate-pulse">
              <div className="h-44 bg-slate-200 dark:bg-slate-800"></div>
              <div className="p-6 space-y-4">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-14 bg-slate-50 dark:bg-slate-800/50 rounded w-full"></div>
                <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl w-full mt-4"></div>
              </div>
            </div>
          ))
        ) : filteredTrends.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#121A2A] rounded-[1.75rem] border border-slate-200 dark:border-indigo-500/20 p-8">
            <Flame className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No active trends found for "{selectedFilter}".</p>
            <p className="mt-1">Try selecting "All Trends" or refreshing.</p>
          </div>
        ) : (
          filteredTrends.map((t, idx) => {
            const meta = getCategoryMeta(t.category, idx);
            const CategoryIcon = meta.Icon;
            const momentumScore = t.growthScore || (94 - idx * 5);

            // Opportunity label derived directly from momentum score
            let opportunityLabel = 'GOOD OPPORTUNITY';
            let opportunityClass = 'bg-blue-50/95 dark:bg-blue-950/90 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50';
            if (momentumScore >= 92) {
              opportunityLabel = 'HIGH OPPORTUNITY';
              opportunityClass = 'bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50';
            } else if (momentumScore >= 88) {
              opportunityLabel = 'STRONG OPPORTUNITY';
              opportunityClass = 'bg-purple-50/95 dark:bg-purple-950/90 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/50';
            }

            return (
              <div
                key={t._id || idx}
                className="bg-white dark:bg-[#121A2A] rounded-[1.75rem] border border-slate-200 dark:border-indigo-500/20 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Banner (Abstract Visual Treatment & Badges) */}
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    {/* Visual Background */}
                    {t.bannerUrl || t.imageUrl ? (
                      <img 
                        src={t.bannerUrl || t.imageUrl} 
                        alt={t.topic} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <CardBannerVisual variant={meta.bannerVariant} />
                    )}

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Row Badges: Category & Circular Momentum Score */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between z-10">
                      {/* Category Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-[#0D1322]/90 backdrop-blur-md text-slate-800 dark:text-white border border-white/60 dark:border-indigo-500/30 shadow-md">
                        <CategoryIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{meta.label}</span>
                      </span>

                      {/* Prominent Circular Momentum Progress Gauge */}
                      <MomentumGauge score={momentumScore} color={meta.color} />
                    </div>

                    {/* Bottom Opportunity Indicator */}
                    <div className="absolute bottom-3 left-3.5 z-10">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-sm backdrop-blur-md ${opportunityClass}`}>
                        <TrendingUp className="h-3 w-3" />
                        <span>{opportunityLabel}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {/* Topic Title */}
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t.topic}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t.description}
                    </p>

                    {/* Platform Indicator */}
                    <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Platform:</span>
                      {t.platform === 'Instagram' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/40">
                          <Instagram className="h-3 w-3 text-pink-600" />
                          <span>Instagram</span>
                        </span>
                      ) : t.platform === 'LinkedIn' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40">
                          <Linkedin className="h-3 w-3 text-blue-600" />
                          <span>LinkedIn</span>
                        </span>
                      ) : (
                        <span className="font-bold text-slate-900 dark:text-white">All</span>
                      )}
                    </div>

                    {/* High-Converting Angles */}
                    <div className="pt-3 border-t border-slate-100 dark:border-indigo-500/15">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 dark:text-white block mb-2">
                        HIGH-CONVERTING ANGLES
                      </span>
                      <div className="space-y-2">
                        {(t.suggestedAngles && t.suggestedAngles.length > 0
                          ? t.suggestedAngles.slice(0, 2)
                          : [
                              'Why single-prompt LLM wrappers fail in enterprise production',
                              'How cognitive memory loops replace complex chain-of-thought prompt engineering'
                            ]
                        ).map((angle, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono text-[10px] font-extrabold flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/50">
                              0{i + 1}
                            </span>
                            <span className="pt-0.5">{angle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Source & Prominent CTA Button */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-slate-100 dark:border-indigo-500/15 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span>Source: {t.sourceType === 'seed' ? 'Curated Seed Signal' : 'Curated Seed Signal'}</span>
                  </div>

                  <button
                    onClick={() => handleConnect(t)}
                    disabled={connectingTrend === t.topic}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 shrink-0 disabled:opacity-50"
                  >
                    {connectingTrend === t.topic ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                        <span>Turn Trend into Post →</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
