import React from 'react';
import { ArrowLeft, BookOpen, Lightbulb, CheckCircle2, Award, Zap, Sparkles, AlertCircle } from 'lucide-react';

export default function TopicDetail({ topic, onBack }) {
  if (!topic) return null;

  const keyPoints = Array.isArray(topic.key_points) ? topic.key_points : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-all inline-flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Topics</span>
      </button>

      {/* Main Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8 shadow-2xl">
        
        {/* Topic Title & Importance Badge */}
        <div className="space-y-3 pb-6 border-b border-slate-800/80">
          <div className="flex items-center justify-between gap-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              topic.importance === 'High'
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : topic.importance === 'Medium'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
              {topic.importance || 'Medium'} Importance Topic
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Verified Notes Concept
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white leading-tight">
            {topic.title}
          </h1>

          {topic.summary && (
            <p className="text-slate-300 text-base leading-relaxed">
              {topic.summary}
            </p>
          )}
        </div>

        {/* Section 1: Simple Explanation */}
        <div className="space-y-3 p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <h3 className="text-base font-display font-bold text-blue-300 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            Simple Explanation
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {topic.simple_explanation || topic.summary || "This topic represents a fundamental concept extracted from your study notes."}
          </p>
        </div>

        {/* Section 2: Detailed Explanation */}
        <div className="space-y-3 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Detailed Explanation
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {topic.detailed_explanation || topic.description || "Detailed technical breakdown extracted directly from your study material."}
          </p>
        </div>

        {/* Section 3: Example */}
        {topic.example && (
          <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-display font-bold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Practical Example
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {topic.example}
            </p>
          </div>
        )}

        {/* Section 4: Key Points */}
        {keyPoints.length > 0 && (
          <div className="space-y-3 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Key Points to Remember
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {keyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2"></span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Grid: Exam Tip & Quick Memory Tip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Exam Tip */}
          {topic.exam_tip && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <h3 className="text-sm font-display font-bold text-amber-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Exam Tip
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {topic.exam_tip}
              </p>
            </div>
          )}

          {/* Memory Tip */}
          {topic.memory_tip && (
            <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <h3 className="text-sm font-display font-bold text-indigo-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                Quick Memory Tip
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {topic.memory_tip}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
