import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, X, Sparkles, Compass, Send, ArrowRight, 
  BookOpen, Layers, HelpCircle, FilePlus, RefreshCw, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { TOUR_STEPS, CONTEXT_HELP, PREDEFINED_HELP, matchUserKeyword } from './assistantRules';

export default function StudentAssistantPanel({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab,
  user,
  documents,
  topics,
  flashcards,
  questions,
  progress,
  weakTopics,
  tourIndex,
  setTourIndex,
  isTourActive,
  setIsTourActive
}) {
  const [activeHelpKey, setActiveHelpKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeTab, activeHelpKey, searchResult, isTourActive, tourIndex]);

  if (!isOpen) return null;

  const currentContext = CONTEXT_HELP[activeTab] || CONTEXT_HELP.dashboard;

  const handleSelectHelp = (key) => {
    setIsTourActive(false);
    setSearchResult(null);
    if (key === 'tour') {
      setIsTourActive(true);
      setTourIndex(0);
      setActiveHelpKey(null);
    } else {
      setActiveHelpKey(key);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsTourActive(false);
    setActiveHelpKey(null);

    const match = matchUserKeyword(searchQuery);
    if (match) {
      if (match.type === 'tour') {
        setIsTourActive(true);
        setTourIndex(0);
        setSearchResult(null);
      } else {
        setSearchResult({
          matched: true,
          data: PREDEFINED_HELP[match.key] || PREDEFINED_HELP.dashboard
        });
      }
    } else {
      setSearchResult({
        matched: false,
        query: searchQuery
      });
    }
    setSearchQuery('');
  };

  const handleNavigate = (tabName) => {
    if (setActiveTab) {
      setActiveTab(tabName);
    }
  };

  const currentTourStep = TOUR_STEPS[tourIndex] || TOUR_STEPS[0];
  const activeHelpData = activeHelpKey ? PREDEFINED_HELP[activeHelpKey] : null;

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[82vh] glass-card rounded-3xl border border-slate-800 shadow-2xl flex flex-col bg-slate-950/95 text-slate-100 overflow-hidden animate-fade-in">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950/60 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base flex items-center gap-1.5">
              <span>Student Assistant</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Study Guide
              </span>
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Rules & Workflow Guide • Offline Assistant
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close Student Assistant"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Conversation Body */}
      <div ref={chatScrollRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm scrollbar-thin">
        
        {/* Real Data Awareness Badge */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center justify-between text-blue-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Active Study Context
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{user?.name || 'Student'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1 text-[11px]">
            <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Notes</span>
              <strong className="text-white text-xs">{documents?.length || 0} files</strong>
            </div>
            <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Cards</span>
              <strong className="text-indigo-400 text-xs">{flashcards?.length || 0} cards</strong>
            </div>
            <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Score</span>
              <strong className="text-emerald-400 text-xs">
                {progress?.latest_attempt ? `${progress.latest_attempt.score_percentage}%` : 'N/A'}
              </strong>
            </div>
          </div>
        </div>

        {/* TOUR MODE */}
        {isTourActive ? (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-400 animate-spin-slow" />
                {currentTourStep.title}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Step {currentTourStep.step} of {TOUR_STEPS.length}</span>
            </div>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {currentTourStep.description}
            </p>

            <button
              onClick={() => {
                handleNavigate(currentTourStep.tab);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentTourStep.buttonText}</span>
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button
                disabled={tourIndex === 0}
                onClick={() => setTourIndex(prev => Math.max(0, prev - 1))}
                className={`text-xs font-medium ${tourIndex === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white cursor-pointer'}`}
              >
                ← Previous
              </button>

              <button
                onClick={() => setIsTourActive(false)}
                className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Exit Tour
              </button>

              {tourIndex < TOUR_STEPS.length - 1 ? (
                <button
                  onClick={() => setTourIndex(prev => prev + 1)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={() => setIsTourActive(false)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  Finish Tour ✓
                </button>
              )}
            </div>
          </div>
        ) : searchResult ? (
          /* KEYWORD MATCH SEARCH RESULT */
          <div className="space-y-3">
            {searchResult.matched ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  {searchResult.data.title}
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {searchResult.data.text}
                </p>
                {searchResult.data.actionTab && (
                  <button
                    onClick={() => handleNavigate(searchResult.data.actionTab)}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    <span>{searchResult.data.actionLabel}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>No exact match for "{searchResult.query}"</span>
                </div>
                <p className="text-xs text-amber-300/90 leading-relaxed">
                  I'm here to guide you through the app. Please select one of these predefined help topics:
                </p>
              </div>
            )}

            <button
              onClick={() => setSearchResult(null)}
              className="text-xs text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              ← Back to Quick Topics
            </button>
          </div>
        ) : activeHelpData ? (
          /* PREDEFINED TOPIC DETAIL */
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                {activeHelpData.title}
              </h4>
              <button 
                onClick={() => setActiveHelpKey(null)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {activeHelpData.text}
            </p>

            {activeHelpData.actionTab && (
              <button
                onClick={() => handleNavigate(activeHelpData.actionTab)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>{activeHelpData.actionLabel}</span>
              </button>
            )}
          </div>
        ) : (
          /* DEFAULT CONTEXT GREETING & QUICK OPTIONS */
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-200 leading-relaxed">
              {currentContext.greeting}
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                What would you like help with?
              </span>

              <div className="grid grid-cols-1 gap-2">
                {currentContext.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectHelp(opt.id)}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 font-medium text-xs text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Feature Shortcut Buttons */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick App Navigation
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavigate('upload')}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <FilePlus className="w-3.5 h-3.5 text-blue-400" />
                  <span>Upload Notes</span>
                </button>

                <button
                  onClick={() => handleNavigate('topics')}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Topics</span>
                </button>

                <button
                  onClick={() => handleNavigate('flashcards')}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Flashcards</span>
                </button>

                <button
                  onClick={() => handleNavigate('quiz')}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quiz</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Keyword Input Form */}
      <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 shrink-0">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your question (e.g., upload pdf, flashcards)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={!searchQuery.trim()}
            className={`p-2 rounded-xl text-white transition-all ${
              !searchQuery.trim() 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-md shadow-blue-600/20'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
