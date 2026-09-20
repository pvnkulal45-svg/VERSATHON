import React, { useState } from 'react';
import { HelpCircle, ArrowRight, Settings, AlertCircle, Sparkles } from 'lucide-react';

export default function QuizSetup({ onStartQuiz }) {
  const [presetCount, setPresetCount] = useState(10); // 5, 10, 15, 20, 'custom'
  const [customValue, setCustomValue] = useState('');
  const [difficulty, setDifficulty] = useState('Mixed');
  const [validationError, setValidationError] = useState('');

  const getEffectiveCount = () => {
    if (presetCount !== 'custom') return presetCount;
    const parsed = parseInt(customValue, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    const parsed = parseInt(val, 10);
    if (!val || isNaN(parsed) || parsed < 1 || parsed > 50) {
      setValidationError('Please enter a number between 1 and 50.');
    } else {
      setValidationError('');
    }
  };

  const effectiveCount = getEffectiveCount();
  const isValid = effectiveCount >= 1 && effectiveCount <= 50;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      setValidationError('Please enter a number between 1 and 50.');
      return;
    }
    if (onStartQuiz) {
      onStartQuiz(effectiveCount, difficulty);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">Quiz Setup</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Configure how many questions you want to practice and your desired difficulty level.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Question Count Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
              How many questions do you want?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[5, 10, 15, 20, 'custom'].map((val) => {
                const isSelected = presetCount === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setPresetCount(val);
                      if (val !== 'custom') setValidationError('');
                    }}
                    className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {val === 'custom' ? 'Custom' : val}
                  </button>
                );
              })}
            </div>

            {/* Custom Count Input */}
            {presetCount === 'custom' && (
              <div className="pt-2 animate-fade-in">
                <input
                  type="number"
                  min="1"
                  max="50"
                  placeholder="Enter custom count (e.g. 8, 12, 25)"
                  value={customValue}
                  onChange={handleCustomChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {validationError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
              Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Easy', 'Medium', 'Hard', 'Mixed'].map((diff) => {
                const isSelected = difficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl font-semibold text-xs border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              !isValid
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25 cursor-pointer'
            }`}
          >
            <span>Start Quiz ({effectiveCount} Questions)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
}
