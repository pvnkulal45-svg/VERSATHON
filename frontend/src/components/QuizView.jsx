import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ChevronLeft, ChevronRight, Send, AlertCircle, Loader2, BookOpen } from 'lucide-react';
import { submitQuiz } from '../services/api';

export default function QuizView({ questions, docId, onQuizSubmitted }) {
  const [answers, setAnswers] = useState({}); // { [question_id]: 'A' | 'B' | 'C' | 'D' }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">No Quiz Questions Found</h3>
        <p className="text-slate-400 text-sm">Please upload a document to generate practice quiz questions.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (optionLetter) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionLetter
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (answeredCount < totalQ) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQ} questions. Are you sure you want to submit the quiz now?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payloadAnswers = Object.entries(answers).map(([qId, option]) => ({
        question_id: Number(qId),
        selected_option: option
      }));

      const result = await submitQuiz(docId, payloadAnswers);
      if (onQuizSubmitted) {
        onQuizSubmitted(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit quiz answers.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Quiz Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-emerald-400" />
            Practice Quiz
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Questions generated strictly based on your uploaded notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Answered Progress</span>
            <span className="text-sm font-bold text-emerald-400">
              {answeredCount} / {totalQ} Questions
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
        <div 
          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(answeredCount / totalQ) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        
        {/* Question Topic & Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {currentQ.topic_name || 'General'}
          </span>
          <span className="text-xs font-mono text-slate-400">
            Question {currentIndex + 1} of {totalQ}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-snug">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {[
            { letter: 'A', text: currentQ.option_a },
            { letter: 'B', text: currentQ.option_b },
            { letter: 'C', text: currentQ.option_c },
            { letter: 'D', text: currentQ.option_d },
          ].map((opt) => {
            const isSelected = answers[currentQ.id] === opt.letter;
            return (
              <button
                key={opt.letter}
                onClick={() => handleSelectOption(opt.letter)}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-start gap-4 border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {opt.letter}
                </span>
                <span className="text-sm font-medium pt-0.5 leading-relaxed">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Question Nav & Submit */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              currentIndex === 0
                ? 'opacity-50 cursor-not-allowed text-slate-600 bg-slate-900'
                : 'text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex === totalQ - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Answers...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
