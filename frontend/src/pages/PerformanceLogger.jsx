import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { recordPerformance, getPosts } from '../services/api';
import FormattedText from '../components/common/FormattedText';
import { 
  TrendingUp, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function PerformanceLogger() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result: contextResult, idea } = useContent();

  // If navigated from CreateContent/StrategyView, pre-populate post details, or fallback to ContentContext
  const prefill = location.state?.postData || (contextResult ? {
    topic: idea?.substring(0, 60) || 'AI Strategy',
    style: contextResult.strategy ? contextResult.strategy.split('.')[0] : 'Technical Retrospective',
    hook: contextResult.hook || '',
    content: contextResult.generatedPost || '',
  } : null);

  const [postsList, setPostsList] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState('');

  const [formData, setFormData] = useState({
    topic: prefill?.topic || 'AI Agent Software Testing Automation',
    style: prefill?.style || 'Technical Retrospective',
    hook: prefill?.hook || 'We deployed an autonomous AI testing agent that cut QA cycles by 80%...',
    content: prefill?.content || '',
    impressions: 12000,
    likes: 650,
    comments: 75,
    shares: 40,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch posts so user can select an existing one
    getPosts()
      .then((res) => {
        setPostsList(res.data.data || []);
      })
      .catch((err) => console.log('Could not fetch posts for dropdown:', err));
  }, []);

  const handleSelectPost = (e) => {
    const pId = e.target.value;
    setSelectedPostId(pId);
    if (!pId) return;

    const found = postsList.find((p) => p._id === pId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        topic: found.topic,
        style: found.style,
        hook: found.hook || '',
        content: found.content || '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await recordPerformance({
        postId: selectedPostId || undefined,
        topic: formData.topic,
        style: formData.style,
        hook: formData.hook,
        content: formData.content,
        impressions: Number(formData.impressions),
        likes: Number(formData.likes),
        comments: Number(formData.comments),
        shares: Number(formData.shares),
      });

      setResult(response.data.data);
    } catch (err) {
      console.error('Error recording performance:', err);
      setError(
        err.response?.data?.details || 
        err.response?.data?.error || 
        'Failed to record performance and retain memory. Check backend logs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Performance Logger & Feedback Loop
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          This step triggers the <span className="font-semibold text-slate-700">FEEDBACK → RETAIN</span> stage: Analytics computes engagement, the LLM reflects on the outcome, and Hindsight stores the new experience in long-term memory.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {postsList.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Select Existing Post (Optional)
              </label>
              <select
                value={selectedPostId}
                onChange={handleSelectPost}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
              >
                <option value="">-- Choose a post or enter custom details below --</option>
                {postsList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.topic} ({p.style})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Post Topic *
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Content Style *
              </label>
              <input
                type="text"
                required
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Opening Hook / Headline
            </label>
            <input
              type="text"
              value={formData.hook}
              onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Numerical Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 block">
                Impressions *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.impressions}
                onChange={(e) => setFormData({ ...formData, impressions: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 block">
                Likes *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.likes}
                onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 block">
                Comments *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 block">
                Shares *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>Pipeline: Analytics → LLM Reflection → Hindsight RETAIN</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Analyzing & Retaining in Hindsight...</span>
                </>
              ) : (
                <>
                  <span>Analyze Performance</span>
                  <ArrowRight className="h-4 w-4" />
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

      {/* FEEDBACK & RETAIN RESULTS */}
      {result && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5 animate-in fade-in duration-200">
          {/* Status Badge */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>✓ New experience added to SocialMind memory</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Retained in Bank: Social-Media-Agent
            </span>
          </div>

          {/* Performance Summary Cards */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Performance Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block">Engagement Rate</span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                  {result.metrics?.engagementRate}%
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block">Benchmark Baseline</span>
                <span className="text-xl font-bold font-mono text-slate-600 mt-1 block">
                  {result.comparison?.benchmarkRate}%
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block">Relative Performance</span>
                <span className={`text-xl font-bold font-mono mt-1 block ${
                  Number(result.comparison?.delta || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {Number(result.comparison?.delta || 0) >= 0 ? '+' : ''}
                  {result.comparison?.delta}% vs baseline
                </span>
                <span className={`text-[10px] block mt-0.5 font-medium ${
                  result.comparison?.isSmallSample ? 'text-amber-700' : 'text-slate-500'
                }`}>
                  Interpretation: {result.comparison?.performanceLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Small Sample Size Warning Banner */}
          {result.comparison?.isSmallSample && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Early Signal Notice (Sample &lt; 100 Impressions)</span>
                <span className="text-amber-800">
                  Sample size is too small to confidently conclude this content pattern caused the observed engagement. Hindsight retains this as an early signal rather than a validated audience preference.
                </span>
              </div>
            </div>
          )}

          {/* What SocialMind Learned */}
          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4" />
              <span>What SocialMind Learned</span>
            </span>
            <div className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
              <FormattedText text={result.learnedExperience} className="text-xs text-slate-800 font-sans" />
            </div>
          </div>

          {/* Loop Progression Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              This experience is now indexed for future recall queries.
            </span>

            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Generate Another Strategy (Testing Recall)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
