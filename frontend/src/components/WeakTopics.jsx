import React from 'react';
import { AlertTriangle, CheckCircle2, BookOpen, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

export default function WeakTopics({ weakTopics, revisionRecs, topicPerf, onTakeQuiz }) {
  const hasWeakTopics = weakTopics && weakTopics.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-amber-400" />
          Weak Topics & Revision Plan
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Topics with quiz accuracy under 60% are flagged for targeted revision.
        </p>
      </div>

      {/* Accuracy Rule Banner */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <span className="font-bold text-white block text-base">Transparent Rule</span>
          <p>
            Topic Accuracy = (Correct Answers in Topic / Total Questions in Topic) × 100%.
          </p>
          <p className="text-slate-400">
            Any topic with accuracy &lt; 60% is automatically classified as a <span className="text-amber-400 font-semibold">Weak Topic</span> requiring revision.
          </p>
        </div>
      </div>

      {/* Topic Accuracy Breakdown Table/List */}
      {topicPerf && topicPerf.length > 0 ? (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Topic Performance Breakdown
          </h3>

          <div className="space-y-3">
            {topicPerf.map((tp, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  tp.is_weak
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{tp.topic_name}</span>
                    {tp.is_weak ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                        WEAK TOPIC
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        MASTERED
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {tp.correct} / {tp.total} questions correct
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 hidden sm:block">
                    <div 
                      className={`h-2 rounded-full ${tp.is_weak ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${tp.accuracy}%` }}
                    ></div>
                  </div>
                  <span className={`text-base font-extrabold ${tp.is_weak ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {tp.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center border border-slate-800">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-300">No Quiz Performance Data</h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-4">
            Complete a practice quiz to generate your topic performance analytics.
          </p>
          <button
            onClick={onTakeQuiz}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Practice Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Target Revision Recommendations */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Recommended Revision Steps
        </h3>

        {hasWeakTopics ? (
          <div className="space-y-3">
            {revisionRecs.map((rec, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>Priority #{i + 1}: {rec.topic_name}</span>
                  <span>Accuracy: {rec.accuracy}%</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">
                  {rec.recommendation}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-emerald-200">No Revision Action Required</p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                All topics are currently scoring above the 60% threshold. Keep up the great work!
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
