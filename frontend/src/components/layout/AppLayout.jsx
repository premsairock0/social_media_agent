import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { 
  LayoutDashboard, 
  PenTool, 
  Sparkles, 
  History, 
  TrendingUp, 
  BrainCircuit, 
  Linkedin,
  Instagram,
  Compass,
  Flame,
  HelpCircle,
  Users,
  Layers,
  ArrowRight
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'What Should I Post?', path: '/what-to-post', icon: HelpCircle, badge: 'Hero' },
  { name: 'Content Studio', path: '/create', icon: PenTool },
  { name: 'Strategy View', path: '/strategy', icon: Sparkles },
  { name: 'Audience Intelligence', path: '/audience', icon: Users },
  { name: 'Trend Intelligence', path: '/trends', icon: Flame },
  { name: 'Content History', path: '/history', icon: History },
  { name: 'Performance Logger', path: '/performance', icon: TrendingUp },
  { name: "Learned Insights", path: '/insights', icon: BrainCircuit },
];

export default function AppLayout() {
  const location = useLocation();
  const { platform, setPlatform } = useContent();

  // Determine active cognitive loop stage based on current route
  const getActiveStage = () => {
    switch (location.pathname) {
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
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-lg">
                SP
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight text-slate-900 leading-none">
                  SocialPulse
                </h1>
                <p className="text-[11px] text-blue-600 font-medium mt-1">
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
                        ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Cognitive Loop Pipeline Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Cognitive Memory Loop</span>
            <span className="text-emerald-600 font-mono text-[9px] font-bold">ONLINE</span>
          </div>
          <div className="text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Loop Step:</span>
              <span className="font-semibold text-blue-700">{getActiveStage()}</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-tight pt-1 border-t border-slate-100">
              RETAIN → RECALL → REASON → MEASURE
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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

            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Hindsight Bank: Social-Media-Agent
            </span>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
