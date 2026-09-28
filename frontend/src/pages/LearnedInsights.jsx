import React, { useState, useEffect } from 'react';
import { getMemories, getReflection } from '../services/api';
import FormattedText from '../components/common/FormattedText';
import { 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  AlertCircle, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function LearnedInsights() {
  const [memories, setMemories] = useState([]);
  const [reflection, setReflection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [memRes, refRes] = await Promise.all([
        getMemories(),
        getReflection('Based on all retained experiences, summarize what styles and topics succeed vs what fails for this audience.'),
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
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            What SocialMind Has Learned
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audience intelligence and strategic memory synthesized directly by <span className="font-semibold text-slate-700">Hindsight Cloud</span> from historical performance.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Reflection</span>
        </button>
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
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Hindsight Cognitive Reflection Synthesis
            </h2>
          </div>
          <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">
            Operation: reflect()
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            SocialMind is synthesizing strategic patterns across all retained experiences...
          </div>
        ) : reflection ? (
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <FormattedText 
              text={reflection} 
              className="text-xs text-slate-700 leading-relaxed font-sans" 
            />
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">
            No reflection available.
          </p>
        )}
      </div>

      {/* Retained Memory Bank Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Retained Episodic Memory Bank
            </h2>
          </div>
          <span className="text-xs text-slate-600 font-mono">
            {memories.length} Retained Experiences in Bank "Social-Media-Agent"
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {loading ? (
            <div className="col-span-2 py-8 text-center text-xs text-slate-400">
              Loading memory items from Hindsight...
            </div>
          ) : memories.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-xs text-slate-400">
              No memories found.
            </div>
          ) : (
            memories.map((mem, idx) => {
              const isPositive = !mem.content?.toLowerCase().includes('underperformed') && !mem.content?.toLowerCase().includes('ineffective');
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
                  <div className="flex-1 space-y-1">
                    <FormattedText 
                      text={mem.content} 
                      className="text-xs text-slate-800 leading-relaxed font-medium font-sans" 
                    />
                    {mem.date && (
                      <span className="block text-[10px] text-slate-400 font-mono">
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
