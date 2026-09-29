import React, { useState, useEffect } from 'react';
import { getMemories, getReflection } from '../services/api';
import { useContent } from '../context/ContentContext';
import FormattedText from '../components/common/FormattedText';
import { 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  BookOpen,
  Linkedin,
  Instagram,
  Tag,
  Filter
} from 'lucide-react';

export default function LearnedInsights() {
  const { platform, setPlatform } = useContent();
  const [memories, setMemories] = useState([]);
  const [reflection, setReflection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [memRes, refRes] = await Promise.all([
        getMemories(),
        getReflection(`Based on all retained experiences, summarize what styles, topics, and formats succeed vs what fails for the ${platform} audience.`),
      ]);

      setMemories(memRes.data.data || []);
      setReflection(refRes.data.data?.text || '');
    } catch (err) {
      console.error('Error fetching learned insights:', err);
      setError('Unable to fetch live reflection from Hindsight Cloud. Please verify connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [platform]);

  const filteredMemories = memories.filter((mem) => {
    if (filterPlatform === 'ALL') return true;
    const content = (mem.content || '').toLowerCase();
    if (filterPlatform === 'Instagram') {
      return content.includes('instagram') || content.includes('carousel') || content.includes('reel');
    }
    if (filterPlatform === 'LinkedIn') {
      return !content.includes('instagram') || content.includes('linkedin');
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            What SocialPulse Has Learned
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audience intelligence, platform patterns, and strategic memory synthesized directly by <span className="font-semibold text-slate-700">Hindsight Cloud</span> from real performance outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Reflection</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Strategic Synthesis Card from Hindsight reflect() */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Hindsight Cognitive Reflection Synthesis ({platform})
            </h2>
          </div>
          <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">
            Operation: reflect()
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            SocialPulse is synthesizing strategic patterns across all retained experiences...
          </div>
        ) : reflection ? (
          <div className="prose prose-sm max-w-none text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 p-5 rounded-lg border border-slate-200 whitespace-pre-wrap">
            <FormattedText text={reflection} />
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">
            No reflection available.
          </p>
        )}
      </div>

      {/* Retained Memory Bank Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Retained Episodic Memory Bank
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
              <button
                type="button"
                onClick={() => setFilterPlatform('ALL')}
                className={`px-2 py-1 rounded font-medium ${filterPlatform === 'ALL' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterPlatform('LinkedIn')}
                className={`px-2 py-1 rounded font-medium ${filterPlatform === 'LinkedIn' ? 'bg-white shadow-xs text-blue-700 font-bold' : 'text-slate-500'}`}
              >
                LinkedIn
              </button>
              <button
                type="button"
                onClick={() => setFilterPlatform('Instagram')}
                className={`px-2 py-1 rounded font-medium ${filterPlatform === 'Instagram' ? 'bg-white shadow-xs text-pink-700 font-bold' : 'text-slate-500'}`}
              >
                Instagram
              </button>
            </div>

            <span className="text-xs text-slate-500 font-mono">
              {filteredMemories.length} Retained Experiences
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {loading ? (
            <div className="col-span-2 py-8 text-center text-xs text-slate-400">
              Loading memory items from Hindsight Cloud...
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-xs text-slate-400">
              No memories found matching this filter.
            </div>
          ) : (
            filteredMemories.map((mem, idx) => {
              const isPositive = !mem.content?.toLowerCase().includes('underperformed') && !mem.content?.toLowerCase().includes('ineffective');
              const isIg = mem.content?.toLowerCase().includes('instagram') || mem.content?.toLowerCase().includes('carousel');
              return (
                <div
                  key={mem.id || idx}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 flex items-start gap-3 text-xs"
                >
                  <div className="mt-0.5 shrink-0">
                    {isPositive ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isIg ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {isIg ? 'Instagram' : 'LinkedIn'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {(mem.id || '').substring(0, 8)}
                      </span>
                    </div>

                    <FormattedText text={mem.content} className="text-slate-800 leading-relaxed font-medium" />

                    {mem.date && (
                      <span className="block text-[10px] text-slate-400 font-mono pt-1">
                        Indexed: {new Date(mem.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
