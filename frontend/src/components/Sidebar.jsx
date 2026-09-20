import React from 'react';
import { 
  BookOpen, LayoutDashboard, FileText, Layers, HelpCircle, 
  AlertTriangle, RefreshCw, Settings, LogOut, User, Menu, X, FilePlus, Target 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exam-mode', label: '🎯 Exam Tomorrow Mode', icon: Target },
    { id: 'upload', label: 'My Notes & Upload', icon: FilePlus },
    { id: 'topics', label: 'Important Topics', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle },
    { id: 'weak-topics', label: 'Performance & Revision', icon: AlertTriangle },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 glass-card border-r border-slate-800/90 bg-slate-950/95 flex flex-col justify-between transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Top: Logo & Nav */}
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-base text-white leading-none">Learn Notes</h1>
                <span className="text-xs text-blue-400 font-medium tracking-wide">EdTech SaaS</span>
              </div>
            </div>

            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {user && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user.name || 'Student'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email || ''}</p>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
}
