import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/api';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Eye, 
  RefreshCw, 
  TrendingUp, 
  X,
  FileText
} from 'lucide-react';
import FormattedText from '../components/common/FormattedText';

export default function ContentHistory() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Content Experience History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Historical LinkedIn posts tracked in MongoDB and reflected into Hindsight memory.
          </p>
        </div>

        <button
          onClick={fetchPosts}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Posts</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Topic & Hook</th>
                <th className="px-5 py-3.5">Content Style</th>
                <th className="px-5 py-3.5 text-center">Interactions</th>
                <th className="px-5 py-3.5 text-right">Engagement</th>
                <th className="px-5 py-3.5 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    Loading posts from MongoDB...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No posts found in database. Run database seed to populate.
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const rate = Number(post.metrics?.engagementRate || 0);
                  const isHigh = rate >= 3.0;
                  const isLow = rate < 1.8;
                  
                  return (
                    <tr
                      key={post._id}
                      onClick={() => setSelectedPost(post)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5 max-w-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 truncate">
                            {post.topic}
                          </span>
                          <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                            post.isSeed 
                              ? 'bg-slate-100 text-slate-500 border border-slate-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {post.isSeed ? 'Historical Seed' : 'Live Experience'}
                          </span>
                        </div>
                        <span className="text-slate-500 line-clamp-1 mt-0.5 text-[11px]">
                          {post.hook || post.content}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {post.style}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 text-blue-500" />
                            {post.metrics?.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 text-emerald-500" />
                            {post.metrics?.comments || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="h-3 w-3 text-indigo-500" />
                            {post.metrics?.shares || 0}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono font-semibold text-slate-900">
                        {rate.toFixed(2)}%
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {isHigh ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            High Performer
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            Underperformed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Average
                          </span>
                        )}
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    {selectedPost.style}
                  </span>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    selectedPost.isSeed 
                      ? 'bg-slate-100 text-slate-500 border border-slate-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {selectedPost.isSeed ? 'Historical Seed' : 'Live Experience'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedPost.topic}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Impressions</span>
                <span className="text-sm font-bold text-slate-800">
                  {selectedPost.metrics?.impressions?.toLocaleString() || 0}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Likes</span>
                <span className="text-sm font-bold text-slate-800">
                  {selectedPost.metrics?.likes || 0}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Comments</span>
                <span className="text-sm font-bold text-slate-800">
                  {selectedPost.metrics?.comments || 0}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Rate</span>
                <span className="text-sm font-bold text-emerald-600">
                  {selectedPost.metrics?.engagementRate || 0}%
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 block">Post Body:</span>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                <FormattedText text={selectedPost.content} className="text-xs text-slate-800 font-sans" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
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
