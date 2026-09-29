import React, { useState } from 'react';
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
  User, 
  MessageSquare,
  Bot
} from 'lucide-react';
import { SoundwaveIcon } from '../common/BrandLogo';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
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
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 shadow-sm">
        <div className="overflow-y-auto">
          {/* Logo & Platform Info */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <SoundwaveIcon />
              <div>
                <h1 className="font-bold text-base tracking-tight text-slate-900 leading-none">
                  Social<span className="text-indigo-600">Pulse</span>
                </h1>
                <p className="text-[11px] text-indigo-600 font-medium mt-1">
                  Powered by Hindsight
                </p>
              </div>
            </div>

            {/* Quick Platform Switcher in Sidebar */}
            <div className="mt-4 p-1 bg-slate-100 rounded-lg flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setPlatform('LinkedIn')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  platform === 'LinkedIn'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                <span>LinkedIn</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform('Instagram')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  platform === 'Instagram'
                    ? 'bg-white text-pink-700 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Instagram className="h-3.5 w-3.5 text-pink-600" />
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
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Account & Cognitive Loop */}
        <div className="border-t border-slate-100 bg-slate-50/70 p-3 space-y-2.5">
          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {user?.name || 'Creator'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'Logged In'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Cognitive Loop Info */}
          <div className="text-[10px] font-mono text-slate-500 bg-slate-100/80 p-2 rounded-lg border border-slate-200/60 flex items-center justify-between">
            <span>Loop:</span>
            <span className="font-semibold text-indigo-700 truncate max-w-[130px]">{getActiveStage()}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-bold text-slate-800">SocialPulse</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 hidden sm:inline">Understand your audience. Learn from your content.</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Header Platform Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setPlatform('LinkedIn')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  platform === 'LinkedIn'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                <span>LinkedIn</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform('Instagram')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  platform === 'Instagram'
                    ? 'bg-white text-pink-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Instagram className="h-3.5 w-3.5 text-pink-600" />
                <span>Instagram</span>
              </button>
            </div>

            <span className="hidden md:flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Hindsight Bank: Social-Media-Agent
            </span>

            {/* User Profile Pill in Header */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition flex items-center gap-1"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Floating AI Agent Quick Launcher (if not already on /agent) */}
        {location.pathname !== '/agent' && (
          <button
            onClick={() => navigate('/agent')}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 animate-spin text-white" style={{ animationDuration: '4s' }} />
            <span>Ask AI Agent</span>
          </button>
        )}
      </div>
    </div>
  );
}
