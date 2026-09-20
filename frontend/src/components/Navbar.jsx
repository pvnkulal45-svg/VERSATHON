import React from 'react';
import { BookOpen, Upload, LayoutDashboard, Layers, HelpCircle, AlertTriangle, FileText } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, documents, activeDocId, setActiveDocId }) {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white leading-none">Learn Notes</h1>
            <span className="text-xs text-blue-400 font-medium tracking-wide">Active Learning MVP</span>
          </div>
        </div>

        {/* Document Selector Dropdown if documents exist */}
        {documents && documents.length > 0 && (
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
            <FileText className="w-4 h-4 text-blue-400" />
            <select
              value={activeDocId || ''}
              onChange={(e) => setActiveDocId(Number(e.target.value))}
              className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer pr-2"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id} className="bg-slate-900 text-slate-200">
                  {doc.original_name} ({doc.page_count} {doc.page_count === 1 ? 'page' : 'pages'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'topics'
                ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Topics</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'flashcards'
                ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'quiz'
                ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('weak-topics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'weak-topics'
                ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Revision</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
