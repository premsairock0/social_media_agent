import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  RefreshCw, 
  TrendingUp, 
  X,
  FileText,
  Search,
  Award,
  Layers,
  Check,
  Copy,
  Linkedin,
  Instagram,
  BrainCircuit,
  ExternalLink,
  Plus
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

  // Filtered posts
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

    if (platformFilter !== 'ALL' && (post.platform || 'LinkedIn') !== platformFilter) return false;

    return true;
  });

  const handleCopyPost = (content) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Content Experience History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Synced from: MongoDB Memory Store • Hindsight Cloud
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all shadow-xs disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Posts</span>
          </button>
          
          <Link
            to="/create"
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Content</span>
          </Link>
        </div>
      </div>

      {/* Full-width Search Bar */}
      <div className="relative w-full">
        <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts by topic, hook, style, copy, or outcome..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Analytics KPI Metric Cards (4 in a row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Experience Bank */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Experience Bank</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : totalPosts}
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live: {liveCount}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Seeds: {seedCount}
            </span>
          </div>
        </div>

        {/* Card 2: Avg. Engagement Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Avg. Engagement Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : `${avgEngagement}%`}
          </div>
          <div className="mt-2 text-xs text-slate-500 leading-tight">
            <p>Across posts.</p>
            <p className="mt-0.5">Benchmark &gt; 3.0% (High Resonance)</p>
          </div>
        </div>

        {/* Card 3: Total Interactions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Total Interactions</span>
            <div className="w-10 h-10 flex items-center justify-center">
              <svg className="w-9 h-9" viewBox="0 0 36 36">
                {/* Outer ring - Blue */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="70 30" strokeDashoffset="25" strokeLinecap="round" />
                {/* Middle ring - Red/Coral */}
                <circle cx="18" cy="18" r="10" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="50 50" strokeDashoffset="10" strokeLinecap="round" />
                {/* Inner ring - Light Blue */}
                <circle cx="18" cy="18" r="6" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="35 65" strokeDashoffset="0" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : totalInteractions.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
            <span>Likes: {totalLikes.toLocaleString()}</span>
            <span>Comments: {totalComments.toLocaleString()}</span>
            <span>Shares: {totalShares.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 4: High Performers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">High Performers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
            {loading ? '...' : highCount}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Exemplars actively recalled by Hindsight
          </div>
        </div>
      </div>

      {/* Main Content Box: Filters & Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          {/* Platform Filters */}
          <span className="font-semibold text-slate-700 mr-1">Platform:</span>
          <button
            type="button"
            onClick={() => setPlatformFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              platformFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setPlatformFilter('LinkedIn')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              platformFilter === 'LinkedIn'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100'
            }`}
          >
            <Linkedin className="h-3 w-3" />
            <span>Linkedin</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatformFilter('Instagram')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              platformFilter === 'Instagram'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-100'
            }`}
          >
            <Instagram className="h-3 w-3" />
            <span>Instagram</span>
          </button>

          <span className="text-slate-300 mx-1 hidden sm:inline">|</span>

          {/* Outcome Filters */}
          <span className="font-semibold text-slate-700 mr-1">Outcome:</span>
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('HIGH')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'HIGH'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>High Performer ({highCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LIVE')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'LIVE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100'
            }`}
          >
            <span>Live ({liveCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SEED')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'SEED'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'
            }`}
          >
            <span>Seed ({seedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LOW')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeTab === 'LOW'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Underperformed ({lowCount})</span>
          </button>

          {(searchQuery || activeTab !== 'ALL' || platformFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveTab('ALL');
                setPlatformFilter('ALL');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline ml-auto"
            >
              Reset
            </button>
          )}
        </div>

        {/* Posts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-white text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">TOPIC & HOOK</th>
                <th className="px-6 py-3.5">PLATFORM</th>
                <th className="px-6 py-3.5">CONTENT STYLE</th>
                <th className="px-6 py-3.5">INTERACTIONS</th>
                <th className="px-6 py-3.5 text-center">ENGAGEMENT RATE</th>
                <th className="px-6 py-3.5 text-right">PERFORMANCE & ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Shimmer Loading Skeletons
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-slate-100 rounded-full w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-slate-100 rounded-full w-28"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-slate-100 rounded w-28"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-4 bg-slate-200 rounded w-12 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-5 bg-slate-100 rounded-full w-24 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <div className="max-w-sm mx-auto text-center space-y-2.5">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <FileText className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        No experiences found
                      </h4>
                      <p className="text-xs text-slate-500">
                        {searchQuery || activeTab !== 'ALL' || platformFilter !== 'ALL'
                          ? 'No posts matched your current search filters.'
                          : 'No posts found in database. Seed sample data or generate your first post!'}
                      </p>
                      {(searchQuery || activeTab !== 'ALL' || platformFilter !== 'ALL') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setActiveTab('ALL');
                            setPlatformFilter('ALL');
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
                filteredPosts.map((post) => {
                  const rate = Number(post.metrics?.engagementRate || 0);
                  const isHigh = rate >= 3.0;
                  const isLow = rate < 1.8;
                  const likes = Number(post.metrics?.likes || 0);
                  const comments = Number(post.metrics?.comments || 0);
                  const shares = Number(post.metrics?.shares || 0);
                  const isInstagram = (post.platform || '').toLowerCase() === 'instagram';

                  return (
                    <tr
                      key={post._id}
                      onClick={() => setSelectedPost(post)}
                      className="group hover:bg-slate-50/70 cursor-pointer transition-colors border-b border-slate-100"
                    >
                      {/* Topic & Hook */}
                      <td className="px-6 py-4 max-w-md">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                              {post.topic}
                            </span>
                            <span
                              className={`text-[11px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 shrink-0 ${
                                post.isSeed
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  post.isSeed ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'
                                }`}
                              ></span>
                              {post.isSeed ? 'Historical Seed' : 'Live Experience'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs line-clamp-1 leading-relaxed">
                            {post.hook || post.content}
                          </p>
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isInstagram ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-100">
                            <Instagram className="h-3 w-3 text-pink-600" />
                            <span>Instagram</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            <Linkedin className="h-3 w-3 text-blue-600" />
                            <span>Linkedin</span>
                          </span>
                        )}
                      </td>

                      {/* Content Style */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50/70 text-slate-700 border border-blue-100/70">
                          {post.style || 'Technical Storytelling'}
                        </span>
                      </td>

                      {/* Interactions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
                            title={`${likes} Likes`}
                          >
                            <ThumbsUp className="h-3 w-3 text-blue-600" />
                            <span>{likes}</span>
                          </span>
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium"
                            title={`${comments} Comments`}
                          >
                            <MessageSquare className="h-3 w-3 text-emerald-600" />
                            <span>{comments}</span>
                          </span>
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium"
                            title={`${shares} Shares`}
                          >
                            <Share2 className="h-3 w-3 text-indigo-600" />
                            <span>{shares}</span>
                          </span>
                        </div>
                      </td>

                      {/* Engagement Rate */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-xs text-slate-900">
                            {rate.toFixed(2)}%
                          </span>
                          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1"></div>
                        </div>
                      </td>

                      {/* Performance & Action */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          {isHigh ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              High Performer
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Underperformed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Average
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPost(post);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="View Details"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
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

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Top Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50/70 text-slate-700 border border-blue-100/70">
                    {selectedPost.style || 'Content Style'}
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

            {/* Simulated Post Card */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
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
                  {(selectedPost.platform || '').toLowerCase() === 'instagram' ? (
                    <Instagram className="h-4 w-4 text-pink-600" />
                  ) : (
                    <Linkedin className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </div>

              {/* Post Copy */}
              <div className="p-4 text-xs text-slate-800 leading-relaxed font-sans bg-slate-50/30">
                <FormattedText
                  text={selectedPost.content}
                  className="text-xs text-slate-800 leading-relaxed"
                />
              </div>

              {/* Post Footer Actions */}
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
