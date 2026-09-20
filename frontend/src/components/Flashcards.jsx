import React, { useState, useEffect } from 'react';
import { 
  Layers, RotateCw, ChevronLeft, ChevronRight, Shuffle, 
  RefreshCw, CheckCircle2, AlertCircle, Filter, BookOpen, 
  Upload, Settings, PlusCircle, Loader2 
} from 'lucide-react';
import { fetchFlashcards, updateFlashcardStatus, generateMoreContent } from '../services/api';
import FlashcardSetup from './FlashcardSetup';

export default function Flashcards({ docId, onNavigateToUpload }) {
  const [setupConfig, setSetupConfig] = useState(null); // { count: 10, difficulty: 'Mixed' }
  const [cardsList, setCardsList] = useState([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatingMore, setGeneratingMore] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (setupConfig) {
      loadCards(setupConfig.count, setupConfig.difficulty);
    }
  }, [setupConfig, docId]);

  const loadCards = async (count, difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFlashcards(docId, count, difficulty);
      setCardsList(res.flashcards || []);
      setTotalAvailable(res.total_available || 0);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError(err.message || 'Failed to load flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMore = async () => {
    setGeneratingMore(true);
    try {
      await generateMoreContent(docId);
      if (setupConfig) {
        await loadCards(setupConfig.count, setupConfig.difficulty);
      }
    } catch (err) {
      alert('Failed to generate more content: ' + err.message);
    } finally {
      setGeneratingMore(false);
    }
  };

  // 1. Render Setup Screen
  if (!setupConfig) {
    return <FlashcardSetup onStartFlashcards={(count, difficulty) => setSetupConfig({ count, difficulty })} />;
  }

  // 2. Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Preparing your {setupConfig.count} flashcards...</p>
      </div>
    );
  }

  // 3. Empty Cards State
  if (!cardsList || cardsList.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white">No Flashcards Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {error || 'No flashcards available matching your criteria.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setSetupConfig(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Change Setup</span>
            </button>

            <button
              onClick={onNavigateToUpload}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Notes</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const topicsList = ['ALL', ...new Set(cardsList.map(f => f.topic_name).filter(Boolean))];
  const filteredCards = selectedTopic === 'ALL'
    ? cardsList
    : cardsList.filter(f => f.topic_name === selectedTopic);

  const activeCard = filteredCards[currentIndex] || filteredCards[0];
  const requestedCount = setupConfig.count;
  const showShortageNotice = totalAvailable < requestedCount;

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
            Target Count: <strong className="text-indigo-400">{requestedCount} Cards</strong> • Difficulty: <strong className="text-slate-200">{setupConfig.difficulty}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSetupConfig(null)}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Setup</span>
          </button>

          <button
            onClick={handleShuffle}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={handleRestart}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Shortage Notification if totalAvailable < requestedCount */}
      {showShortageNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Only <strong>{totalAvailable}</strong> flashcard(s) are available from your notes.</span>
          </div>
          <button
            onClick={handleGenerateMore}
            disabled={generatingMore}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold border border-amber-500/30 transition-all shrink-0 cursor-pointer inline-flex items-center gap-1"
          >
            {generatingMore ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>Generate More</span>
          </button>
        </div>
      )}

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

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0">
          <span>Card</span>
          <strong className="text-white text-sm bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            {currentIndex + 1} of {filteredCards.length}
          </strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
        <div 
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
        ></div>
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
