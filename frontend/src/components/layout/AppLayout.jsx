import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  PenTool, 
  Sparkles, 
  History, 
  TrendingUp, 
  BrainCircuit, 
  Linkedin, 
  Instagram, 
  Flame, 
  HelpCircle, 
  Users, 
  LogOut, 
  User
} from 'lucide-react';
import { SoundwaveIcon } from '../common/BrandLogo';
import ThemeToggle from '../common/ThemeToggle';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Agent Chatbot', path: '/agent', icon: Sparkles, badge: 'Agent' },
  { name: 'What Should I Post?', path: '/what-to-post', icon: HelpCircle, badge: 'Hero' },
  { name: 'Content Studio', path: '/create', icon: PenTool },
  { name: 'Strategy View', path: '/strategy', icon: Sparkles },
  { name: 'Audience Intelligence', path: '/audience', icon: Users },
  { name: 'Trend Intelligence', path: '/trends', icon: Flame },
  { name: 'Content History', path: '/history', icon: History },
  { name: 'Performance Logger', path: '/performance', icon: TrendingUp },
  { name: 'Learned Insights', path: '/insights', icon: BrainCircuit },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { platform, setPlatform } = useContent();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine active cognitive loop stage based on current route
  const getActiveStage = () => {
    switch (location.pathname) {
      case '/agent':
        return 'CONVERSATIONAL AGENT';
      case '/what-to-post':
        return 'PREDICT & PRESCRIBE';
      case '/create':
        return 'RECALL & REASON';
      case '/strategy':
        return 'GENERATE';
      case '/audience':
        return 'AUDIENCE UNDERSTANDING';
      case '/trends':
        return 'TREND INTEGRATION';
      case '/performance':
        return 'FEEDBACK & RETAIN';
      case '/insights':
        return 'COGNITIVE REFLECT';
      case '/history':
        return 'EXPERIENCE TELEMETRY';
      default:
        return 'ACTIVE INTELLIGENCE';
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#080B14] text-slate-900 dark:text-[#F5F7FF] overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 dark:border-indigo-500/20 bg-white dark:bg-[#0D1322] flex flex-col justify-between shrink-0 shadow-sm transition-colors duration-200">
        <div className="overflow-y-auto">
          {/* Logo & Platform Info */}
          <div className="p-5 border-b border-slate-200 dark:border-indigo-500/15">
            <div className="flex items-center gap-2.5">
              <SoundwaveIcon />
              <div>
                <h1 className="font-extrabold text-base tracking-wider text-slate-900 dark:text-white leading-none">
                  KAZAM
                </h1>
                <p className="text-[11px] text-blue-600 dark:text-indigo-400 font-semibold mt-1">
                  Powered by Hindsight
                </p>
              </div>
            </div>

            {/* Quick Platform Switcher in Sidebar */}
            <div className="mt-4 p-1 bg-slate-100 dark:bg-[#101625] rounded-lg flex items-center gap-1 border border-slate-200 dark:border-indigo-500/20">
              <button
                type="button"
                onClick={() => setPlatform('LinkedIn')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  platform === 'LinkedIn'
                    ? 'bg-white dark:bg-[#172033] text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                <Linkedin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>LinkedIn</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform('Instagram')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  platform === 'Instagram'
                    ? 'bg-white dark:bg-[#172033] text-pink-700 dark:text-pink-400 shadow-sm border border-slate-200 dark:border-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                <Instagram className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span>Instagram</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-[#EEF2FF] dark:bg-indigo-600/25 text-[#1D4ED8] dark:text-indigo-200 font-bold border-l-4 border-[#2563EB] dark:border-indigo-400 shadow-sm'
                        : 'text-slate-700 dark:text-[#AAB4CC] hover:text-slate-900 dark:hover:text-[#F5F7FF] hover:bg-slate-100 dark:hover:bg-[#172033] font-medium'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#2563EB] dark:text-indigo-300' : 'text-slate-500 dark:text-[#8896B3] group-hover:text-slate-800 dark:group-hover:text-white'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isActive
                            ? 'bg-blue-100 dark:bg-indigo-900/60 text-blue-800 dark:text-indigo-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Account & Cognitive Loop */}
        <div className="border-t border-slate-200 dark:border-indigo-500/15 bg-slate-50 dark:bg-[#0B1020]/90 p-3 space-y-2.5">
          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#121A2A] border border-slate-200 dark:border-indigo-500/25 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                  {user?.name || 'Creator'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || 'Logged In'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Cognitive Loop Info */}
          <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-[#101625] p-2 rounded-lg border border-slate-200 dark:border-indigo-500/20 flex items-center justify-between shadow-sm">
            <span className="text-slate-500 dark:text-slate-400">Loop:</span>
            <span className="font-bold text-blue-700 dark:text-indigo-400 truncate max-w-[130px]">{getActiveStage()}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-slate-200 dark:border-indigo-500/20 bg-white dark:bg-[#0D1322] px-4 sm:px-8 flex items-center justify-between shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-extrabold text-slate-900 dark:text-white">Kazam</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">Understand your audience. Learn from your content.</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Header Platform Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-[#101625] p-0.5 rounded-lg border border-slate-200 dark:border-indigo-500/20">
              <button
                type="button"
                onClick={() => setPlatform('LinkedIn')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  platform === 'LinkedIn'
                    ? 'bg-white dark:bg-[#172033] text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                <Linkedin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">LinkedIn</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform('Instagram')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  platform === 'Instagram'
                    ? 'bg-white dark:bg-[#172033] text-pink-700 dark:text-pink-400 shadow-sm border border-slate-200 dark:border-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                <Instagram className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="hidden sm:inline">Instagram</span>
              </button>
            </div>

            {/* Light / Dark Theme Toggle */}
            <ThemeToggle />

            {/* Hindsight Bank Indicator */}
            <span className="hidden lg:flex px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/40 text-xs font-semibold items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              Hindsight Bank: Social-Media-Agent
            </span>

            {/* User Profile Pill in Header */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-indigo-500/20">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center gap-1"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F8FAFC] dark:bg-[#080B14]">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Floating AI Agent Quick Launcher */}
        {location.pathname !== '/agent' && (
          <button
            onClick={() => navigate('/agent')}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 animate-spin text-white" style={{ animationDuration: '4s' }} />
            <span>Ask AI Agent</span>
          </button>
        )}
      </div>
    </div>
  );
}
