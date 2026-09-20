import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import TopicList from './components/TopicList';
import Flashcards from './components/Flashcards';
import QuizView from './components/QuizView';
import ScoreModal from './components/ScoreModal';
import WeakTopics from './components/WeakTopics';
import { 
  fetchDocuments, fetchTopics, fetchFlashcards, 
  fetchQuiz, fetchProgress, fetchWeakTopics 
} from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  
  const [activeDocument, setActiveDocument] = useState(null);
  const [topics, setTopics] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [revisionRecs, setRevisionRecs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [quizResultModal, setQuizResultModal] = useState(null);

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, []);

  // When active doc changes, reload doc resources
  useEffect(() => {
    if (activeDocId) {
      loadDocumentData(activeDocId);
    }
  }, [activeDocId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await fetchDocuments();
      setDocuments(docs);
      if (docs.length > 0) {
        setActiveDocId(docs[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
      setLoading(false);
    }
  };

  const loadDocumentData = async (docId) => {
    try {
      setLoading(true);
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
      setLoading(false);
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
    // Reload progress & weak topics
    if (activeDocId) {
      loadDocumentData(activeDocId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        documents={documents}
        activeDocId={activeDocId}
        setActiveDocId={setActiveDocId}
      />

      <main className="flex-1 pb-16">
        {loading && !activeDocument && activeTab !== 'upload' ? (
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
                document={activeDocument}
                topics={topics}
                flashcards={flashcards}
                questions={questions}
                progress={progress}
                weakTopics={weakTopics}
                revisionRecs={revisionRecs}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'topics' && (
              <TopicList topics={topics} />
            )}

            {activeTab === 'flashcards' && (
              <Flashcards flashcards={flashcards} />
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
          </>
        )}
      </main>

      {/* Quiz Score Breakdown Modal */}
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

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Learn From Your Notes MVP — VERSATHON 2.0 E2</span>
          <span>Automatic Multi-Page PDF Active Learning Pipeline</span>
        </div>
      </footer>
    </div>
  );
}
