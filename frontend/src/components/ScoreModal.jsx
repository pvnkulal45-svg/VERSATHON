import React from 'react';
import { Trophy, CheckCircle2, XCircle, AlertTriangle, RefreshCw, ArrowRight, BookOpen } from 'lucide-react';

export default function ScoreModal({ quizResult, onRetake, onViewWeakTopics }) {
  if (!quizResult) return null;

  const {
    total_questions,
    correct_answers,
    incorrect_answers,
    score_percentage,
    weak_topics,
    revision_recommendations
  } = quizResult;

  const isPassed = score_percentage >= 70;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 my-8 animate-fade-in">
        
        {/* Score Header */}
        <div className="text-center space-y-2">
          <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center border shadow-xl ${
            isPassed
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/10'
          }`}>
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-display font-extrabold text-white">
            Quiz Completed!
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">
            Here is your score breakdown based on your active recall quiz performance.
          </p>
        </div>

        {/* Score Percentage Badge */}
        <div className="text-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block">Overall Score</span>
          <div className={`text-4xl sm:text-5xl font-extrabold ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
            {score_percentage}%
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {correct_answers} out of {total_questions} questions answered correctly
          </p>
        </div>

        {/* Correct vs Incorrect Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block font-medium">Correct</span>
              <span className="text-lg font-bold text-emerald-300">{correct_answers}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block font-medium">Incorrect</span>
              <span className="text-lg font-bold text-red-300">{incorrect_answers}</span>
            </div>
          </div>
        </div>

        {/* Weak Topics Alert (<60% accuracy rule) */}
        {weak_topics && weak_topics.length > 0 ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Weak Topics Identified ({weak_topics.length})</span>
            </div>
            <p className="text-xs text-slate-300">
              The following topics scored below 60% accuracy:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {weak_topics.map((wt, i) => (
                <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {wt.topic_name} ({wt.accuracy}%)
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
            🎉 Excellent performance! All topics achieved over 60% accuracy.
          </div>
        )}

        {/* Revision Recommendations Preview */}
        {revision_recommendations && revision_recommendations.length > 0 && (
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-300 block">Target Revision Recommendations:</span>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {revision_recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <strong>{rec.topic_name}:</strong> {rec.recommendation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onRetake}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={onViewWeakTopics}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>View Full Revision Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
