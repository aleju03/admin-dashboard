import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { db } from './firebase'; // Importar la configuración de Firebase

const App = () => {
  const [activeSection, setActiveSection] = useState('institutions');

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSectionClick={handleSectionClick} />
      <MainContent activeSection={activeSection} />
    </div>
  );
};

export default App;
