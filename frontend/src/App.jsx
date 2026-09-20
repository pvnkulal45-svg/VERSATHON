import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AuthPage from './components/AuthPage';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import TopicList from './components/TopicList';
import Flashcards from './components/Flashcards';
import QuizView from './components/QuizView';
import ScoreModal from './components/ScoreModal';
import WeakTopics from './components/WeakTopics';
import ExamTomorrowMode from './components/ExamTomorrowMode';
import StudentAssistant from './components/StudentAssistant';
import { 
  getCurrentUser, setAuthToken, getAuthToken,
  fetchDocuments, fetchTopics, fetchFlashcards, 
  fetchQuiz, fetchProgress, fetchWeakTopics 
} from './services/api';
import { Loader2, Menu, BookOpen } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  
  const [activeDocument, setActiveDocument] = useState(null);
  const [topics, setTopics] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [revisionRecs, setRevisionRecs] = useState([]);
  
  const [loadingDocData, setLoadingDocData] = useState(false);
  const [quizResultModal, setQuizResultModal] = useState(null);

  // 1. Check Authentication on Mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 2. Load User Documents when user logs in
  useEffect(() => {
    if (currentUser) {
      loadDocuments();
    }
  }, [currentUser]);

  // 3. Load Active Document Resources when activeDocId changes
  useEffect(() => {
    if (activeDocId && currentUser) {
      loadDocumentData(activeDocId);
    }
  }, [activeDocId]);

  const checkAuthStatus = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoadingAuth(false);
      return;
    }
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Auth check failed:", err);
      setAuthToken(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setDocuments([]);
    setActiveDocId(null);
    setActiveDocument(null);
    setTopics([]);
    setFlashcards([]);
    setQuestions([]);
  };

  const loadDocuments = async () => {
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
      if (docs.length > 0) {
        setActiveDocId(docs[0].id);
      } else {
        setActiveDocument(null);
        setTopics([]);
        setFlashcards([]);
        setQuestions([]);
        setProgress(null);
        setWeakTopics([]);
        setRevisionRecs([]);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const loadDocumentData = async (docId) => {
    try {
      setLoadingDocData(true);
      const [topRes, fcRes, qRes, progRes, weakRes] = await Promise.all([
        fetchTopics(docId),
        fetchFlashcards(docId),
        fetchQuiz(docId),
        fetchProgress(docId),
        fetchWeakTopics(docId)
      ]);

      setActiveDocument(topRes.document);
      setTopics(topRes.topics || []);
      setFlashcards(fcRes.flashcards || []);
      setQuestions(qRes.questions || []);
      setProgress(progRes);
      setWeakTopics(weakRes.weak_topics || []);
      setRevisionRecs(weakRes.revision_recommendations || []);
    } catch (err) {
      console.error('Failed to load document data:', err);
    } finally {
      setLoadingDocData(false);
    }
  };

  const handleUploadSuccess = async (uploadRes) => {
    const newDocId = uploadRes.document.id;
    await loadDocuments();
    setActiveDocId(newDocId);
    setActiveTab('dashboard');
  };

  const handleQuizSubmitted = (res) => {
    setQuizResultModal(res);
    if (activeDocId) {
      loadDocumentData(activeDocId);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Authenticating student session...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentUser}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Mobile Navigation Bar */}
        <header className="lg:hidden sticky top-0 z-30 glass-card border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                LN
              </div>
              <span className="font-display font-bold text-white text-sm">Learn Notes</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('upload')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            + Upload
          </button>
        </header>

        <main className="flex-1 pb-16">
          {loadingDocData && activeTab !== 'upload' && !activeDocument ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Loading active learning resources...</p>
            </div>
          ) : (
            <>
              {activeTab === 'upload' && (
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              )}

              {activeTab === 'dashboard' && (
                <Dashboard 
                  user={currentUser}
                  document={activeDocument}
                  documents={documents}
                  topics={topics}
                  flashcards={flashcards}
                  questions={questions}
                  progress={progress}
                  weakTopics={weakTopics}
                  setActiveTab={setActiveTab}
                  onSelectDocument={(id) => setActiveDocId(id)}
                />
              )}

              {activeTab === 'topics' && (
                <TopicList 
                  topics={topics} 
                  questionsCount={questions?.length || 0}
                />
              )}

              {activeTab === 'flashcards' && (
                <Flashcards 
                  docId={activeDocId}
                  flashcards={flashcards} 
                  onNavigateToUpload={() => setActiveTab('upload')}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizView 
                  questions={questions} 
                  docId={activeDocId} 
                  onQuizSubmitted={handleQuizSubmitted} 
                />
              )}

              {activeTab === 'weak-topics' && (
                <WeakTopics 
                  weakTopics={weakTopics}
                  revisionRecs={revisionRecs}
                  topicPerf={progress?.topic_performance || []}
                  onTakeQuiz={() => setActiveTab('quiz')}
                />
              )}

              {activeTab === 'exam-mode' && (
                <ExamTomorrowMode 
                  user={currentUser}
                  activeDocId={activeDocId}
                  documents={documents}
                  topics={topics}
                  flashcards={flashcards}
                  questions={questions}
                  progress={progress}
                  weakTopics={weakTopics}
                  revisionRecs={revisionRecs}
                  setActiveTab={setActiveTab}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Quiz Score Modal */}
      {quizResultModal && (
        <ScoreModal 
          quizResult={quizResultModal}
          onRetake={() => {
            setQuizResultModal(null);
            setActiveTab('quiz');
          }}
          onViewWeakTopics={() => {
            setQuizResultModal(null);
            setActiveTab('weak-topics');
          }}
        />
      )}

      {/* Student Assistant Guide */}
      <StudentAssistant 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentUser}
        documents={documents}
        topics={topics}
        flashcards={flashcards}
        questions={questions}
        progress={progress}
        weakTopics={weakTopics}
      />
    </div>
  );
}
