import React, { useState } from 'react';
import StudentAssistantButton from './StudentAssistantButton';
import StudentAssistantPanel from './StudentAssistantPanel';

export default function StudentAssistant({ 
  activeTab, 
  setActiveTab, 
  user, 
  documents, 
  topics, 
  flashcards, 
  questions, 
  progress, 
  weakTopics 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleStartTour = () => {
    setIsOpen(true);
    setIsTourActive(true);
    setTourIndex(0);
  };

  return (
    <>
      <StudentAssistantButton 
        isOpen={isOpen}
        onClick={handleToggle}
        onStartTour={handleStartTour}
      />

      <StudentAssistantPanel 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        documents={documents}
        topics={topics}
        flashcards={flashcards}
        questions={questions}
        progress={progress}
        weakTopics={weakTopics}
        tourIndex={tourIndex}
        setTourIndex={setTourIndex}
        isTourActive={isTourActive}
        setIsTourActive={setIsTourActive}
      />
    </>
  );
}
