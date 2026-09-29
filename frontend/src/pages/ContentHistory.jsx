import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Eye, 
  RefreshCw, 
  TrendingUp, 
  X,
  FileText,
  Search,
  Sparkles,
  Award,
  ArrowRight,
  Database,
  BarChart3,
  Layers,
  Check,
  Copy,
  SlidersHorizontal,
  Linkedin,
  Instagram,
  BrainCircuit,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import FormattedText from '../components/common/FormattedText';

export default function ContentHistory() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [copied, setCopied] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'HIGH' | 'LIVE' | 'SEED' | 'LOW'
  const [platformFilter, setPlatformFilter] = useState('ALL'); // 'ALL' | 'LinkedIn' | 'Instagram'
  const [selectedStyle, setSelectedStyle] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'engagement_desc' | 'likes_desc' | 'comments_desc'

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getPosts();
      setPosts(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Compute analytics from current posts
  const totalPosts = posts.length;
  const liveCount = posts.filter((p) => !p.isSeed).length;
  const seedCount = posts.filter((p) => p.isSeed).length;
  const highPerformers = posts.filter((p) => (Number(p.metrics?.engagementRate) || 0) >= 3.0);
  const highCount = highPerformers.length;
  const lowCount = posts.filter((p) => (Number(p.metrics?.engagementRate) || 0) < 1.8).length;

  const avgEngagement = totalPosts > 0
    ? (posts.reduce((acc, p) => acc + (Number(p.metrics?.engagementRate) || 0), 0) / totalPosts).toFixed(2)
    : '0.00';

  const totalLikes = posts.reduce((acc, p) => acc + (Number(p.metrics?.likes) || 0), 0);
  const totalComments = posts.reduce((acc, p) => acc + (Number(p.metrics?.comments) || 0), 0);
  const totalShares = posts.reduce((acc, p) => acc + (Number(p.metrics?.shares) || 0), 0);
  const totalInteractions = totalLikes + totalComments + totalShares;

  const highRatio = totalPosts > 0 ? Math.round((highCount / totalPosts) * 100) : 0;

  // Available unique styles
  const availableStyles = Array.from(new Set(posts.map((p) => p.style).filter(Boolean)));

  // Filtered & Sorted posts
  const filteredPosts = posts.filter((post) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = (post.topic || '').toLowerCase().includes(q);
      const matchHook = (post.hook || '').toLowerCase().includes(q);
      const matchContent = (post.content || '').toLowerCase().includes(q);
      const matchStyle = (post.style || '').toLowerCase().includes(q);
      if (!matchTopic && !matchHook && !matchContent && !matchStyle) return false;
    }

    const rate = Number(post.metrics?.engagementRate || 0);
    if (activeTab === 'HIGH' && rate < 3.0) return false;
    if (activeTab === 'LOW' && rate >= 1.8) return false;
    if (activeTab === 'LIVE' && post.isSeed) return false;
    if (activeTab === 'SEED' && !post.isSeed) return false;

    if (selectedStyle !== 'ALL' && post.style !== selectedStyle) return false;
    if (platformFilter !== 'ALL' && (post.platform || 'LinkedIn') !== platformFilter) return false;

    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'engagement_desc') {
      return (Number(b.metrics?.engagementRate) || 0) - (Number(a.metrics?.engagementRate) || 0);
    }
    if (sortBy === 'likes_desc') {
      return (Number(b.metrics?.likes) || 0) - (Number(a.metrics?.likes) || 0);
    }
    if (sortBy === 'comments_desc') {
      return (Number(b.metrics?.comments) || 0) - (Number(a.metrics?.comments) || 0);
    }
    if (sortBy === 'shares_desc') {
      return (Number(b.metrics?.shares) || 0) - (Number(a.metrics?.shares) || 0);
    }
    return 0; // Default order
  });

  const handleCopyPost = (content) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStyleBadgeClass = (style) => {
    const s = (style || '').toLowerCase();
    if (s.includes('tech') || s.includes('retrospective')) {
      return 'bg-blue-50 text-blue-700 border-blue-200/80';
    }
    if (s.includes('contrarian') || s.includes('architecture')) {
      return 'bg-purple-50 text-purple-700 border-purple-200/80';
    }
    if (s.includes('story') || s.includes('personal') || s.includes('journey')) {
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    }
    if (s.includes('partner') || s.includes('corporate') || s.includes('announcement')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
    }
    if (s.includes('benchmark') || s.includes('experiment') || s.includes('agentic')) {
      return 'bg-cyan-50 text-cyan-700 border-cyan-200/80';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-7 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
              <Database className="h-3 w-3 text-blue-600" />
              <span>MongoDB Memory Store</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-medium text-slate-500">
              Syncs with Hindsight Cloud
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Content Experience History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Historical LinkedIn posts tracked in MongoDB and reflected into Hindsight memory.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Posts</span>
          </button>
          
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs shadow-blue-500/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Create Content</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Posts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Experience Bank</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {loading ? '...' : totalPosts}
            </span>
            <span className="text-xs text-slate-500 font-medium">total posts</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {liveCount} Live
            </span>
            <span className="text-slate-300">/</span>
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              {seedCount} Seeds
            </span>
          </div>
        </div>

        {/* Average Engagement */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Engagement Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 tracking-tight">
              {loading ? '...' : `${avgEngagement}%`}
            </span>
            <span className="text-xs text-slate-500 font-medium">across posts</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Benchmark: <span className="font-semibold text-slate-700">&gt; 3.0%</span> considered high-resonance
          </p>
        </div>

        {/* Total Interactions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Interactions</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {loading ? '...' : totalInteractions.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">reactions</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span>{totalLikes.toLocaleString()} likes</span>
            <span className="text-slate-300">•</span>
            <span>{totalComments.toLocaleString()} comments</span>
          </div>
        </div>

        {/* High Performers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>High Performers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {loading ? '...' : highCount}
            </span>
            <span className="text-xs text-amber-600 font-semibold">({highRatio}% ratio)</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 truncate">
            Exemplars actively recalled by Hindsight
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Category Tabs, Style & Sort Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by topic, hook, style, or copy..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Style & Sort Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Style Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
              >
                <option value="ALL">All Content Styles</option>
                {availableStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
              >
                <option value="newest">Default Order</option>
                <option value="engagement_desc">Highest Engagement</option>
                <option value="likes_desc">Most Likes</option>
                <option value="comments_desc">Most Comments</option>
                <option value="shares_desc">Most Shares</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Platform:
          </span>
          <button
            type="button"
            onClick={() => setPlatformFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              platformFilter === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Platforms
          </button>
          <button
            type="button"
            onClick={() => setPlatformFilter('LinkedIn')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              platformFilter === 'LinkedIn'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Linkedin className="h-3 w-3" />
            <span>LinkedIn</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatformFilter('Instagram')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              platformFilter === 'Instagram'
                ? 'bg-pink-600 text-white'
                : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
            }`}
          >
            <Instagram className="h-3 w-3" />
            <span>Instagram</span>
          </button>

          <span className="text-slate-300 mx-1">|</span>

          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Outcome:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Posts ({totalPosts})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('HIGH')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'HIGH'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            High Performers ({highCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LIVE')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'LIVE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Live Experience ({liveCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SEED')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'SEED'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            Historical Seeds ({seedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LOW')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'LOW'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Underperformed ({lowCount})
          </button>

          {(searchQuery || activeTab !== 'ALL' || selectedStyle !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveTab('ALL');
                setSelectedStyle('ALL');
              }}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Posts Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-6 py-4">Topic & Hook</th>
                <th className="px-6 py-4">Content Style</th>
                <th className="px-6 py-4 text-center">Interactions</th>
                <th className="px-6 py-4 text-right">Engagement Rate</th>
                <th className="px-6 py-4 text-right">Performance & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Shimmer Loading Skeletons
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-slate-100 rounded-full w-28"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-4 bg-slate-100 rounded w-24 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-4 bg-slate-200 rounded w-12 ml-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-5 bg-slate-100 rounded-full w-20 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : sortedPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <div className="max-w-sm mx-auto text-center space-y-2.5">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <FileText className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        No experiences found
                      </h4>
                      <p className="text-xs text-slate-500">
                        {searchQuery || activeTab !== 'ALL' || selectedStyle !== 'ALL'
                          ? 'No posts matched your current search filters.'
                          : 'No posts found in database. Seed sample data or generate your first post!'}
                      </p>
                      {(searchQuery || activeTab !== 'ALL' || selectedStyle !== 'ALL') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setActiveTab('ALL');
                            setSelectedStyle('ALL');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                sortedPosts.map((post) => {
                  const rate = Number(post.metrics?.engagementRate || 0);
                  const isHigh = rate >= 3.0;
                  const isLow = rate < 1.8;
                  const rateBarWidth = Math.min(Math.round((rate / 6.0) * 100), 100);

                  return (
                    <tr
                      key={post._id}
                      onClick={() => setSelectedPost(post)}
                      className="group hover:bg-blue-50/30 cursor-pointer transition-all border-b border-slate-100"
                    >
                      {/* Topic & Hook */}
                      <td className="px-6 py-4 max-w-md">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                              {post.topic}
                            </span>
                            <span
                              className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 ${
                                post.isSeed
                                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  post.isSeed ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'
                                }`}
                              ></span>
                              {post.isSeed ? 'Historical Seed' : 'Live Experience'}
                            </span>

                            {/* Platform Badge */}
                            <span
                              className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 ${
                                post.platform === 'Instagram'
                                  ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {post.platform === 'Instagram' ? (
                                <Instagram className="h-3 w-3 text-pink-600" />
                              ) : (
                                <Linkedin className="h-3 w-3 text-blue-600" />
                              )}
                              <span>{post.platform || 'LinkedIn'}</span>
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs line-clamp-1 leading-relaxed font-sans">
                            {post.hook || post.content}
                          </p>
                        </div>
                      </td>

                      {/* Content Style Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-2xs ${getStyleBadgeClass(
                            post.style
                          )}`}
                        >
                          {post.style}
                        </span>
                      </td>

                      {/* Interactions Stat Pills */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
                            title={`${post.metrics?.likes || 0} Likes`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span>{post.metrics?.likes || 0}</span>
                          </span>
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium"
                            title={`${post.metrics?.comments || 0} Comments`}
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>{post.metrics?.comments || 0}</span>
                          </span>
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium"
                            title={`${post.metrics?.shares || 0} Shares`}
                          >
                            <Share2 className="h-3 w-3" />
                            <span>{post.metrics?.shares || 0}</span>
                          </span>
                        </div>
                      </td>

                      {/* Engagement Rate */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-block text-right">
                          <div className="font-mono font-bold text-sm text-slate-900">
                            {rate.toFixed(2)}%
                          </div>
                          {/* Mini Progress meter */}
                          <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 ml-auto overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isHigh ? 'bg-emerald-500' : isLow ? 'bg-rose-400' : 'bg-blue-500'
                              }`}
                              style={{ width: `${rateBarWidth}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Performance Status & Hover Cue */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          {isHigh ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              High Performer
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Underperformed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Average
                            </span>
                          )}

                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced LinkedIn Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Top Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyleBadgeClass(
                      selectedPost.style
                    )}`}
                  >
                    {selectedPost.style}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      selectedPost.isSeed
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {selectedPost.isSeed ? 'Historical Seed' : 'Live Experience'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                  {selectedPost.topic}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Performance KPI Cards in Modal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Impressions
                </span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  {selectedPost.metrics?.impressions?.toLocaleString() || '1,200'}
                </span>
              </div>
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200/60 text-center">
                <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider block">
                  Likes
                </span>
                <span className="text-base font-bold text-blue-800 mt-0.5 block">
                  {selectedPost.metrics?.likes || 0}
                </span>
              </div>
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60 text-center">
                <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">
                  Comments
                </span>
                <span className="text-base font-bold text-emerald-800 mt-0.5 block">
                  {selectedPost.metrics?.comments || 0}
                </span>
              </div>
              <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200/60 text-center">
                <span className="text-[10px] text-purple-600 font-semibold uppercase tracking-wider block">
                  Rate
                </span>
                <span className="text-base font-bold text-purple-800 mt-0.5 block font-mono">
                  {selectedPost.metrics?.engagementRate || 0}%
                </span>
              </div>
            </div>

            {/* Simulated LinkedIn Post Card */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              {/* LinkedIn Author Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    SM
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">
                        SocialMind AI Agent
                      </h4>
                      <span className="text-[10px] text-slate-400">• 1st</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Cognitive Agentic Strategist • Powered by Hindsight
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                  </span>
                </div>
              </div>

              {/* LinkedIn Post Copy */}
              <div className="p-4 text-xs text-slate-800 leading-relaxed font-sans bg-slate-50/30">
                <FormattedText
                  text={selectedPost.content}
                  className="text-xs text-slate-800 leading-relaxed"
                />
              </div>

              {/* LinkedIn Footer Actions */}
              <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="flex -space-x-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center">👍</span>
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[8px] flex items-center justify-center">💬</span>
                  </span>
                  <span className="ml-1 font-medium text-slate-600">
                    {Number(selectedPost.metrics?.likes || 0) + Number(selectedPost.metrics?.comments || 0)} interactions
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyPost(selectedPost.content)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-500" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Cognitive Reflection & Memory Card */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                <BrainCircuit className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Hindsight Long-Term Memory Reflection</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed font-sans">
                {Number(selectedPost.metrics?.engagementRate || 0) >= 3.0
                  ? 'High-performing experience retained in Hindsight. When drafting similar technical topics, the strategy engine recalls this post’s hook angle and structure to boost audience reach.'
                  : Number(selectedPost.metrics?.engagementRate || 0) < 1.8
                  ? 'Underperformed baseline experience. Hindsight flags this pattern as a negative guardrail, avoiding overly generic phrasing or weak hooks in future strategy cycles.'
                  : 'Moderate engagement experience. Stored in Hindsight to provide balanced audience preference context across technical topics.'}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
