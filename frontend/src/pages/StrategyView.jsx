import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  Bookmark, 
  Lightbulb,
  HelpCircle,
  PenTool
} from 'lucide-react';

export default function StrategyView() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // Retrieve strategy from location state or provide guidance if navigated directly
  const data = location.state?.strategyData;

  const handleCopy = () => {
    if (!data?.generatedPost) return;
    navigator.clipboard.writeText(data.generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">No Active Strategy to Display</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Submit a topic idea in the <span className="font-semibold text-slate-700">Create Content</span> view to recall past memories from Hindsight and generate a new strategy.
        </p>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <PenTool className="h-3.5 w-3.5" />
          <span>Go to Create Content</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Strategy & Memory Synthesis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Engineered from <span className="font-semibold text-slate-700">{data.memoriesUsed?.length || 0} recalled memories</span> in Hindsight Cloud.
          </p>
        </div>

        <Link
          to="/performance"
          state={{
            postData: {
              topic: data.idea?.substring(0, 60) || 'AI Strategy',
              style: data.strategy ? data.strategy.split('.')[0] : 'Technical Retrospective',
              hook: data.hook || '',
              content: data.generatedPost || '',
            },
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <span>Log Performance When Published</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Recalled Memories Callout */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Recalled Audience Experiences
            </h2>
          </div>
          <span className="text-xs text-blue-700 font-mono bg-blue-50 px-2 py-0.5 rounded">
            Live Memory Bank
          </span>
        </div>

        <div className="space-y-2.5">
          {data.memoriesUsed?.map((mem, idx) => (
            <div
              key={mem.id || idx}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-slate-700 flex items-start gap-2.5"
            >
              <span className="font-mono text-blue-600 font-bold shrink-0">#{idx + 1}</span>
              <p className="flex-1 leading-relaxed">{mem.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Breakdown & Post Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Strategic Rationale
              </h2>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">Content Angle</span>
              <p className="text-xs font-medium text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200">
                {data.strategy}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">Recommended Hook</span>
              <p className="text-xs font-mono text-blue-900 bg-blue-50/70 p-2.5 rounded border border-blue-200">
                "{data.hook}"
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">Structure</span>
              <pre className="text-xs text-slate-700 font-mono bg-slate-50 p-3 rounded border border-slate-200 whitespace-pre-wrap leading-relaxed">
                {data.structure}
              </pre>
            </div>

            <div>
              <span className="text-xs font-semibold text-rose-600 block mb-1">Things to Avoid</span>
              <p className="text-xs text-rose-800 bg-rose-50 p-2.5 rounded border border-rose-200">
                {data.thingsToAvoid}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Why Was This Chosen?
              </h2>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-blue-50/40 p-3.5 rounded-lg border border-blue-100">
              {data.whyThisStrategy}
            </p>
          </div>
        </div>

        {/* Post Preview Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Ready-to-Publish LinkedIn Post
                </h2>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans min-h-[380px]">
              {data.generatedPost}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
