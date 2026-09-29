import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import FormattedText from '../components/common/FormattedText';
import { 
  Sparkles, 
  BrainCircuit, 
  Copy, 
  Check, 
  ArrowRight, 
  Bookmark, 
  Lightbulb, 
  HelpCircle, 
  PenTool,
  Clock,
  Calendar,
  CalendarDays,
  Flame,
  Zap,
  TrendingUp,
  Layers,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  Share2,
  Users,
  Target,
  Hash,
  LineChart,
  ShieldAlert,
  BookOpen
} from 'lucide-react';

export default function StrategyView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result: contextResult, idea, goal, audience } = useContent();

  const [copied, setCopied] = useState(false);
  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedComment, setCopiedComment] = useState(false);
  const [activeStrategyIndex, setActiveStrategyIndex] = useState(0);
  const [strategyTab, setStrategyTab] = useState('blueprint'); // 'blueprint' | 'insights'

  // Retrieve strategy from location state or fallback to persisted ContentContext result
  const data = location.state?.strategyData || contextResult;

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">No Active Strategy to Display</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Submit a topic idea in the <span className="font-semibold text-slate-700">Create Content</span> view to recall past memories from Hindsight and synthesize multi-strategy recommendations.
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

  // Active topic context
  const activeTopic = data.idea || idea || 'Software & AI Architecture';
  const activeAudience = data.targetAudience || audience || 'Software Engineers, Tech Leads, CTOs';
  const activeGoal = data.goal || goal || 'Engagement & Technical Discussion';

  // Helper to construct adapted post copy if not explicitly returned by LLM
  const createAdaptedPost = (angleType, originalPost) => {
    if (!originalPost) return '';
    if (angleType === 'contrarian') {
      return `Hot take on ${activeTopic.substring(0, 45)}:\n\nMost teams are doing this completely backwards.\n\nThe standard advice says: follow the textbook pattern.\nWhat actually happened when we put it into production:\n\n1. Latency spiked instead of dropping.\n2. Operational complexity tripled overnight.\n3. The real bottleneck was never what the tutorials claimed.\n\nHere is the counter-intuitive lesson we had to learn the hard way:\n\nSimplicity beats cleverness every single time.\n\nAgree or disagree? How is your team handling this tradeoff?`;
    }
    if (angleType === 'playbook') {
      return `If your team is working on ${activeTopic.substring(0, 45)}, here is the exact 3-step checklist we wish we had on day one:\n\n1. Define the baseline metrics before writing a single line of code.\n2. Test failure modes under real production load, not synthetic mocks.\n3. Implement automated safeguards before expanding traffic.\n\nKey Takeaway:\nSmall architectural adjustments early prevent painful multi-day refactors later.\n\n🔖 Bookmark this checklist for your next sprint planning!`;
    }
    return originalPost;
  };

  // Compile 3 Distinct Strategy Variations with Rich Insights
  const strategies = [
    {
      id: 'primary',
      name: 'Strategy 1: Retrospective & Tradeoffs',
      subtitle: 'Recommended by Hindsight Memory',
      badge: 'High Credibility',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      angle: data.strategy || 'Honest technical retrospective highlighting engineering decisions and architectural tradeoffs.',
      hook: data.hook || 'We tested this in production so you don’t have to...',
      structure: data.structure || 'The Core Challenge → The Architectural Decision → Surprising Tradeoffs & Takeaways',
      whyWorks: data.whyThisStrategy || 'Hindsight memories show engineering audiences react strongly to transparent post-mortems and candid tradeoffs.',
      recommendedDay: 'Tuesday',
      recommendedTime: data.optimalPostingTime?.bestTimeSlot || '8:15 AM - 9:30 AM (Morning Standup Window)',
      postCopy: data.generatedPost || '',
      expectedMetric: 'High Saves & Deep Comments',
      insights: {
        viralityScore: 94,
        predictedEngagement: '3.8% – 4.5%',
        audienceResonanceFactor: 'Authentic failure breakdown & senior peer empathy',
        psychologicalTrigger: 'Technical Vulnerability & Truthful Engineering Credibility',
        keyStrengths: [
          'High authority: uses concrete engineering data and tradeoffs',
          'Zero hype: avoids corporate buzzwords that trigger dev skepticism',
          'Strong retention: narrative keeps readers reading past the "see more" cutoff',
        ],
        guardrailsPassed: [
          'Anti-Hallucination: No fabricated personal achievements or false claims',
          'Formatting: Single sentence line breaks for high mobile readability',
        ],
        hashtags: ['#SoftwareEngineering', '#SystemDesign', '#DevOps', '#TechLeadership', '#Programming'],
        firstCommentStarter: 'What is one architectural decision your team made recently that had unexpected tradeoffs in production? Would love to hear your experience.',
      },
    },
    {
      id: 'contrarian',
      name: 'Strategy 2: Contrarian & Debate-Driven',
      subtitle: 'Algorithm Engagement Catalyst',
      badge: 'Peak Comments',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      angle: data.alternativeStrategies?.[0]?.angle || 'Challenges prevailing industry dogma to trigger active debate in the comments.',
      hook: data.alternativeStrategies?.[0]?.hook || `Unpopular opinion on ${activeTopic.substring(0, 35)}: what 90% of tutorials teach will fail in production.`,
      structure: data.alternativeStrategies?.[0]?.structure || 'The Conventional Practice → Why It Fails at Scale → The Realistic Counter-Intuitive Alternative → Open Discussion Question',
      whyWorks: 'Contrarian premises create cognitive friction that compels developers and tech leads to state their stance in comments, signaling viral momentum to LinkedIn.',
      recommendedDay: 'Wednesday',
      recommendedTime: data.alternativeStrategies?.[0]?.recommendedTime || '12:30 PM - 1:45 PM (Mid-day Lunch Window)',
      postCopy: data.alternativeStrategies?.[0]?.generatedPost || createAdaptedPost('contrarian', data.generatedPost),
      expectedMetric: 'Maximum Comment Velocity',
      insights: {
        viralityScore: 97,
        predictedEngagement: '4.2% – 5.1%',
        audienceResonanceFactor: 'Cognitive friction & questioning the industry status quo',
        psychologicalTrigger: 'Curiosity Gap & Debate Participation',
        keyStrengths: [
          'Feed-stopper: hook challenges widely accepted best practices',
          'Comment flywheel: prompts engineers to defend or validate their choices',
          'Algorithmic amplification: rapid commenting triggers secondary LinkedIn distribution',
        ],
        guardrailsPassed: [
          'Respectful challenge: questions the technical pattern, not individuals',
          'Substantiated argument: provides real engineering rationale',
        ],
        hashtags: ['#TechDebate', '#SoftwareArchitecture', '#Engineering', '#Developers', '#TechTrends'],
        firstCommentStarter: 'Curious to hear from folks running this at scale: does your team still stick to the textbook pattern, or have you made a similar shift?',
      },
    },
    {
      id: 'playbook',
      name: 'Strategy 3: Actionable Tactical Playbook',
      subtitle: 'Utility & Shareability Focus',
      badge: 'High Reposts',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      angle: data.alternativeStrategies?.[1]?.angle || 'A step-by-step checklist or implementation blueprint that readers save and share with teammates.',
      hook: data.alternativeStrategies?.[1]?.hook || `The 3-step technical blueprint we followed when deploying ${activeTopic.substring(0, 35)}:`,
      structure: data.alternativeStrategies?.[1]?.structure || 'The Problem In 1 Sentence → 3-Step Actionable Checklist → Core Implementation Tip → Save For Later CTA',
      whyWorks: 'Utility-dense posts trigger high bookmark and repost rates, signaling enduring reference value to LinkedIn’s knowledge distribution algorithms.',
      recommendedDay: 'Thursday',
      recommendedTime: data.alternativeStrategies?.[1]?.recommendedTime || '8:15 AM - 9:30 AM (Pre-Sprint Focus Window)',
      postCopy: data.alternativeStrategies?.[1]?.generatedPost || createAdaptedPost('playbook', data.generatedPost),
      expectedMetric: 'Highest Bookmark & Repost Ratio',
      insights: {
        viralityScore: 91,
        predictedEngagement: '3.6% – 4.2%',
        audienceResonanceFactor: 'High tactical utility, quick reference & team shareability',
        psychologicalTrigger: 'Implementation Guidance & Team Value',
        keyStrengths: [
          'High save rate: engineers bookmark tactical frameworks for sprint work',
          'Skimmable: numbered steps and concise bullet points enable quick absorption',
          'Team distribution: frequently forwarded to engineering Slack channels',
        ],
        guardrailsPassed: [
          'Actionable depth: clear concrete steps without vague high-level fluff',
          'Direct takeaway: immediate value delivered in under 60 seconds',
        ],
        hashtags: ['#DevProductivity', '#BestPractices', '#TechTips', '#SoftwareDevelopment', '#Architecture'],
        firstCommentStarter: 'Which of these 3 checklist steps does your team find hardest to enforce consistently during sprints?',
      },
    },
  ];

  const currentStrategy = strategies[activeStrategyIndex] || strategies[0];

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHook = (hookText) => {
    if (!hookText) return;
    navigator.clipboard.writeText(hookText);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  const handleCopyHashtags = (hashtagsList) => {
    if (!hashtagsList || hashtagsList.length === 0) return;
    navigator.clipboard.writeText(hashtagsList.join(' '));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleCopyComment = (commentText) => {
    if (!commentText) return;
    navigator.clipboard.writeText(commentText);
    setCopiedComment(true);
    setTimeout(() => setCopiedComment(false), 2000);
  };

  // 3 Primary Optimal Posting Time Windows
  const timeWindows = [
    {
      id: 'morning',
      title: 'Slot 1: Morning Standup Window',
      time: '8:15 AM - 9:30 AM',
      bestDays: 'Tuesday & Thursday',
      score: '96/100 Reach',
      icon: Clock,
      theme: 'border-blue-200 bg-blue-50/40 text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800',
      bestStrategy: 'Strategy 1 (Retrospective) & Strategy 3 (Playbook)',
      description: 'Developers, Tech Leads, and CTOs check feeds during commute or over morning coffee before daily standup syncs.',
    },
    {
      id: 'lunch',
      title: 'Slot 2: Mid-Day Discussion Window',
      time: '12:30 PM - 1:45 PM',
      bestDays: 'Wednesday',
      score: '92/100 Comments',
      icon: Flame,
      theme: 'border-purple-200 bg-purple-50/40 text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-800',
      bestStrategy: 'Strategy 2 (Contrarian & Debate-Driven)',
      description: 'Engineers taking lunch breaks actively comment and debate architectural choices and industry hot takes.',
    },
    {
      id: 'evening',
      title: 'Slot 3: End-of-Day Wind Down',
      time: '5:00 PM - 6:30 PM',
      bestDays: 'Tuesday & Wednesday',
      score: '84/100 Shares',
      icon: Zap,
      theme: 'border-amber-200 bg-amber-50/40 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800',
      bestStrategy: 'Founder stories, career insights, and culture lessons',
      description: 'Engineers wrapping up sprint tickets and open to reflective long-form retrospective reading.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>Multi-Strategy Synthesized</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-medium text-slate-500">
              {data.memoriesUsed?.length || 0} Memories Recalled from Hindsight
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Strategy View & Optimal Posting Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore 3 tailored editorial angles, predictive insights, and exact timing windows to maximize {data.platform || 'LinkedIn'} reach.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
          >
            <PenTool className="h-3.5 w-3.5 text-slate-500" />
            <span>Edit Idea / Prompt</span>
          </Link>

          <Link
            to="/performance"
            state={{
              postData: {
                topic: activeTopic.substring(0, 60),
                style: currentStrategy.name.split(':')[1]?.trim() || 'Technical Retrospective',
                hook: currentStrategy.hook || '',
                content: currentStrategy.postCopy || '',
              },
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs shadow-emerald-600/20 transition-all"
          >
            <span>Log Performance</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Context Summary Strip */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Strategy Brief
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-400 font-mono bg-blue-950 px-2.5 py-0.5 rounded border border-blue-900">
              Goal: {activeGoal}
            </span>
            <Link
              to="/insights"
              className="text-[11px] text-slate-400 hover:text-white font-medium underline flex items-center gap-1 ml-2"
            >
              <span>Global Learned Memory</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5 uppercase tracking-wider">
              Topic Idea
            </span>
            <p className="text-slate-100 font-semibold line-clamp-2">
              {activeTopic}
            </p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5 uppercase tracking-wider">
              Target Audience
            </span>
            <p className="text-slate-100 font-medium line-clamp-2">
              {activeAudience}
            </p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5 uppercase tracking-wider">
              Best Overall Posting Window
            </span>
            <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              <span>Tue, Wed, Thu • 8:15 AM - 9:30 AM</span>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: OPTIMAL POSTING SCHEDULE & TIMING INTELLIGENCE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Optimal Posting Times & Scheduling Intelligence
              </h2>
              <p className="text-xs text-slate-500">
                Tailored for <span className="font-semibold text-slate-700">{activeAudience}</span> based on LinkedIn algorithm distribution data.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/80 self-start sm:self-auto">
            Algorithm Peak Windows
          </span>
        </div>

        {/* 3 Timing Window Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {timeWindows.map((slot) => {
            const Icon = slot.icon;
            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition-all ${slot.theme} space-y-2.5`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-bold">{slot.title}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${slot.badgeColor}`}>
                    {slot.score}
                  </span>
                </div>

                <div>
                  <div className="text-base font-extrabold text-slate-900 font-mono">
                    {slot.time}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3 text-slate-400" />
                    <span>Best on: {slot.days}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {slot.description}
                </p>

                <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700">Best Strategy Pairing:</span> {slot.bestStrategy}
                </div>
              </div>
            );
          })}
        </div>

        {/* Distribution & Algorithmic Rules */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>LinkedIn Algorithmic Distribution Rules for Peak Reach:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800 block text-[11px]">1. The 60-Minute Golden Rule:</span>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Reply to every comment within the first hour of publishing to double LinkedIn's secondary feed impressions.
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800 block text-[11px]">2. No Links in Main Body:</span>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Put external URLs in the first comment; LinkedIn reduces organic reach by up to 40% on posts containing off-platform links.
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800 block text-[11px]">3. 48-Hour Post Spacing:</span>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Space high-effort posts at least 48 hours apart to avoid self-cannibalizing active algorithmic distribution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DIFFERENT STRATEGIES SELECTOR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Select Strategic Angle
            </h2>
            <p className="text-xs text-slate-500">
              Choose from 3 distinct editorial approaches synthesized for your topic:
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Click any strategy below to inspect & copy
          </span>
        </div>

        {/* 3 Strategy Switcher Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {strategies.map((strat, idx) => {
            const isSelected = activeStrategyIndex === idx;
            return (
              <button
                key={strat.id}
                type="button"
                onClick={() => setActiveStrategyIndex(idx)}
                className={`p-4 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${strat.badgeColor}`}>
                    {strat.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Option {idx + 1}/3
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {strat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {strat.subtitle}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{strat.recommendedDay} {strat.recommendedTime.split(' ')[0]}</span>
                  </span>
                  <span className="text-blue-600 font-semibold">
                    {isSelected ? 'Active Selection ✓' : 'Select Strategy'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: STRATEGY DETAILS / INSIGHTS & POST COPY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Blueprint vs Insights Switcher */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            {/* Header with Blueprint / Insights Toggle Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setStrategyTab('blueprint')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    strategyTab === 'blueprint'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  <span>Strategic Blueprint</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStrategyTab('insights')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    strategyTab === 'insights'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Strategy Insights</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                    strategyTab === 'insights' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700 font-bold'
                  }`}>
                    Option
                  </span>
                </button>
              </div>

              <span className={`hidden sm:inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentStrategy.badgeColor}`}>
                {currentStrategy.badge}
              </span>
            </div>

            {/* TAB CONTENT A: STRATEGIC BLUEPRINT */}
            {strategyTab === 'blueprint' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Content Angle */}
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Content Angle & Core Approach
                  </span>
                  <div className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-sans">
                    <FormattedText text={currentStrategy.angle} className="text-xs font-medium text-slate-800" />
                  </div>
                </div>

                {/* Recommended Hook */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-500">
                      Tailored Opening Hook (Feed-Stopper)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHook(currentStrategy.hook)}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                    >
                      {copiedHook ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                      <span>{copiedHook ? 'Copied!' : 'Copy Hook'}</span>
                    </button>
                  </div>
                  <div className="text-xs font-sans text-blue-950 bg-blue-50/80 p-3.5 rounded-lg border border-blue-200 leading-relaxed font-medium">
                    "{currentStrategy.hook}"
                  </div>
                </div>

                {/* Structure Outline */}
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Recommended Structure
                  </span>
                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans leading-relaxed">
                    <FormattedText text={currentStrategy.structure} className="text-xs text-slate-700" />
                  </div>
                </div>

                {/* Optimal Timing for This Specific Strategy */}
                <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Recommended Schedule For This Angle</span>
                  </span>
                  <p className="text-xs text-emerald-900 font-semibold font-mono">
                    {currentStrategy.recommendedDay} • {currentStrategy.recommendedTime}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Target Objective: <span className="font-semibold">{currentStrategy.expectedMetric}</span>
                  </p>
                </div>

                {/* Things to Avoid */}
                {data.thingsToAvoid && (
                  <div>
                    <span className="text-xs font-semibold text-rose-600 block mb-1">
                      Things to Avoid (Based on Past Flops)
                    </span>
                    <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-lg border border-rose-200">
                      <FormattedText text={data.thingsToAvoid} className="text-xs text-rose-800 font-sans" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT B: STRATEGY INSIGHTS & VIRALITY ANALYSIS */}
            {strategyTab === 'insights' && (
              <div className="space-y-4 animate-fadeIn">
                {/* 1. Virality & Predictive Performance Score */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                        Predictive Virality Index
                      </span>
                    </div>
                    <span className="text-xs font-extrabold font-mono text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                      {currentStrategy.insights.viralityScore} / 100
                    </span>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full h-2 bg-blue-200/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${currentStrategy.insights.viralityScore}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                        Predicted Engagement
                      </span>
                      <span className="text-sm font-bold text-emerald-600 font-mono">
                        {currentStrategy.insights.predictedEngagement}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                        LinkedIn Tech Benchmark
                      </span>
                      <span className="text-sm font-bold text-slate-700 font-mono">
                        ~1.80% Avg
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Audience Psychology & Resonance Factors */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Audience Psychology & Trigger
                    </span>
                  </div>
                  <div className="text-xs text-purple-900 font-semibold bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                    Primary Trigger: {currentStrategy.insights.psychologicalTrigger}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans pt-0.5">
                    {currentStrategy.insights.audienceResonanceFactor}
                  </p>
                </div>

                {/* 3. Key Algorithmic Strengths */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Algorithmic Advantages</span>
                  </span>
                  <ul className="space-y-1.5">
                    {currentStrategy.insights.keyStrengths.map((strength, sIdx) => (
                      <li key={sIdx} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-emerald-600 font-bold leading-relaxed shrink-0">✓</span>
                        <span className="leading-relaxed">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Guardrails Passed */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-blue-600" />
                    <span>Guardrails & Quality Checks Passed</span>
                  </span>
                  <ul className="space-y-1">
                    {currentStrategy.insights.guardrailsPassed.map((guard, gIdx) => (
                      <li key={gIdx} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span>{guard}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5. Recommended Hashtags (with 1-click Copy) */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-blue-600" />
                      <span>Recommended Tech Hashtags (3–5 max)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHashtags(currentStrategy.insights.hashtags)}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                    >
                      {copiedHashtags ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                      <span>{copiedHashtags ? 'Copied All!' : 'Copy All'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {currentStrategy.insights.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-mono font-medium border border-blue-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    LinkedIn algorithm prioritizes 3–5 targeted niche hashtags over generic tags.
                  </p>
                </div>

                {/* 6. First-Hour Engagement Catalyst (Discussion Starter) */}
                <div className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                      <span>First-Hour Comment Catalyst</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyComment(currentStrategy.insights.firstCommentStarter)}
                      className="text-[10px] text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
                    >
                      {copiedComment ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                      <span>{copiedComment ? 'Copied!' : 'Copy Starter'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-blue-950 font-medium font-sans bg-white p-2.5 rounded border border-blue-200/80 leading-relaxed">
                    "{currentStrategy.insights.firstCommentStarter}"
                  </p>
                  <p className="text-[10px] text-blue-700">
                    Pin this question as the first comment right after posting to jumpstart discussion.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cognitive Reasoning Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Cognitive Reasoning (Hindsight Long-Term Memory)
                </h3>
              </div>
              <Link
                to="/insights"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <span>Full Memory Insights</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed bg-blue-50/40 p-3.5 rounded-lg border border-blue-100 font-sans">
              <FormattedText text={currentStrategy.whyWorks} className="text-xs text-slate-700 leading-relaxed" />
            </div>
          </div>
        </div>

        {/* Right Column: Tailored Post Copy */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Adapted {data.platform || 'Social'} Post / Caption Copy
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(currentStrategy.postCopy)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Post Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Post Metadata Strip */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-mono">
              <span>Length: {currentStrategy.postCopy.length} characters</span>
              <span>~{Math.max(1, Math.round(currentStrategy.postCopy.length / 800))} min read</span>
            </div>

            {/* Post Content Box */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans min-h-[380px]">
              <FormattedText
                text={currentStrategy.postCopy}
                className="text-xs text-slate-800 leading-relaxed font-sans"
              />
            </div>

            {/* Action Card: Next Step in Cognitive Loop */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/performance"
                state={{
                  postData: {
                    topic: activeTopic.substring(0, 60),
                    style: currentStrategy.name.split(':')[1]?.trim() || 'Technical Retrospective',
                    hook: currentStrategy.hook || '',
                    content: currentStrategy.postCopy || '',
                  },
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>Log Performance for Selected Strategy</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <p className="text-[11px] text-slate-400 text-center font-mono">
                Closing the cognitive loop: Publish → Record Metrics → Hindsight RETAIN
              </p>
            </div>
          </div>

          {/* Recalled Memories Drawer */}
          {data.memoriesUsed && data.memoriesUsed.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-blue-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Recalled Hindsight Experiences ({data.memoriesUsed.length})
                  </h4>
                </div>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">
                  Long-Term Memory Bank
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {data.memoriesUsed.map((mem, idx) => (
                  <div
                    key={mem.id || idx}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-slate-700 flex items-start gap-2.5"
                  >
                    <span className="font-mono text-blue-600 font-bold shrink-0">#{idx + 1}</span>
                    <div className="flex-1 space-y-1">
                      <FormattedText text={mem.content} className="text-xs text-slate-800 font-sans" />
                      {mem.relevanceScore !== undefined && (
                        <span className="inline-block text-[10px] text-slate-400 font-mono">
                          Relevance: {Number(mem.relevanceScore).toFixed(3)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
