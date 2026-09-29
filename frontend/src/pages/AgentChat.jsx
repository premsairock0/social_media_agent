import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { chatWithAgent } from '../services/api';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Linkedin, 
  Instagram, 
  BrainCircuit, 
  RotateCcw,
  Loader2,
  Lightbulb,
  Zap,
  Target
} from 'lucide-react';
import { SoundwaveIcon } from '../components/common/BrandLogo';

export default function AgentChat() {
  const { user } = useAuth();
  const { platform } = useContent();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name || 'Creator'}! I am your Kazam AI Engagement Agent. I have continuous access to your retained audience memories, engagement telemetry, and platform benchmarks for ${platform}. How can I help you grow today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatWithAgent({
        message: messageText.trim(),
        history: messages,
        platform,
      });

      const agentReply = res.data?.data?.reply || 'I analyzed your request against your past audience patterns. Let me know if you would like me to draft a full post!';
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: agentReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue reaching the memory network. Please try again.',
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared. What topic or campaign would you like to explore for ${platform}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      {/* Agent Chat Header */}
      <div className="p-4 px-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm">Kazam AI Agent</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                Active Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Personalized for {user?.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {platform === 'LinkedIn' ? (
                  <Linkedin className="w-3 h-3 text-blue-600" />
                ) : (
                  <Instagram className="w-3 h-3 text-pink-600" />
                )}
                {platform} Mode
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition text-xs flex items-center gap-1 font-medium"
            title="Clear Chat"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Suggestions:
        </span>
        <button
          onClick={() => handleQuickPrompt(`What should I post today on ${platform} to maximize engagement?`)}
          className="px-3 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-300 rounded-full shrink-0 transition text-xs font-medium"
        >
          💡 What should I post today?
        </button>
        <button
          onClick={() => handleQuickPrompt('Give me 3 high-converting hooks for a technical storytelling post.')}
          className="px-3 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-300 rounded-full shrink-0 transition text-xs font-medium"
        >
          ⚡ 3 viral hooks for my next post
        </button>
        <button
          onClick={() => handleQuickPrompt('Synthesize the key patterns from my retained audience memories.')}
          className="px-3 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-300 rounded-full shrink-0 transition text-xs font-medium"
        >
          🧠 Summarize my audience memories
        </button>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                }`}
              >
                {isUser ? (user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />) : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-tl-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
                <div className={`text-[10px] text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <SoundwaveIcon className="h-4" />
              <span className="text-xs text-slate-500 font-medium">
                Reasoning with memories & strategy...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask the Kazam Agent for ${platform} strategy, copy, or memory insights...`}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
