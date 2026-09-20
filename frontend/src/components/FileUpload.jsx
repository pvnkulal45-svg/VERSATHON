import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, BookOpen, Layers, HelpCircle } from 'lucide-react';
import { uploadDocument } from '../services/api';

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      validateAndSetFile(selected);
    }
  };

  const validateAndSetFile = (selected) => {
    setError(null);
    setResultData(null);
    const ext = selected.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'txt') {
      setError('Invalid file type. Only PDF (.pdf) and TXT (.txt) files are allowed.');
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF or TXT file to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultData(null);
    setStatusMessage('Extracting text across ALL pages of your document...');

    try {
      // Simulation steps for user progress feedback
      const progressTimer = setTimeout(() => {
        setStatusMessage('Cleaning whitespace & chunking large text into manageable sections...');
      }, 1500);

      const progressTimer2 = setTimeout(() => {
        setStatusMessage('Extracting key topics, flashcards, and multiple-choice questions...');
      }, 3500);

      const data = await uploadDocument(file);
      clearTimeout(progressTimer);
      clearTimeout(progressTimer2);

      setResultData(data);
      setStatusMessage('');
      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to process document.');
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight mb-2">
          Upload Study Material
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Upload your lecture notes or multi-page study PDFs (up to 20+ pages). Our system extracts all text, chunking & converting it into active-learning content.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              file
                ? 'border-blue-500/80 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-900/60'
            }`}
          >
            <input
              type="file"
              id="file-input"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30">
                <UploadCloud className="w-8 h-8" />
              </div>
              
              {file ? (
                <div className="space-y-1">
                  <span className="text-base font-semibold text-blue-300 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    {file.name}
                  </span>
                  <p className="text-xs text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to process
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-slate-200 font-medium text-base">
                    Click to upload or drag & drop study PDF / TXT
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports text-based PDFs (20+ pages supported) and plain text notes. Max 50 MB.
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-3 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Extraction Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Progress State */}
          {loading && (
            <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                <span className="font-medium text-sm sm:text-base">{statusMessage}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-blue-500/20">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

          {/* Success Response Details */}
          {resultData && (
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Document Processed Successfully!</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm pt-2">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-500/20">
                  <span className="text-slate-400 block text-xs">Pages Extracted</span>
                  <span className="font-bold text-lg text-emerald-300">{resultData.document.page_count}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-500/20">
                  <span className="text-slate-400 block text-xs">Topics Found</span>
                  <span className="font-bold text-lg text-emerald-300">{resultData.topics_count}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-500/20">
                  <span className="text-slate-400 block text-xs">Flashcards Created</span>
                  <span className="font-bold text-lg text-emerald-300">{resultData.flashcards_count}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-500/20">
                  <span className="text-slate-400 block text-xs">Quiz Questions</span>
                  <span className="font-bold text-lg text-emerald-300">{resultData.questions_count}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
              !file || loading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25 hover:shadow-blue-600/40 cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Multi-Page Document...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                <span>Process Document & Generate Materials</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
