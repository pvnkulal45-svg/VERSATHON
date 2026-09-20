import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, Clock, AlertTriangle, BookOpen, Layers, HelpCircle, 
  RefreshCw, CheckCircle2, ArrowRight, Play, Pause, RotateCcw, 
  Sparkles, Award, ArrowLeft, Upload, FileText, ChevronRight, X
} from 'lucide-react';
import TopicDetail from './TopicDetail';

export default function ExamTomorrowMode({
  user,
  activeDocId,
  documents,
  topics,
  flashcards,
  questions,
  progress,
  weakTopics,
  revisionRecs,
  setActiveTab
}) {
  const [viewState, setViewState] = useState('setup'); // 'setup' | 'plan-preview' | 'active-session' | 'completed'
  const [selectedDuration, setSelectedDuration] = useState(60); // 30, 60, 120, 240 minutes
  const [generatedPlan, setGeneratedPlan] = useState([]);
  
  // Active session state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTopicDetail, setSelectedTopicDetail] = useState(null);

  // Interactive step session state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScoreResult, setQuizScoreResult] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Session stats for summary
  const [sessionStats, setSessionStats] = useState({
    topicsReviewed: 0,
    quizAnswered: 0,
    quizCorrect: 0
  });

  const timerRef = useRef(null);

  // 1. Generate Plan based on Selected Time and Available Data
  const handleGeneratePlan = (durationMinutes) => {
    setSelectedDuration(durationMinutes);
    const plan = buildStudyPlan(durationMinutes, {
      topics: topics || [],
      weakTopics: weakTopics || [],
      flashcards: flashcards || [],
      questions: questions || [],
      progress
    });
    setGeneratedPlan(plan);
    setViewState('plan-preview');
  };

  // Helper to construct structured study plan
  const buildStudyPlan = (duration, data) => {
    const { topics, weakTopics, flashcards, questions, progress } = data;

    const hasWeak = weakTopics && weakTopics.length > 0;
    const hasTopics = topics && topics.length > 0;
    const hasFlashcards = flashcards && flashcards.length > 0;
    const hasQuestions = questions && questions.length > 0;

    let steps = [];

    if (duration === 30) {
      // 30 MIN PLAN: 8 min Weak + 10 min Important + 7 min Quick Quiz + 5 min Final Revision = 30 min
      if (hasWeak) {
        steps.push({
          type: 'weak',
          title: '🔴 Weak Concepts',
          durationMinutes: 8,
          description: 'Review topics where your previous quiz accuracy was under 60%.',
          items: weakTopics.slice(0, 3)
        });
      } else {
        steps.push({
          type: 'important',
          title: '⭐ High-Priority Concepts',
          durationMinutes: 8,
          description: 'No weak topics flagged yet — focusing on core principles.',
          items: topics.slice(0, 2)
        });
      }

      steps.push({
        type: 'important',
        title: '⭐ Important Concepts',
        durationMinutes: 10,
        description: 'Focus on high-importance topics extracted from your notes.',
        items: topics.slice(0, 4)
      });

      if (hasQuestions) {
        steps.push({
          type: 'quiz',
          title: '🧠 Quick Quiz',
          durationMinutes: 7,
          description: 'Test your understanding with 5 key practice questions.',
          items: questions.slice(0, 5)
        });
      } else if (hasFlashcards) {
        steps.push({
          type: 'flashcards',
          title: '🃏 Quick Flashcard Recall',
          durationMinutes: 7,
          description: 'Review core active recall flashcards.',
          items: flashcards.slice(0, 5)
        });
      }

      steps.push({
        type: 'revision',
        title: '🔄 Final Revision',
        durationMinutes: 5,
        description: 'Review key definitions, exam tips, and memory tricks before finishing.',
        items: topics.slice(0, 5)
      });

    } else if (duration === 60) {
      // 60 MIN PLAN: 15 min Weak + 20 min Important + 15 min Adaptive Quiz + 10 min Final Revision = 60 min
      steps.push({
        type: 'weak',
        title: '🔴 Weak Concepts',
        durationMinutes: 15,
        description: hasWeak 
          ? 'Deep dive into topics where accuracy was low.'
          : 'Focusing heavily on essential definitions & concepts.',
        items: hasWeak ? weakTopics : topics.slice(0, 3)
      });

      steps.push({
        type: 'important',
        title: '⭐ Important Concepts',
        durationMinutes: 20,
        description: 'Review key concepts, detailed explanations, and practical examples.',
        items: topics
      });

      if (hasQuestions) {
        steps.push({
          type: 'quiz',
          title: '🧠 Adaptive Quiz',
          durationMinutes: 15,
          description: 'Practice 10 targeted multiple-choice questions.',
          items: questions.slice(0, 10)
        });
      }

      if (hasFlashcards && !hasQuestions) {
        steps.push({
          type: 'flashcards',
          title: '🃏 Flashcard Recall',
          durationMinutes: 15,
          description: 'Study 10 active recall flashcards.',
          items: flashcards.slice(0, 10)
        });
      }

      steps.push({
        type: 'revision',
        title: '🔄 Final Revision',
        durationMinutes: 10,
        description: 'Review exam tips, memory mnemonics, and key formulas.',
        items: topics
      });

    } else if (duration === 120) {
      // 120 MIN PLAN: 30 min Weak + 35 min Important + 30 min Quiz + 15 min Flashcards + 10 min Revision = 120 min
      steps.push({
        type: 'weak',
        title: '🔴 Weak Concepts',
        durationMinutes: 30,
        description: 'Comprehensive review of weak topics and previous mistakes.',
        items: hasWeak ? weakTopics : topics.slice(0, 4)
      });

      steps.push({
        type: 'important',
        title: '⭐ Important Concepts',
        durationMinutes: 35,
        description: 'In-depth study of all extracted important topics.',
        items: topics
      });

      if (hasQuestions) {
        steps.push({
          type: 'quiz',
          title: '🧠 Comprehensive Quiz',
          durationMinutes: 30,
          description: 'Answer 15 practice questions under timed conditions.',
          items: questions.slice(0, 15)
        });
      }

      if (hasFlashcards) {
        steps.push({
          type: 'flashcards',
          title: '🃏 Flashcard Active Recall',
          durationMinutes: 15,
          description: 'Review active recall cards to solidify memory.',
          items: flashcards.slice(0, 15)
        });
      }

      steps.push({
        type: 'revision',
        title: '🔄 Final Revision',
        durationMinutes: 10,
        description: 'Final summary pass over all exam tips and key points.',
        items: topics
      });

    } else {
      // 240 MIN PLAN: 60 min Weak + 75 min Important + 60 min Quiz + 35 min Flashcards + 30 min Revision = 240 min
      steps.push({
        type: 'weak',
        title: '🔴 Weak Concepts Masterclass',
        durationMinutes: 60,
        description: 'Master every weak concept with thorough review.',
        items: hasWeak ? weakTopics : topics
      });

      steps.push({
        type: 'important',
        title: '⭐ Important Concepts Deep Prep',
        durationMinutes: 75,
        description: 'Detailed pass over all notes, explanations, and examples.',
        items: topics
      });

      if (hasQuestions) {
        steps.push({
          type: 'quiz',
          title: '🧠 Full Practice Exam',
          durationMinutes: 60,
          description: 'Complete practice quiz covering all topics.',
          items: questions.slice(0, 20)
        });
      }

      if (hasFlashcards) {
        steps.push({
          type: 'flashcards',
          title: '🃏 Extended Flashcard Recall',
          durationMinutes: 35,
          description: 'Comprehensive active recall drill.',
          items: flashcards.slice(0, 25)
        });
      }

      steps.push({
        type: 'revision',
        title: '🔄 Final Summary & Formula Pass',
        durationMinutes: 30,
        description: 'Complete final checklist before your exam tomorrow.',
        items: topics
      });
    }

    return steps;
  };

  // 2. Start Active Session
  const handleStartSession = () => {
    if (!generatedPlan || generatedPlan.length === 0) return;
    setCurrentStepIndex(0);
    const firstStep = generatedPlan[0];
    setStepSecondsLeft(firstStep.durationMinutes * 60);
    setIsTimerRunning(true);
    setViewState('active-session');
  };

  // Live Timer Effect
  useEffect(() => {
    if (viewState === 'active-session' && isTimerRunning) {
      timerRef.current = setInterval(() => {
        setStepSecondsLeft((prev) => {
          if (prev <= 1) {
            handleStepCompletionAuto();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewState, isTimerRunning, currentStepIndex]);

  const handleStepCompletionAuto = () => {
    if (currentStepIndex < generatedPlan.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const nextStep = generatedPlan[nextIdx];
      setStepSecondsLeft(nextStep.durationMinutes * 60);
    } else {
      finishExamSession();
    }
  };

  const handleManualNextStep = () => {
    if (currentStepIndex < generatedPlan.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const nextStep = generatedPlan[nextIdx];
      setStepSecondsLeft(nextStep.durationMinutes * 60);
    } else {
      finishExamSession();
    }
  };

  const handleManualPrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      const prevStep = generatedPlan[prevIdx];
      setStepSecondsLeft(prevStep.durationMinutes * 60);
    }
  };

  const finishExamSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerRunning(false);
    
    // Compute summary stats
    const reviewedCount = topics?.length || 0;
    const answeredCount = Object.keys(quizAnswers).length;
    let correctCount = 0;
    
    if (questions && questions.length > 0) {
      questions.forEach((q) => {
        if (quizAnswers[q.id] && quizAnswers[q.id] === q.correct_option) {
          correctCount += 1;
        }
      });
    }

    setSessionStats({
      topicsReviewed: reviewedCount,
      quizAnswered: answeredCount,
      quizCorrect: correctCount
    });

    setViewState('completed');
  };

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate Overall Progress Percentage
  const calculateProgressPercent = () => {
    if (!generatedPlan || generatedPlan.length === 0) return 0;
    const totalPlanMinutes = generatedPlan.reduce((acc, step) => acc + step.durationMinutes, 0);
    const completedMinutes = generatedPlan
      .slice(0, currentStepIndex)
      .reduce((acc, step) => acc + step.durationMinutes, 0);
    const currentStepMinutes = generatedPlan[currentStepIndex]?.durationMinutes || 1;
    const currentElapsedMinutes = currentStepMinutes - (stepSecondsLeft / 60);
    
    const progress = ((completedMinutes + currentElapsedMinutes) / totalPlanMinutes) * 100;
    return Math.min(100, Math.max(0, Math.round(progress)));
  };

  // Render Topic Breakdown Modal if selected
  if (selectedTopicDetail) {
    return (
      <TopicDetail 
        topic={selectedTopicDetail} 
        onBack={() => setSelectedTopicDetail(null)} 
      />
    );
  }

  // ---------------------------------------------------------------------------
  // SCREEN 1: SETUP SCREEN
  // ---------------------------------------------------------------------------
  if (viewState === 'setup') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 border border-amber-400/40">
            <Target className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            🎯 Exam Tomorrow Mode
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Your exam is tomorrow? Let's make the most of the time you have. LearnFlow will analyze your notes, weak concepts, and study data to generate a focused preparation plan.
          </p>
        </div>

        {/* Time Selection Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              How much time can you study today?
            </h3>
            <p className="text-slate-400 text-xs">
              Select your available study time. LearnFlow guarantees your plan fits strictly within this limit.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { min: 30, label: '30 Minutes', tag: 'Quick Sprint' },
              { min: 60, label: '1 Hour', tag: 'Power Session' },
              { min: 120, label: '2 Hours', tag: 'Deep Prep' },
              { min: 240, label: '4 Hours', tag: 'Ultimate Cram' }
            ].map((opt) => {
              const isSelected = selectedDuration === opt.min;
              return (
                <button
                  key={opt.min}
                  onClick={() => setSelectedDuration(opt.min)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${
                    isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {opt.tag}
                  </span>
                  <div>
                    <span className="text-lg font-extrabold text-white block">⏱ {opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Available Data Summary Indicator */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-slate-300 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Available Study Data for Plan Generation:
            </span>
            <div className="flex flex-wrap items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                {documents?.length || 0} Documents
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                {topics?.length || 0} Topics
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                {weakTopics?.length || 0} Weak Topics
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                {flashcards?.length || 0} Flashcards
              </span>
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                {questions?.length || 0} Questions
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleGeneratePlan(selectedDuration)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-base transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Generate {selectedDuration === 60 ? '1 Hour' : selectedDuration === 120 ? '2 Hour' : selectedDuration === 240 ? '4 Hour' : '30 Minute'} Exam Plan →</span>
          </button>
        </div>

      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCREEN 2: PLAN PREVIEW SCREEN
  // ---------------------------------------------------------------------------
  if (viewState === 'plan-preview') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewState('setup')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Time</span>
          </button>

          <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            TOTAL TIME: {selectedDuration} MINUTES
          </span>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white flex items-center gap-2">
              🔥 EXAM MODE — {selectedDuration >= 60 ? `${selectedDuration / 60} HOUR${selectedDuration > 60 ? 'S' : ''}` : '30 MINUTES'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Your custom time-allocated study plan based on your study data.
            </p>
          </div>

          {/* Generated Steps List */}
          <div className="space-y-3">
            {generatedPlan.map((step, idx) => (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {step.durationMinutes} min
                    </span>
                    <h4 className="font-bold text-white text-base">{step.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <span className="text-xs font-semibold text-slate-400 shrink-0 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  {step.items?.length || 0} Items Assigned
                </span>
              </div>
            ))}
          </div>

          {/* Start Session Action Button */}
          <button
            onClick={handleStartSession}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-base transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Exam Session Now →</span>
          </button>
        </div>

      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCREEN 3: LIVE ACTIVE SESSION SCREEN
  // ---------------------------------------------------------------------------
  if (viewState === 'active-session') {
    const currentStep = generatedPlan[currentStepIndex] || generatedPlan[0];
    const progressPct = calculateProgressPercent();

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        
        {/* Top Control Bar */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/90">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Step {currentStepIndex + 1} of {generatedPlan.length}
              </span>
              <h3 className="font-display font-bold text-white text-base sm:text-lg">
                {currentStep.title}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {currentStep.description}
            </p>
          </div>

          {/* Live Timer Clock & Play/Pause */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/30 font-mono font-extrabold text-lg sm:text-xl text-amber-400 shadow-inner">
              ⏱ {formatTime(stepSecondsLeft)}
            </div>

            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold cursor-pointer"
            >
              {isTimerRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

        </div>

        {/* Session Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Overall Session Progress</span>
            <span className="font-bold text-amber-400">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* STEP CONTENT MODULE */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
          
          {/* STEP TYPE 1: WEAK CONCEPTS */}
          {currentStep.type === 'weak' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Targeted Weak Concepts ({currentStep.items?.length || 0})
                </h4>
                <span className="text-xs text-slate-400">Accuracy &lt; 60%</span>
              </div>

              {currentStep.items && currentStep.items.length > 0 ? (
                <div className="space-y-3">
                  {currentStep.items.map((top, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedTopicDetail(top)}
                      className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-200 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-sm text-white group-hover:text-amber-300">
                          {top.topic_name || top.title}
                        </span>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {top.summary || top.description || top.recommendation}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No weak topics flagged yet. You are performing well!</p>
              )}
            </div>
          )}

          {/* STEP TYPE 2: IMPORTANT CONCEPTS */}
          {currentStep.type === 'important' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  High-Priority Important Topics ({currentStep.items?.length || 0})
                </h4>
                <span className="text-xs text-slate-400">Click topic for full explanation</span>
              </div>

              {currentStep.items && currentStep.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentStep.items.map((top, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedTopicDetail(top)}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-slate-200 transition-all cursor-pointer space-y-2 group"
                    >
                      <span className="font-bold text-sm text-white group-hover:text-blue-400 block">
                        {top.title}
                      </span>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {top.summary || top.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Upload notes to generate important topics.</p>
              )}
            </div>
          )}

          {/* STEP TYPE 3: ADAPTIVE QUIZ */}
          {currentStep.type === 'quiz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  Adaptive Quiz Practice ({currentStep.items?.length || 0} Questions)
                </h4>
                <span className="text-xs text-slate-400">Instant Answer Feedback</span>
              </div>

              {currentStep.items && currentStep.items.length > 0 ? (
                <div className="space-y-4">
                  {currentStep.items.map((q, qIdx) => {
                    const selectedOpt = quizAnswers[q.id];
                    const isAnswered = Boolean(selectedOpt);

                    return (
                      <div key={q.id || qIdx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <h5 className="font-bold text-sm text-white">
                          {qIdx + 1}. {q.question}
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {['A', 'B', 'C', 'D'].map((letter) => {
                            const optText = q[`option_${letter.toLowerCase()}`];
                            const isSelected = selectedOpt === letter;
                            const isCorrect = q.correct_option.upper() === letter;

                            return (
                              <button
                                key={letter}
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: letter }))}
                                className={`p-3 rounded-xl text-xs text-left border font-medium transition-all cursor-pointer ${
                                  isSelected
                                    ? isCorrect
                                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                                      : 'bg-red-500/20 border-red-500 text-red-200'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span className="font-bold mr-1.5">{letter}.</span> {optText}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No quiz questions available for this document.</p>
              )}
            </div>
          )}

          {/* STEP TYPE 4: FLASHCARDS */}
          {currentStep.type === 'flashcards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Flashcard Active Recall
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  Card {flashcardIndex + 1} of {currentStep.items?.length || 0}
                </span>
              </div>

              {currentStep.items && currentStep.items.length > 0 ? (
                <div className="space-y-4">
                  <div 
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="w-full h-64 glass-card rounded-2xl p-6 border border-indigo-500/30 flex flex-col justify-between cursor-pointer bg-slate-900"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {isCardFlipped ? 'ANSWER' : 'QUESTION (Click card to Flip)'}
                    </span>

                    <p className="text-lg font-semibold text-white text-center my-auto">
                      {isCardFlipped ? currentStep.items[flashcardIndex]?.answer : currentStep.items[flashcardIndex]?.question}
                    </p>

                    <span className="text-xs text-slate-500 text-right">
                      Topic: {currentStep.items[flashcardIndex]?.topic_name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => { setIsCardFlipped(false); setFlashcardIndex(prev => Math.max(0, prev - 1)); }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      ← Previous Card
                    </button>

                    <button
                      onClick={() => { setIsCardFlipped(false); setFlashcardIndex(prev => (prev + 1) % currentStep.items.length); }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Next Card →
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No flashcards available.</p>
              )}
            </div>
          )}

          {/* STEP TYPE 5: FINAL REVISION */}
          {currentStep.type === 'revision' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-400" />
                  Final Exam Checklist & Exam Tips
                </h4>
                <span className="text-xs text-slate-400">Quick final pass</span>
              </div>

              {topics && topics.length > 0 ? (
                <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                  {topics.map((top, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="font-bold text-white text-sm block">✓ {top.title}</span>
                      {top.exam_tip && (
                        <p className="text-amber-300 text-xs">
                          💡 <strong>Exam Tip:</strong> {top.exam_tip}
                        </p>
                      )}
                      {top.memory_tip && (
                        <p className="text-indigo-300 text-xs">
                          🧠 <strong>Memory Tip:</strong> {top.memory_tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Upload notes to see exam tips and key memory mnemonics.</p>
              )}
            </div>
          )}

        </div>

        {/* Bottom Session Navigation Controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            disabled={currentStepIndex === 0}
            onClick={handleManualPrevStep}
            className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              currentStepIndex === 0 
                ? 'bg-slate-900/50 text-slate-600 border-slate-850 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            ← Previous Activity
          </button>

          <button
            onClick={finishExamSession}
            className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-semibold cursor-pointer"
          >
            Exit Session
          </button>

          <button
            onClick={handleManualNextStep}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            {currentStepIndex < generatedPlan.length - 1 ? 'Complete Step →' : 'Finish Session 🎉'}
          </button>
        </div>

      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCREEN 4: SESSION COMPLETED SCREEN
  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6 animate-fade-in">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-6 shadow-2xl">
        
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30 border border-amber-400/40">
          <Award className="w-10 h-10 fill-current" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            🎉 Exam Mode Complete!
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            You completed your focused revision session for tomorrow's exam. Keep calm and focus on what you know!
          </p>
        </div>

        {/* Factual Summary Metrics */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-left">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Exam Preparation Summary
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Total Study Time</span>
              <strong className="text-white text-sm">{selectedDuration} Minutes</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Topics Reviewed</span>
              <strong className="text-blue-400 text-sm">{sessionStats.topicsReviewed} Topics</strong>
            </div>

            {sessionStats.quizAnswered > 0 && (
              <>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Quiz Questions</span>
                  <strong className="text-emerald-400 text-sm">{sessionStats.quizAnswered} Questions</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Quiz Accuracy</span>
                  <strong className="text-emerald-400 text-sm">
                    {Math.round((sessionStats.quizCorrect / sessionStats.quizAnswered) * 100)}%
                  </strong>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Real Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setActiveTab('weak-topics')}
            className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs transition-all cursor-pointer"
          >
            View Performance
          </button>

          <button
            onClick={() => setActiveTab('weak-topics')}
            className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 font-semibold text-xs transition-all cursor-pointer"
          >
            Review Weak Topics
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Back to Dashboard →
          </button>
        </div>

      </div>
    </div>
  );
}
