import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenTool, 
  Sparkles, 
  History, 
  TrendingUp, 
  BrainCircuit, 
  Linkedin,
  ArrowRight,
  Database
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Create Content', path: '/create', icon: PenTool },
  { name: 'Strategy View', path: '/strategy', icon: Sparkles },
  { name: 'Content History', path: '/history', icon: History },
  { name: 'Performance Logger', path: '/performance', icon: TrendingUp },
  { name: "What I've Learned", path: '/insights', icon: BrainCircuit },
];

export default function AppLayout() {
  const location = useLocation();

  // Determine active cognitive loop stage based on current route
  const getActiveStage = () => {
    switch (location.pathname) {
      case '/create':
        return 'RECALL & REASON';
      case '/strategy':
        return 'GENERATE';
      case '/performance':
        return 'FEEDBACK & RETAIN';
      case '/insights':
        return 'REFLECT';
      case '/history':
        return 'EXPERIENCE HISTORY';
      default:
        return 'ACTIVE';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Logo & Platform Info */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight text-slate-900 leading-none">
                  SocialMind
                </h1>
                <p className="text-[11px] text-blue-600 font-medium mt-1">
                  Powered by Hindsight
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                <span className="font-medium text-[11px]">LinkedIn Agent</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
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
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Cognitive Loop Pipeline Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Cognitive Memory Loop</span>
            <span className="text-blue-600 font-mono text-[9px]">LIVE</span>
          </div>
          <div className="text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Step:</span>
              <span className="font-semibold text-blue-700">{getActiveStage()}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight pt-1 border-t border-slate-100">
              RETAIN → RECALL → REASON → FEEDBACK
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-medium text-slate-700">HackwithHyderabad 3.0</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-mono">Bank: Social-Media-Agent</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Hindsight Cloud Connected
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
