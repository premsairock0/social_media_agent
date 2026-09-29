import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { getTrends, connectTrendToContent } from '../services/api';
import { 
  Flame, 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  Linkedin, 
  Instagram,
  TrendingUp,
  Tag,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TrendIntelligence() {
  const { platform, setPlatform, setIdea } = useContent();
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Trend Intelligence
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Connect external momentum topics to your <span className="font-semibold text-slate-700">{platform}</span> audience via Hindsight experiential memory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Platform Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
              <button
                onClick={() => setPlatform('LinkedIn')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  platform === 'LinkedIn'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                <span>LinkedIn</span>
              </button>
              <button
                onClick={() => setPlatform('Instagram')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  platform === 'Instagram'
                    ? 'bg-white text-pink-700 shadow-sm'
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Trends</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Intelligence Pipeline Diagram Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Flame className="h-4 w-4 text-amber-300" />
          </div>
          <div>
            <span className="font-bold block text-sm">Trend-to-Content Pipeline</span>
            <span className="text-slate-400">
              Trend → Platform ({platform}) → Audience Needs → Hindsight Memory → Grounded Post
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono text-[11px] border border-slate-700">
          Source: Verified Momentum Signals
        </span>
      </div>

      {/* Connected Strategy Modal / Output */}
      {connectedStrategy && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-md p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Trend Bridge Output
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {connectedStrategy.trendTopic}
              </h3>
            </div>
            <button
              onClick={() => setConnectedStrategy(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close Preview
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Strategic Angle & Hook
              </span>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <p className="font-semibold text-slate-900">"{connectedStrategy.hook}"</p>
                <p className="text-slate-600">{connectedStrategy.strategicAngle}</p>
                <span className="inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Format: {connectedStrategy.recommendedFormat}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Why This Works (Hindsight Evidence)
              </span>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
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
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Copy'}</span>
              </button>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-sans text-xs whitespace-pre-wrap leading-relaxed">
              {connectedStrategy.generatedPost}
            </div>
          </div>
        </div>
      )}

      {/* Trends List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400">
            Loading trending industry signals...
          </div>
        ) : trends.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400">
            No active trends found for this platform.
          </div>
        ) : (
          trends.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {t.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Platform: {t.platform}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                    {t.topic}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono text-blue-600 block">
                    {t.growthScore}/100
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase">Momentum</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.description}
              </p>

              {/* Suggested Angles */}
              {t.suggestedAngles?.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    High-Converting Angles:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-700">
                    {t.suggestedAngles.slice(0, 2).map((angle, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{angle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  Source: {t.sourceType === 'seed' ? 'Curated Seed Signal' : 'Live Detection'}
                </span>

                <button
                  onClick={() => handleConnect(t)}
                  disabled={connectingTrend === t.topic}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
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
          ))
        )}
      </div>
    </div>
  );
}
