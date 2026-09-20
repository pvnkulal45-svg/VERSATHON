import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, Layers, Sparkles, Filter } from 'lucide-react';
import TopicDetail from './TopicDetail';

export default function TopicList({ topics, questionsCount }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [importanceFilter, setImportanceFilter] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState(null);

  // If a topic is selected, render full explanation view
  if (selectedTopic) {
    return (
      <TopicDetail 
        topic={selectedTopic} 
        onBack={() => setSelectedTopic(null)} 
      />
    );
  }

  const filteredTopics = (topics || []).filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.summary && t.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesImportance = importanceFilter === 'ALL' || t.importance === importanceFilter;
    return matchesSearch && matchesImportance;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-500" />
            Important Topics ({topics?.length || 0})
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Click any topic card to view simple explanations, detailed notes, practical examples, and exam tips.
          </p>
        </div>

        {/* Search & Importance Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
            {['ALL', 'High', 'Medium'].map((imp) => (
              <button
                key={imp}
                onClick={() => setImportanceFilter(imp)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  importanceFilter === imp
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {imp === 'ALL' ? 'All Topics' : `${imp} Priority`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic, index) => (
            <div 
              key={topic.id || index}
              onClick={() => setSelectedTopic(topic)}
              className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800/90 flex flex-col justify-between cursor-pointer group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {topic.title}
                  </h3>
                  <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    topic.importance === 'High'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : topic.importance === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {topic.importance || 'Medium'} Priority
                  </span>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {topic.summary || topic.description || "Click to view full breakdown, simple explanations, and exam tips."}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Verified Study Topic
                </span>

                <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No Topics Found</h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {searchTerm ? `No topics match "${searchTerm}".` : 'Upload notes to generate important topics.'}
          </p>
        </div>
      )}

    </div>
  );
}
