import React from 'react';
import { 
  FileText, BookOpen, Layers, HelpCircle, AlertTriangle, 
  CheckCircle2, ArrowRight, RefreshCw, Trophy, Sparkles, FilePlus, Target, Zap 
} from 'lucide-react';

export default function Dashboard({ 
  user,
  document, 
  documents,
  topics, 
  flashcards, 
  questions, 
  progress, 
  weakTopics, 
  setActiveTab,
  onSelectDocument
}) {
  const latestAttempt = progress?.latest_attempt;
  const hasAttempt = Boolean(latestAttempt);
  const userName = user?.name || 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Learning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
              Welcome back 👋, {userName}!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Continue converting your study notes and lecture PDFs into active-learning materials.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('upload')}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Upload Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Take Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Exam Tomorrow Mode Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-900 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Time-Allocated Preparation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white flex items-center gap-2">
            🎯 Exam Tomorrow?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Get a focused, time-allocated prep session (30 Min, 1 Hr, 2 Hr, 4 Hr) based on your notes, weak topics, and available study progress.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('exam-mode')}
          className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Start Exam Mode →</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Documents Stat */}
        <div 
          onClick={() => setActiveTab('upload')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-400 font-medium block">Documents</span>
          <div className="text-2xl font-extrabold text-white mt-0.5">{documents?.length || 0}</div>
        </div>

        {/* Topics Stat */}
        <div 
          onClick={() => setActiveTab('topics')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-400 font-medium block">Important Topics</span>
          <div className="text-2xl font-extrabold text-white mt-0.5">{topics?.length || 0}</div>
        </div>

        {/* Flashcards Stat */}
        <div 
          onClick={() => setActiveTab('flashcards')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-400 font-medium block">Flashcards</span>
          <div className="text-2xl font-extrabold text-white mt-0.5">{flashcards?.length || 0}</div>
        </div>

        {/* Questions Stat */}
        <div 
          onClick={() => setActiveTab('quiz')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-400 font-medium block">Quiz Questions</span>
          <div className="text-2xl font-extrabold text-white mt-0.5">{questions?.length || 0}</div>
        </div>

        {/* Quiz Score Stat */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 col-span-2 lg:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-400 font-medium block">Latest Score</span>
          <div className="text-2xl font-extrabold text-white mt-0.5">
            {hasAttempt ? `${latestAttempt.score_percentage}%` : 'N/A'}
          </div>
        </div>

      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('upload')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 text-left flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Upload Notes</h4>
            <p className="text-xs text-slate-400">PDF / TXT study files</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 text-left flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">View Topics</h4>
            <p className="text-xs text-slate-400">Simple & detailed explanations</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 text-left flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Study Flashcards</h4>
            <p className="text-xs text-slate-400">Interactive recall cards</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 text-left flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Take Quiz</h4>
            <p className="text-xs text-slate-400">Practice multiple choice</p>
          </div>
        </button>
      </div>

      {/* Main Section: Recent Documents & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Recent Uploaded Documents */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Recent Documents ({documents?.length || 0})
            </h3>
            <button
              onClick={() => setActiveTab('upload')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              + Upload New
            </button>
          </div>

          <div className="space-y-3">
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <div 
                  key={doc.id}
                  className={`p-4 rounded-xl border transition-colors flex items-center justify-between gap-4 ${
                    document?.id === doc.id
                      ? 'bg-blue-600/10 border-blue-500/40 text-white'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-sm text-white truncate">{doc.original_name}</p>
                      <p className="text-xs text-slate-400">
                        {doc.page_count} {doc.page_count === 1 ? 'Page' : 'Pages'} • Uploaded {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectDocument) onSelectDocument(doc.id);
                      setActiveTab('topics');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm py-6 text-center">No documents uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Right: Weak Topics Summary */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Weak Topics Alert
            </h3>
            <button
              onClick={() => setActiveTab('weak-topics')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              Details
            </button>
          </div>

          {!hasAttempt ? (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center py-8 space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">Take Quiz to Reveal Weak Topics</p>
              <button
                onClick={() => setActiveTab('quiz')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Take Practice Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : weakTopics && weakTopics.length > 0 ? (
            <div className="space-y-3">
              {weakTopics.slice(0, 4).map((wt, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{wt.topic_name}</span>
                  <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {wt.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center py-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-200">No Weak Topics</p>
              <p className="text-xs text-emerald-300/80 mt-1">All topics scored 60% or higher!</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
