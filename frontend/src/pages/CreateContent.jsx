import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { generateStrategy } from '../services/api';
import FormattedText from '../components/common/FormattedText';
import { 
  Sparkles, 
  BrainCircuit, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  Bookmark, 
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Trash2,
  Shuffle,
  ChevronDown,
  Layers,
  Dices,
  X,
  Plus,
  Users
} from 'lucide-react';
import { PREPROMPTS, getRandomPreprompt, AUDIENCE_OPTIONS } from '../data/preprompts';

export default function CreateContent() {
  const navigate = useNavigate();
  const { 
    idea, 
    setIdea, 
    goal, 
    setGoal, 
    audience, 
    setAudience, 
    result, 
    setResult, 
    clearResult,
    resetAll,
    applyPreprompt
  } = useContent();

  const [promptDropdownOpen, setPromptDropdownOpen] = useState(false);
  const [audienceDropdownOpen, setAudienceDropdownOpen] = useState(false);
  const [customAudienceInput, setCustomAudienceInput] = useState('');

  // Identify currently matched preprompt if any
  const activePreprompt = PREPROMPTS.find((p) => p.idea === idea);

  // Parse comma-separated audience string into an array of selected roles
  const selectedAudiences = audience
    ? audience.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleToggleAudience = (role) => {
    let updated;
    if (selectedAudiences.includes(role)) {
      updated = selectedAudiences.filter((item) => item !== role);
    } else {
      updated = [...selectedAudiences, role];
    }
    setAudience(updated.join(', '));
  };

  const handleRemoveAudience = (roleToRemove) => {
    const updated = selectedAudiences.filter((item) => item !== roleToRemove);
    setAudience(updated.join(', '));
  };

  const handleAddCustomAudience = (e) => {
    if (e) e.preventDefault();
    const trimmed = customAudienceInput.trim();
    if (!trimmed) return;
    if (!selectedAudiences.includes(trimmed)) {
      const updated = [...selectedAudiences, trimmed];
      setAudience(updated.join(', '));
    }
    setCustomAudienceInput('');
  };

  const handleShufflePrompt = () => {
    const next = getRandomPreprompt(activePreprompt?.id);
    if (applyPreprompt) {
      applyPreprompt(next);
    } else {
      setIdea(next.idea);
      setGoal(next.goal);
      setAudience(next.audience);
    }
  };

  const handleSelectPreprompt = (prompt) => {
    if (applyPreprompt) {
      applyPreprompt(prompt);
    } else {
      setIdea(prompt.idea);
      setGoal(prompt.goal);
      setAudience(prompt.audience);
    }
    setPromptDropdownOpen(false);
  };
  
  // Loading & Multi-Stage indicator
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);

    // Multi-stage loading progression for cognitive pipeline transparency
    setLoadingStage('SocialMind is recalling what worked before from Hindsight...');
    const stageTimer1 = setTimeout(() => {
      setLoadingStage('SocialMind is reasoning from past audience experiences with LLM...');
    }, 2500);

    const stageTimer2 = setTimeout(() => {
      setLoadingStage('Generating tailored LinkedIn post and strategic recommendations...');
    }, 5500);

    try {
      const response = await generateStrategy({
        idea,
        goal,
        targetAudience: audience,
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      const strategyPayload = {
        ...response.data.data,
        idea,
        goal,
        targetAudience: audience,
      };
      setResult(strategyPayload);

      // Navigate directly to Strategy View as requested
      navigate('/strategy', { state: { strategyData: strategyPayload } });
    } catch (err) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      console.error('Error generating strategy:', err);
      setError(
        err.response?.data?.details || 
        err.response?.data?.error || 
        'Failed to generate strategy. Please ensure the backend and Hindsight Cloud are reachable.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.generatedPost) return;
    navigator.clipboard.writeText(result.generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogPerformance = () => {
    if (!result) return;
    navigate('/performance', {
      state: {
        postData: {
          topic: idea.substring(0, 60),
          style: result.strategy ? result.strategy.split('.')[0] : 'Technical Retrospective',
          hook: result.hook || '',
          content: result.generatedPost || '',
        },
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create Content with Hindsight
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            SocialMind queries long-term memory to recall previous audience responses before writing a single word.
          </p>
        </div>

        {result && (
          <button
            type="button"
            onClick={clearResult}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors shadow-sm self-start sm:self-auto"
            title="Clear the generated draft to create a fresh post"
          >
            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Clear Output</span>
          </button>
        )}
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  What do you want to post about? *
                </label>
                {activePreprompt && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>Prompt #{activePreprompt.id}: {activePreprompt.title}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 relative">
                {/* Shuffle / Random Example Button */}
                <button
                  type="button"
                  onClick={handleShufflePrompt}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs group"
                  title="Shuffle to another example (guaranteed different prompt)"
                >
                  <Shuffle className="h-3 w-3 text-blue-600 group-hover:rotate-180 transition-transform duration-300" />
                  <span>Shuffle Example {activePreprompt ? `(${activePreprompt.id}/15)` : ''}</span>
                </button>

                {/* Dropdown for All 15 Examples */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPromptDropdownOpen(!promptDropdownOpen)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs"
                    title="Browse all 15 pre-written prompts"
                  >
                    <Layers className="h-3 w-3 text-slate-500" />
                    <span>Browse 15 Examples</span>
                    <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${promptDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {promptDropdownOpen && (
                    <>
                      {/* Invisible backdrop to dismiss when clicking outside */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setPromptDropdownOpen(false)} 
                      />
                      <div className="absolute right-0 mt-1.5 w-80 sm:w-96 max-h-80 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-2 divide-y divide-slate-100">
                        <div className="px-2.5 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                          <span>15 Curated Preprompts</span>
                          <span className="text-[10px] text-blue-600 font-mono">Click to load</span>
                        </div>
                        <div className="space-y-1 pt-1">
                          {PREPROMPTS.map((p) => {
                            const isSelected = activePreprompt?.id === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => handleSelectPreprompt(p)}
                                className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 group ${
                                  isSelected 
                                    ? 'bg-blue-50/90 border border-blue-200 text-blue-900' 
                                    : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                                }`}
                              >
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5 ${
                                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                                }`}>
                                  #{p.id}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-semibold truncate group-hover:text-blue-600">
                                      {p.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 shrink-0">
                                      {p.category}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                    {p.idea}
                                  </p>
                                </div>
                                {isSelected && (
                                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOtherAudienceMode(false);
                    resetAll();
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1"
                  title="Reset form to defaults"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
            <textarea
              required
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="e.g. We deployed an autonomous AI debugging agent that cut production incident MTTR from 4 hours to 18 minutes."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Primary Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600 block">
                  Target Audience
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    {selectedAudiences.length} {selectedAudiences.length === 1 ? 'role' : 'roles'} selected
                  </span>
                  {selectedAudiences.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAudience('')}
                      className="text-[10px] text-slate-400 hover:text-slate-600 font-medium underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Multi-Select Pills Container and Dropdown Trigger */}
              <div className="relative">
                <div className="min-h-[42px] w-full rounded-lg border border-slate-300 p-1.5 bg-white flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
                  {selectedAudiences.map((aud) => (
                    <span
                      key={aud}
                      className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs animate-fadeIn"
                    >
                      <span>{aud}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAudience(aud)}
                        className="text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded p-0.5 transition-colors"
                        title={`Remove ${aud}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

                  <button
                    type="button"
                    onClick={() => setAudienceDropdownOpen(!audienceDropdownOpen)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="h-3 w-3 text-slate-500" />
                    <span>Select Roles</span>
                    <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${audienceDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {selectedAudiences.length === 0 && (
                    <span className="text-xs text-slate-400 px-1 py-1">
                      Choose roles below or click Select Roles
                    </span>
                  )}
                </div>

                {/* Dropdown Menu */}
                {audienceDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAudienceDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-1.5 w-full sm:w-80 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-2 space-y-2">
                      <div className="px-2 pt-1 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Select Multiple Roles
                        </span>
                        <span className="text-[10px] text-blue-600 font-mono">
                          {selectedAudiences.length} chosen
                        </span>
                      </div>

                      {/* 8 Core Options */}
                      <div className="max-h-52 overflow-y-auto space-y-0.5">
                        {AUDIENCE_OPTIONS.map((opt) => {
                          const isChecked = selectedAudiences.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleToggleAudience(opt)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                isChecked
                                  ? 'bg-blue-50 text-blue-800 font-semibold'
                                  : 'hover:bg-slate-50 text-slate-700 font-normal'
                              }`}
                            >
                              <span>{opt}</span>
                              {isChecked ? (
                                <Check className="h-3.5 w-3.5 text-blue-600" />
                              ) : (
                                <div className="h-3.5 w-3.5 rounded border border-slate-300" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom 'Other' Option */}
                      <div className="pt-2 border-t border-slate-100 px-1 space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-600 block">
                          Other (Add Custom Audience)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={customAudienceInput}
                            onChange={(e) => setCustomAudienceInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomAudience(e);
                              }
                            }}
                            placeholder="e.g. Fintech CTOs, Web3 Devs..."
                            className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomAudience}
                            disabled={!customAudienceInput.trim()}
                            className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-40 transition-colors shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Preset Toggle Chips */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Quick toggle:</span>
                {AUDIENCE_OPTIONS.map((opt) => {
                  const isSelected = selectedAudiences.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleToggleAudience(opt)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-2.5 w-2.5" />
                      ) : (
                        <Plus className="h-2.5 w-2.5 text-slate-400" />
                      )}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <BrainCircuit className="h-4 w-4 text-blue-600" />
              <span>Step: Hindsight RECALL → LLM REASON</span>
            </div>

            <div className="flex items-center gap-2">
              {result && (
                <button
                  type="button"
                  onClick={() => navigate('/strategy', { state: { strategyData: result } })}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>View Strategy & Schedule</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Processing Cognitive Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{result ? 'Regenerate Strategy' : 'Generate Strategy'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
              </button>
            </div>
          </div>
        </form>

        {/* Multi-Stage Loading Feedback */}
        {loading && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium space-y-1.5 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
              <span className="font-semibold">{loadingStage}</span>
            </div>
            <p className="text-[11px] text-blue-600 font-mono">
              Interacting live with Hindsight Cloud Bank: Social-Media-Agent & Groq (openai/gpt-oss-120b)
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* RESULT SECTIONS (A, B, C, D) */}
      {result && (
        <div className="space-y-6">
          {/* SECTION A: MEMORY RECALL */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  A. Memory Recall — What SocialMind Remembers
                </h2>
              </div>
              <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">
                {result.memoriesUsed?.length || 0} Relevant Memories Retrieved
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Before drafting copy, SocialMind queried Hindsight for experiences matching your request:
            </p>

            <div className="space-y-2.5 pt-1">
              {result.memoriesUsed?.map((mem, idx) => (
                <div
                  key={mem.id || idx}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-slate-800 flex items-start gap-3"
                >
                  <span className="font-mono text-blue-600 font-bold shrink-0">#{idx + 1}</span>
                  <div className="flex-1 space-y-1">
                    <FormattedText text={mem.content} className="text-xs text-slate-800 leading-relaxed font-sans" />
                    {mem.relevanceScore !== undefined && (
                      <span className="inline-block text-[10px] text-slate-500 font-mono">
                        Relevance: {Number(mem.relevanceScore).toFixed(3)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: SECTION B & D: STRATEGY & WHY */}
            <div className="lg:col-span-6 space-y-6">
              {/* SECTION B: RECOMMENDED STRATEGY */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    B. Recommended Strategy
                  </h2>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Content Angle & Style
                  </span>
                  <div className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <FormattedText text={result.strategy} className="text-xs font-medium text-slate-800" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Recommended Hook
                  </span>
                  <div className="text-xs font-sans text-blue-950 bg-blue-50/80 p-3 rounded-lg border border-blue-200">
                    <FormattedText text={result.hook} className="text-xs font-medium text-blue-950" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Recommended Structure
                  </span>
                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans leading-relaxed">
                    <FormattedText text={result.structure} className="text-xs text-slate-700 font-sans" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-rose-600 block mb-1">
                    Things to Avoid (Based on Past Flops)
                  </span>
                  <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-lg border border-rose-200">
                    <FormattedText text={result.thingsToAvoid} className="text-xs text-rose-800 font-sans" />
                  </div>
                </div>
              </div>

              {/* SECTION D: WHY THIS STRATEGY? */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    D. Why This Strategy? (Memory Reasoning)
                  </h2>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed bg-blue-50/40 p-3.5 rounded-lg border border-blue-100">
                  <FormattedText text={result.whyThisStrategy} className="text-xs text-slate-700 leading-relaxed font-sans" />
                </div>
              </div>
            </div>

            {/* Right: SECTION C: GENERATED LINKEDIN POST */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-blue-600" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      C. Generated LinkedIn Post
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
                        <span>Copy Post Text</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans min-h-[380px]">
                  <FormattedText 
                    text={result.generatedPost} 
                    className="text-xs text-slate-800 leading-relaxed font-sans" 
                  />
                </div>

                {/* Next Step in the Cognitive Loop: Feed Back Performance */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={handleLogPerformance}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>Log Live Performance for this Post</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-1.5 font-mono">
                    Next step in loop: Live Metrics → Reflection → Hindsight RETAIN
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
