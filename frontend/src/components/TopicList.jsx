import React, { useState } from 'react';
import { BookOpen, Search, Layers, FileText } from 'lucide-react';

export default function TopicList({ topics }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = (topics || []).filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-500" />
            Extracted Topics
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Meaningful concepts and main themes extracted from your uploaded study material.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic, index) => (
            <div 
              key={topic.id || index}
              className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800/90 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-bold text-lg text-white leading-snug">
                    {topic.title}
                  </h3>
                  <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-medium">
                    Topic #{index + 1}
                  </span>
                </div>
                
                <p className="text-sm text-slate-300 leading-relaxed">
                  {topic.description || "No specific description available for this topic."}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                  <Layers className="w-3.5 h-3.5" />
                  Core Subject Unit
                </span>
                <span>Generated from Notes</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No Topics Found</h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {searchTerm ? `No topics match "${searchTerm}".` : 'Upload a document to view extracted topics.'}
          </p>
        </div>
      )}

    </div>
  );
}
