import React from 'react';
import { 
  FileText, BookOpen, Layers, HelpCircle, AlertTriangle, 
  CheckCircle2, ArrowRight, RefreshCw, Trophy, Zap, Sparkles 
} from 'lucide-react';

export default function Dashboard({ 
  document, 
  topics, 
  flashcards, 
  questions, 
  progress, 
  weakTopics, 
  revisionRecs, 
  setActiveTab 
}) {
  if (!document) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">No Document Selected</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
          Please upload a study PDF or text file to automatically generate topics, flashcards, quizzes, and weak topic analysis.
        </p>
        <button
          onClick={() => setActiveTab('upload')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 cursor-pointer inline-flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Upload Study Material</span>
        </button>
      </div>
    );
  }

  const latestAttempt = progress?.latest_attempt;
  const hasAttempt = Boolean(latestAttempt);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Active Document Overview */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Study Material</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <FileText className="w-7 h-7 text-blue-500" />
              {document.original_name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {document.page_count} {document.page_count === 1 ? 'Page' : 'Pages'} Extracted • {(document.char_count / 1000).toFixed(1)}k Characters Cleaned & Chunked
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('quiz')}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Start Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Upload New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Topics Metric */}
        <div 
          onClick={() => setActiveTab('topics')}
          className="glass-card glass-card-hover rounded-xl p-5 border border-slate-800 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Extracted Topics</span>
          <div className="text-2xl font-bold text-white mt-0.5">{topics?.length || 0}</div>
          <span className="text-xs text-blue-400 font-medium mt-1 inline-block">View topic details →</span>
        </div>

        {/* Flashcards Metric */}
        <div 
          onClick={() => setActiveTab('flashcards')}
          className="glass-card glass-card-hover rounded-xl p-5 border border-slate-800 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Active Flashcards</span>
          <div className="text-2xl font-bold text-white mt-0.5">{flashcards?.length || 0}</div>
          <span className="text-xs text-indigo-400 font-medium mt-1 inline-block">Study 3D cards →</span>
        </div>

        {/* Questions Metric */}
        <div 
          onClick={() => setActiveTab('quiz')}
          className="glass-card glass-card-hover rounded-xl p-5 border border-slate-800 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Quiz Questions</span>
          <div className="text-2xl font-bold text-white mt-0.5">{questions?.length || 0}</div>
          <span className="text-xs text-emerald-400 font-medium mt-1 inline-block">Take practice quiz →</span>
        </div>

        {/* Score Metric */}
        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            {hasAttempt && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                latestAttempt.score_percentage >= 70
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {latestAttempt.score_percentage}%
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium">Latest Quiz Score</span>
          <div className="text-2xl font-bold text-white mt-0.5">
            {hasAttempt ? `${latestAttempt.correct_answers}/${latestAttempt.total_questions}` : 'Not taken'}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {hasAttempt ? `Percentage: ${latestAttempt.score_percentage}%` : 'Complete quiz to reveal score'}
          </span>
        </div>

      </div>

      {/* Main Grid: Topics Preview & Weak Topics / Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Topics Preview */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Extracted Topics ({topics?.length || 0})
            </h3>
            <button
              onClick={() => setActiveTab('topics')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {topics && topics.length > 0 ? (
              topics.slice(0, 5).map((topic, index) => (
                <div 
                  key={topic.id || index}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 text-sm">{topic.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      Topic #{index + 1}
                    </span>
                  </div>
                  {topic.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {topic.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm py-4 text-center">No topics generated yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Weak Topics & Revision Recommendations */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Weak Topics & Revision
            </h3>
            <button
              onClick={() => setActiveTab('weak-topics')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Details
            </button>
          </div>

          {!hasAttempt ? (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center py-8">
              <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">Quiz Not Attempted Yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Take the quiz to identify your weak topics (&lt; 60% accuracy rule).</p>
              <button
                onClick={() => setActiveTab('quiz')}
                className="px-4 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Take Quiz Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : weakTopics && weakTopics.length > 0 ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <strong>Attention Required:</strong> You have {weakTopics.length} weak topic(s) with accuracy below 60%.
              </div>
              {weakTopics.map((wt, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{wt.topic_name}</span>
                    <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {wt.accuracy}% accuracy
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pt-1">
                    Re-read definitions and attempt flashcards for this topic.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center py-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-200">Great Job!</p>
              <p className="text-xs text-emerald-300/80 mt-1">
                No weak topics detected. All topics scored 60% or higher on your latest quiz attempt.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
