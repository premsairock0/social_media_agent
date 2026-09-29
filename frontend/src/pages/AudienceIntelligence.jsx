import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { getAudienceInsights } from '../services/api';
import { 
  Users, 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Linkedin, 
  Instagram,
  BarChart3,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AudienceIntelligence() {
  const { platform, setPlatform } = useContent();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAudienceInsights(platform);
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch audience insights:', err);
      setError('Unable to load audience insights. Please verify backend connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [platform]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Audience Intelligence
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              What does your <span className="font-semibold text-slate-700">{platform}</span> audience actually care about? Synthesized from MongoDB telemetry and Hindsight cognitive reflection.
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
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
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

      {/* Grounding Notice Badge */}
      {data?.dataSource && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-800">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="font-medium">{data.dataSource.label}</span>
          </div>
          <span className="text-[11px] font-mono text-blue-700">
            {data.dataSource.seedCount} Seed Posts | {data.dataSource.liveCount} Live Experiences
          </span>
        </div>
      )}

      {/* Cognitive Reflection Synthesis Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Hindsight Cognitive Audience Synthesis
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Platform: {platform}
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Synthesizing audience behavioral patterns from Hindsight bank...
          </div>
        ) : (
          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
            {data?.hindsightSynthesis || 'No audience synthesis available.'}
          </div>
        )}
      </div>

      {/* Primary Grid: Formats & Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preferred Content Formats */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Preferred Content Formats
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Ranked by Avg Engagement</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading formats...</div>
            ) : data?.formatPreferences?.length > 0 ? (
              data.formatPreferences.slice(0, 5).map((f, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{f.format}</span>
                      {i === 0 && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          Top Performer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {f.postCount} posts analyzed ({f.totalImpressions?.toLocaleString()} impressions)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-emerald-600 block">
                      {f.avgEngagementRate}%
                    </span>
                    <span className="text-[10px] text-slate-400">Avg Rate</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No format telemetry available.</p>
            )}
          </div>
        </div>

        {/* High-Performing Topics vs Weak Engagement */}
        <div className="space-y-6">
          {/* Top Interests */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  High-Resonance Topics
                </h2>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">&gt; 3.0% engagement</span>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="py-4 text-center text-xs text-slate-400">Loading topics...</div>
              ) : data?.topInterests?.length > 0 ? (
                data.topInterests.map((t, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 bg-emerald-50/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 block truncate max-w-xs">{t.topic}</span>
                      <span className="text-[10px] text-slate-500">{t.style}</span>
                    </div>
                    <span className="font-bold font-mono text-emerald-700">
                      {t.engagementRate}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-2">No top topics recorded.</p>
              )}
            </div>
          </div>

          {/* Weak Topics to Avoid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-rose-500" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Underperforming Topics / Formats
                </h2>
              </div>
              <span className="text-[11px] text-rose-600 font-semibold">&lt; 2.0% engagement</span>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="py-4 text-center text-xs text-slate-400">Loading weak topics...</div>
              ) : data?.weakTopics?.length > 0 ? (
                data.weakTopics.map((t, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 bg-rose-50/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 block truncate max-w-xs">{t.topic}</span>
                      <span className="text-[10px] text-slate-500">{t.style}</span>
                    </div>
                    <span className="font-bold font-mono text-rose-600">
                      {t.engagementRate}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-2">No low-performing topics identified.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
