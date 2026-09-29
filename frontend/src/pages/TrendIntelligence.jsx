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
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MomentumGauge = ({ score = 85, color = 'blue' }) => {
  const radius = 26;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap = {
    blue: {
      gradientId: 'grad-blue',
      startColor: '#3b82f6',
      endColor: '#1d4ed8',
      track: '#eff6ff',
      trackBorder: '#bfdbfe',
      text: 'text-blue-600',
      bgGlow: 'from-blue-50/70 to-indigo-50/40',
      shadow: 'shadow-blue-500/10'
    },
    purple: {
      gradientId: 'grad-purple',
      startColor: '#a855f7',
      endColor: '#7e22ce',
      track: '#faf5ff',
      trackBorder: '#e9d5ff',
      text: 'text-purple-600',
      bgGlow: 'from-purple-50/70 to-pink-50/40',
      shadow: 'shadow-purple-500/10'
    },
    emerald: {
      gradientId: 'grad-emerald',
      startColor: '#10b981',
      endColor: '#047857',
      track: '#ecfdf5',
      trackBorder: '#a7f3d0',
      text: 'text-emerald-600',
      bgGlow: 'from-emerald-50/70 to-teal-50/40',
      shadow: 'shadow-emerald-500/10'
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`relative w-[72px] h-[72px] rounded-full bg-gradient-to-br ${scheme.bgGlow} p-0.5 shadow-sm ${scheme.shadow} flex items-center justify-center shrink-0 border border-slate-200/70 hover:scale-105 transition-transform duration-200`}>
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 64 64">
        <defs>
          <linearGradient id={scheme.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={scheme.startColor} />
            <stop offset="100%" stopColor={scheme.endColor} />
          </linearGradient>
        </defs>

        {/* Outer subtle decorative ring */}
        <circle
          cx="32"
          cy="32"
          r="29.5"
          fill="none"
          stroke={scheme.trackBorder}
          strokeWidth="0.75"
          opacity="0.6"
        />

        {/* Background Track */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={scheme.trackBorder}
          strokeWidth={strokeWidth}
          opacity="0.5"
        />

        {/* Progress Arc */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={`url(#${scheme.gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
        <div className="flex items-baseline justify-center">
          <span className="text-xs font-black text-slate-900 tracking-tight">
            {score}
          </span>
          <span className="text-[9px] font-bold text-slate-400">/100</span>
        </div>
        <span className={`text-[7.5px] font-black ${scheme.text} tracking-wider uppercase leading-none mt-0.5`}>
          MOMENTUM
        </span>
      </div>
    </div>
  );
};

export default function TrendIntelligence() {
  const { platform, setPlatform } = useContent();
  const navigate = useNavigate();

  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Connecting state
  const [connectingTrend, setConnectingTrend] = useState(null);
  const [connectedStrategy, setConnectedStrategy] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const getCategoryMeta = (category, idx) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('ai') || cat.includes('agent') || cat.includes('model') || cat.includes('machine') || idx % 3 === 0) {
      return {
        color: 'blue',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-100',
        Icon: Bot,
        label: category || 'AI & Engineering'
      };
    }
    if (cat.includes('infra') || cat.includes('cloud') || cat.includes('gpu') || idx % 3 === 1) {
      return {
        color: 'purple',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-100',
        Icon: Cloud,
        label: category || 'AI INFRASTRUCTURE'
      };
    }
    return {
      color: 'emerald',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      Icon: Users,
      label: category || 'ENGINEERING CULTURE'
    };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Trend Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect external momentum topics to your <span className="font-semibold text-slate-800">{platform}</span> audience via Hindsight experiential memory.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {/* Platform Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setPlatform('LinkedIn')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                platform === 'LinkedIn'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Linkedin className="h-3.5 w-3.5 text-blue-600" />
              <span>Linkedin</span>
            </button>
            <button
              onClick={() => setPlatform('Instagram')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                platform === 'Instagram'
                  ? 'bg-white text-pink-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Instagram className="h-3.5 w-3.5 text-pink-600" />
              <span>Instagram</span>
            </button>
          </div>

          <button
            onClick={fetchTrends}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Trends</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Intelligence Pipeline Diagram Banner */}
      <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
            <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs sm:text-sm block">Trend-to-Content Pipeline</span>
            <div className="text-slate-600 text-xs flex items-center gap-1.5 flex-wrap mt-0.5">
              <span>Trend</span>
              <span className="text-slate-400">→</span>
              <span>Platform ({platform})</span>
              <span className="text-slate-400">→</span>
              <span>Audience Needs</span>
              <span className="text-slate-400">→</span>
              <span className="inline-flex items-center gap-1">🪞 Hindsight Memory</span>
              <span className="text-slate-400">→</span>
              <span className="font-medium text-slate-800">Grounded Post</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0 self-start md:self-auto bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <span>🔥</span>
          <span>Source: Verified Momentum Signals</span>
        </div>
      </div>

      {/* Connected Strategy Modal / Output */}
      {connectedStrategy && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-xl p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Trend Bridge Output
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {connectedStrategy.trendTopic}
              </h3>
            </div>
            <button
              onClick={() => setConnectedStrategy(null)}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-md hover:bg-slate-100"
            >
              Close Preview
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Strategic Angle & Hook
              </span>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p className="font-semibold text-slate-900">"{connectedStrategy.hook}"</p>
                <p className="text-slate-600">{connectedStrategy.strategicAngle}</p>
                <span className="inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Format: {connectedStrategy.recommendedFormat}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Why This Works (Hindsight Evidence)
              </span>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <p>{connectedStrategy.whyThisWorks}</p>
                {connectedStrategy.supportingMemories?.map((m, idx) => (
                  <div key={idx} className="border-t border-slate-200 pt-1.5 text-[11px] text-slate-600">
                    <span className="font-semibold text-blue-700">Memory: </span>"{m.memory}"
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Post */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Ready-To-Publish Draft
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
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

      {/* Trends 3-Column Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-slate-100 rounded-full w-28"></div>
                <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
              </div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-10 bg-slate-100 rounded w-full"></div>
              <div className="h-16 bg-slate-50 rounded w-full"></div>
              <div className="h-8 bg-slate-100 rounded w-full mt-4"></div>
            </div>
          ))
        ) : trends.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No active trends found for this platform.
          </div>
        ) : (
          trends.map((t, idx) => {
            const meta = getCategoryMeta(t.category, idx);
            const CategoryIcon = meta.Icon;
            const momentumScore = t.growthScore || (94 - idx * 5);

            return (
              <div
                key={t._id || idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Category Badge & Momentum Gauge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${meta.badgeClass}`}>
                      <CategoryIcon className="h-3.5 w-3.5" />
                      <span>{meta.label}</span>
                    </span>

                    <MomentumGauge score={momentumScore} color={meta.color} />
                  </div>

                  {/* Topic Title */}
                  <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                    {t.topic}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">
                    {t.description}
                  </p>

                  {/* Platform Indicator */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="font-medium text-slate-500">Platform:</span>
                    {t.platform === 'Instagram' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-pink-50 text-pink-700 border border-pink-100">
                        <Instagram className="h-2.5 w-2.5 text-pink-600" />
                        <span>Instagram</span>
                      </span>
                    ) : t.platform === 'LinkedIn' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <Linkedin className="h-2.5 w-2.5 text-blue-600" />
                        <span>LinkedIn</span>
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-800">All</span>
                    )}
                  </div>

                  {/* High-Converting Angles */}
                  <div className="mt-4 pt-3 border-t border-slate-100/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 block">
                      HIGH-CONVERTING ANGLES:
                    </span>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
                      {(t.suggestedAngles && t.suggestedAngles.length > 0
                        ? t.suggestedAngles.slice(0, 2)
                        : [
                            'Why single-prompt LLM wrappers fail in enterprise production',
                            'How cognitive memory loops replace complex chain-of-thought prompt engineering'
                          ]
                      ).map((angle, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 leading-relaxed">
                          <span className="text-blue-500 font-bold shrink-0">•</span>
                          <span>{angle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action & Source */}
                <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-normal">
                    Source: {t.sourceType === 'seed' ? 'Curated Seed Signal' : 'Curated Seed Signal'}
                  </span>

                  <button
                    onClick={() => handleConnect(t)}
                    disabled={connectingTrend === t.topic}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  >
                    {connectingTrend === t.topic ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        <span>Turn Trend into Post</span>
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
