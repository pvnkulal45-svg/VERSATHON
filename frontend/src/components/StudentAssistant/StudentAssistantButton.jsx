import React, { useState, useEffect } from 'react';
import { GraduationCap, Sparkles, X } from 'lucide-react';

export default function StudentAssistantButton({ isOpen, onClick, onStartTour }) {
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('assistant_popover_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowPopover(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissPopover = (e) => {
    e.stopPropagation();
    setShowPopover(false);
    localStorage.setItem('assistant_popover_dismissed', 'true');
  };

  const handleStartTourFromPopover = (e) => {
    e.stopPropagation();
    setShowPopover(false);
    localStorage.setItem('assistant_popover_dismissed', 'true');
    if (onStartTour) onStartTour();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* First-time Student Welcome Popover */}
      {showPopover && !isOpen && (
        <div className="glass-card rounded-2xl p-4 border border-blue-500/30 shadow-2xl max-w-xs animate-bounce-short bg-slate-900/95 text-slate-100 relative mb-1">
          <button 
            onClick={handleDismissPopover}
            aria-label="Close onboarding prompt"
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex items-start gap-3 pr-4">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">👋 Need help using the app?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take a quick 2-minute tour to see how to upload notes, practice flashcards, and take quizzes.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleStartTourFromPopover}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Show Me →
                </button>
                <button
                  onClick={handleDismissPopover}
                  className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Assistant Button */}
      <div className="relative group">
        
        {/* Hover Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div className="bg-slate-900 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-800 shadow-xl flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Need help? Ask your Student Assistant</span>
          </div>
        </div>

        <button
          onClick={onClick}
          aria-label={isOpen ? "Close Student Assistant" : "Open Student Assistant"}
          className={`px-4 py-3 rounded-full font-bold text-xs sm:text-sm border transition-all duration-300 flex items-center gap-2.5 shadow-2xl cursor-pointer ${
            isOpen
              ? 'bg-slate-900 text-slate-300 border-slate-700 shadow-slate-950/80 scale-95'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-400/40 shadow-blue-600/35 hover:scale-105 active:scale-95'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span>🎓 Assistant</span>
        </button>

      </div>

    </div>
  );
}
