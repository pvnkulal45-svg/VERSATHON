import React, { useState } from 'react';
import { Layers, RotateCw, ChevronLeft, ChevronRight, Shuffle, RefreshCw, CheckCircle2, AlertCircle, Filter, BookOpen, Upload } from 'lucide-react';
import { updateFlashcardStatus } from '../services/api';

export default function Flashcards({ flashcards, onNavigateToUpload }) {
  const [cardsList, setCardsList] = useState(flashcards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('ALL');

  // Sync if prop updates
  React.useEffect(() => {
    setCardsList(flashcards || []);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  if (!cardsList || cardsList.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white">No Flashcards Yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Upload your study notes or PDF to automatically generate active-recall flashcards.
          </p>
          <button
            onClick={onNavigateToUpload}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 inline-flex items-center gap-2 cursor-pointer mt-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Notes & Generate Flashcards</span>
          </button>
        </div>
      </div>
    );
  }

  // Get unique topics
  const topicsList = ['ALL', ...new Set(cardsList.map(f => f.topic_name).filter(Boolean))];

  // Filter flashcards by topic
  const filteredCards = selectedTopic === 'ALL'
    ? cardsList
    : cardsList.filter(f => f.topic_name === selectedTopic);

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    const shuffled = [...cardsList].sort(() => Math.random() - 0.5);
    setCardsList(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleMarkStatus = async (status) => {
    if (!activeCard) return;
    try {
      await updateFlashcardStatus(activeCard.id, status);
      // Update local state
      setCardsList(prev => prev.map(c => c.id === activeCard.id ? { ...c, status } : c));
      handleNext();
    } catch (err) {
      console.error('Failed to update flashcard status:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
            <Layers className="w-7 h-7 text-indigo-400" />
            Study Flashcards
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Test your active recall. Flip cards to reveal answers and mark your learning progress.
          </p>
        </div>

        {/* Action Buttons: Shuffle & Restart */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={handleRestart}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Topic Filter Pills & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {topicsList.slice(0, 6).map((topic, i) => (
            <button
              key={i}
              onClick={() => { setSelectedTopic(topic); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
          <span>Card</span>
          <strong className="text-white text-sm bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            {currentIndex + 1} / {filteredCards.length}
          </strong>
        </div>
      </div>

      {/* 3D Flip Flashcard Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer group"
      >
        <div className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT OF CARD (Question) */}
          <div className="absolute inset-0 w-full h-full glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/90 flex flex-col justify-between backface-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                QUESTION
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {activeCard?.difficulty || 'Medium'}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  Flip
                </span>
              </div>
            </div>

            <div className="my-auto text-center px-4">
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-white leading-relaxed">
                {activeCard?.question}
              </h3>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                {activeCard?.topic_name}
              </span>
              <span className="text-indigo-400 font-semibold">Click card to Show Answer</span>
            </div>
          </div>

          {/* BACK OF CARD (Answer) */}
          <div className="absolute inset-0 w-full h-full glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/30 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl bg-gradient-to-br from-indigo-950/80 via-slate-950 to-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ANSWER
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                Flip back
              </span>
            </div>

            <div className="my-auto text-center px-4">
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-medium">
                {activeCard?.answer}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/60">
              <span className="text-indigo-300 font-medium">Verified from Study Notes</span>
              <span>Answer Card</span>
            </div>
          </div>

        </div>
      </div>

      {/* Answer Toggle & Status Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="py-3 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          <span>{isFlipped ? 'Hide Answer' : 'Show Answer'}</span>
        </button>

        <button
          onClick={() => handleMarkStatus('review')}
          className="py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>Review Again</span>
        </button>

        <button
          onClick={() => handleMarkStatus('know')}
          className="py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>I Know This</span>
        </button>

      </div>

      {/* Previous & Next Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
