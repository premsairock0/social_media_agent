import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { generateStrategy, studioAction } from '../services/api';
import { 
  PenTool, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Film, 
  Hash, 
  Zap, 
  MessageSquare, 
  RefreshCw, 
  AlertCircle, 
  Linkedin, 
  Instagram, 
  BookOpen,
  ArrowRight,
  SlidersHorizontal,
  FileEdit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STUDIO_ACTIONS = [
  { id: 'generate_post', label: 'Full Post / Caption', icon: PenTool, desc: 'Generate complete post based on Hindsight memory' },
  { id: 'improve_hook', label: 'Improve Hook', icon: Zap, desc: 'Formulate 3 high-converting opening hooks' },
  { id: 'generate_cta', label: 'Generate CTA', icon: MessageSquare, desc: 'Drive high comments and shares' },
  { id: 'generate_hashtags', label: 'Hashtag Strategy', icon: Hash, desc: 'Targeted niche and reach tags' },
  { id: 'suggest_carousel', label: 'Suggest Carousel', icon: Layers, desc: '5-slide educational walkthrough' },
  { id: 'suggest_reel', label: 'Suggest Reel Idea', icon: Film, desc: '30s video concept & audio hook' },
  { id: 'rewrite_content', label: 'Rewrite Content', icon: FileEdit, desc: 'Transform rough notes into platform copy' },
];

export default function ContentStudio() {
  const { platform, setPlatform, idea, setIdea, goal, setGoal, setResult } = useContent();
  const navigate = useNavigate();

  const [activeAction, setActiveAction] = useState('generate_post');
  const [inputContent, setInputContent] = useState(idea || '');
  const [styleTone, setStyleTone] = useState('Professional & Practical');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studioResult, setStudioResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleExecute = async (e) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) {
      setError('Please provide a topic or draft text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeAction === 'generate_post') {
        // Execute full cognitive strategy generation
        const res = await generateStrategy({
          idea: inputContent,
          platform,
          goal,
          targetAudience: 'Tech Founders & Developers',
        });
        setResult(res.data.data);
        navigate('/strategy');
      } else {
        // Execute specialized micro-action
        const res = await studioAction({
          action: activeAction,
          platform,
          input: inputContent,
          style: styleTone,
          goal,
        });
        setStudioResult(res.data.data);
      }
    } catch (err) {
      console.error('Studio action failed:', err);
      setError(err.response?.data?.error || 'Action failed. Check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
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
              Content Studio
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create, refine, and optimize <span className="font-semibold text-slate-700">{platform}</span> content backed by Hindsight memory and audience preferences.
            </p>
          </div>

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
        </div>
      </div>

      {/* Action Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STUDIO_ACTIONS.map((act) => {
          const Icon = act.icon;
          const isActive = activeAction === act.id;
          return (
            <button
              key={act.id}
              onClick={() => {
                setActiveAction(act.id);
                setStudioResult(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>

      {/* Studio Input Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <form onSubmit={handleExecute} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Topic, Raw Notes, or Existing Draft *</span>
              <span className="text-[10px] text-slate-400 font-normal">Platform: {platform}</span>
            </label>
            <textarea
              required
              rows={4}
              value={inputContent}
              onChange={(e) => {
                setInputContent(e.target.value);
                setIdea(e.target.value);
              }}
              placeholder={
                platform === 'Instagram'
                  ? 'e.g. 5 system design concepts every backend engineer should know for carousel breakdown...'
                  : 'e.g. How we migrated from microservices back to a modular monolith and reduced API latency by 40%...'
              }
              className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Tone & Writing Style
              </label>
              <select
                value={styleTone}
                onChange={(e) => setStyleTone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Professional & Practical">Professional & Practical</option>
                <option value="Candid Storytelling">Candid Engineering Storytelling</option>
                <option value="Contrarian & Thought-Provoking">Contrarian & Thought-Provoking</option>
                <option value="Casual & Conversational">Casual & Conversational (Instagram Native)</option>
                <option value="Educational Breakdown">Educational Breakdown / Step-by-Step</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Target Objective
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Engagement">Maximize Discussion & Engagement</option>
                <option value="Saves & Bookmarks">Drive Bookmarks / Resource Saves</option>
                <option value="Thought Leadership">Authority & Trust Building</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {activeAction === 'generate_post' 
                ? 'Triggers full Hindsight cognitive recall + post synthesis'
                : `Executes ${activeAction.replace('_', ' ')} with Hindsight grounding`}
            </span>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing with Hindsight & LLM...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {activeAction === 'generate_post' ? 'Generate Full Strategy & Post' : 'Execute Studio Action'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Studio Action Results */}
      {studioResult && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Studio Output ({platform})
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1 capitalize">
                {studioResult.action?.replace('_', ' ')}
              </h2>
            </div>

            <button
              onClick={() => handleCopyText(studioResult.result || '')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied Primary' : 'Copy Output'}</span>
            </button>
          </div>

          {/* Primary Result */}
          {studioResult.result && (
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-sans text-xs whitespace-pre-wrap leading-relaxed">
              {studioResult.result}
            </div>
          )}

          {/* Variations if available */}
          {studioResult.variations?.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Alternative Variations
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {studioResult.variations.map((v, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-blue-700 text-[11px] block">{v.label}</span>
                      <p className="text-slate-800 mt-1 leading-relaxed">{v.content}</p>
                    </div>
                    <button
                      onClick={() => handleCopyText(v.content)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium text-left pt-1"
                    >
                      Copy this option →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Studio Pro-Tip */}
          {studioResult.recommendations && (
            <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
              <span className="font-bold block">SocialPulse Strategic Insight</span>
              <p>{studioResult.recommendations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
