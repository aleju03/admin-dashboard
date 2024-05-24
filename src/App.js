// src/App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSectionClick={handleSectionClick} />
      <div className="flex-1 ml-64">
        <MainContent activeSection={activeSection} onSectionChange={handleSectionClick} />
      </div>
    </div>
  );
};

export default App;