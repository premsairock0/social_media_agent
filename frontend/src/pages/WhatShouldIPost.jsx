import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { whatToPost } from '../services/api';
import { 
  HelpCircle, 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  ArrowRight, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  Layers, 
  Flame, 
  Linkedin, 
  Instagram,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WhatShouldIPost() {
  const { platform, setPlatform, setIdea } = useContent();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [goal, setGoal] = useState('Engagement');
  const [audience, setAudience] = useState('Tech Founders, Developers & Engineers');

  const handleAsk = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await whatToPost({
        platform,
        audience,
        goal,
      });
      setRecommendation(res.data.data);
    } catch (err) {
      console.error('What to post failed:', err);
      setError(err.response?.data?.error || 'Failed to synthesize recommendation. Check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!recommendation?.readyPostCopy) return;
    navigator.clipboard.writeText(recommendation.readyPostCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransferToStudio = () => {
    if (recommendation?.recommendedTopic) {
      setIdea(recommendation.recommendedTopic);
    }
    navigate('/create');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                Hero Intelligence
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                What Should I Post?
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              SocialPulse analyzes your <span className="font-semibold text-slate-700">{platform}</span> audience, past wins/flops from Hindsight memory, and timely trends to prescribe your next high-leverage post.
            </p>
          </div>

          {/* Platform Pills */}
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

      {/* Control Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Target Audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Primary Objective
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="Engagement">Maximize Discussion & Engagement</option>
              <option value="Thought Leadership">Establish Deep Authority</option>
              <option value="Saves & Shares">Drive Bookmarks / Resource Saves</option>
              <option value="Community Growth">Expand Network & Follower Reach</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <BrainCircuit className="h-4 w-4 text-blue-600" />
            <span>Consulting Hindsight bank + active momentum trends</span>
          </div>

          <button
            onClick={handleAsk}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Synthesizing Audience Memory & Trends...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Ask SocialPulse: What Should I Post?</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Recommendation Results */}
      {recommendation && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Hero Recommendation Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Recommended For {recommendation.platform}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {recommendation.recommendedTopic}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  Format: {recommendation.recommendedFormat}
                </span>
                {recommendation.confidenceScore && (
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    Confidence: {recommendation.confidenceScore}
                  </span>
                )}
              </div>
            </div>

            {/* Strategic Rationale */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-blue-600" />
                <span>Why This Content Will Succeed</span>
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {recommendation.reasonForRecommendation}
              </p>
            </div>

            {/* Supporting Hindsight Evidence */}
            {recommendation.supportingEvidence && recommendation.supportingEvidence.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Supporting Hindsight Evidence & Lessons
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendation.supportingEvidence.map((ev, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-[11px]">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Recalled Memory #{i + 1}</span>
                      </div>
                      <p className="text-slate-800 font-medium text-[11px]">
                        "{ev.memorySnippet}"
                      </p>
                      <p className="text-slate-500 text-[10px] border-t border-slate-100 pt-1 mt-1">
                        Application: {ev.lesson}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Direction & Blueprint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Suggested Hook
                </span>
                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs font-semibold text-blue-900">
                  "{recommendation.suggestedHook}"
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Suggested Call-To-Action (CTA)
                </span>
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs font-semibold text-emerald-900">
                  "{recommendation.suggestedCTA}"
                </div>
              </div>
            </div>

            {/* Bulleted Direction */}
            {recommendation.contentDirection && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Content Flow Direction
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  {recommendation.contentDirection.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-blue-600 shrink-0">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ready to Publish Copy */}
            {recommendation.readyPostCopy && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Ready-To-Publish Post / Caption Copy
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-sans text-xs whitespace-pre-wrap leading-relaxed">
                  {recommendation.readyPostCopy}
                </div>
              </div>
            )}

            {/* Visual Concept (if Instagram) */}
            {recommendation.visualConcept && (
              <div className="p-3.5 rounded-lg bg-pink-50 border border-pink-200 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-800">
                  Instagram Visual Creative Direction
                </span>
                <p className="text-xs text-pink-900">
                  {recommendation.visualConcept}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Grounding: Hindsight Memory Bank 'Social-Media-Agent'
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTransferToStudio}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <span>Open in Content Studio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
