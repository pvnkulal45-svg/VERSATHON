import React, { useState } from 'react';
import { Layers, RotateCw, ChevronLeft, ChevronRight, Filter, BookOpen } from 'lucide-react';

export default function Flashcards({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('ALL');

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">No Flashcards Available</h3>
        <p className="text-slate-400 text-sm">Please upload a document to generate active-learning flashcards.</p>
      </div>
    );
  }

  // Get list of unique topic names
  const topicsList = ['ALL', ...new Set(flashcards.map(f => f.topic_name).filter(Boolean))];

  // Filter flashcards by topic
  const filteredCards = selectedTopic === 'ALL'
    ? flashcards
    : flashcards.filter(f => f.topic_name === selectedTopic);

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleTopicChange = (t) => {
    setSelectedTopic(t);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header & Topic Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
            <Layers className="w-7 h-7 text-indigo-400" />
            Study Flashcards
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Active recall flashcards generated directly from your uploaded material.
          </p>
        </div>

        {/* Topic Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {topicsList.slice(0, 5).map((topic, i) => (
            <button
              key={i}
              onClick={() => handleTopicChange(topic)}
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
      </div>

      {/* Progress Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Topic: <strong className="text-indigo-400">{activeCard?.topic_name || 'General'}</strong>
        </span>
        <span className="font-mono">
          Card <strong className="text-white">{currentIndex + 1}</strong> of <strong className="text-white">{filteredCards.length}</strong>
        </span>
      </div>

      {/* 3D Flip Flashcard Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer group"
      >
        <div className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT OF CARD (Question) */}
          <div className="absolute inset-0 w-full h-full glass-card rounded-3xl p-8 border border-slate-800/90 flex flex-col justify-between backface-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                QUESTION
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
                Click to flip
              </span>
            </div>

            <div className="my-auto text-center px-4">
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-white leading-snug">
                {activeCard?.question}
              </h3>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                {activeCard?.topic_name}
              </span>
              <span>Tap anywhere to reveal answer</span>
            </div>
          </div>

          {/* BACK OF CARD (Answer) */}
          <div className="absolute inset-0 w-full h-full glass-card rounded-3xl p-8 border border-indigo-500/30 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl bg-gradient-to-br from-indigo-950/80 via-slate-950 to-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ANSWER
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                Click to flip back
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

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="py-3 px-6 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          <span>Flip Card</span>
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
