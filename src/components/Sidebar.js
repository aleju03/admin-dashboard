// src/components/Sidebar.js
import React from 'react';

const Sidebar = ({ onSectionClick }) => {
  const sections = [
    { id: 'institutions', name: 'Instituciones' },
    { id: 'teachers', name: 'Profesores' },
    { id: 'studentGuardians', name: 'Encargados de Estudiantes' },
    { id: 'groups', name: 'Grupos' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white w-64 p-6 flex flex-col h-screen fixed top-0 left-0">
      <h1
        className="text-3xl font-bold mb-10 cursor-pointer hover:text-blue-300 transition duration-300"
        onClick={() => onSectionClick('dashboard')}
      >
        Panel de Administración
      </h1>
      <nav>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className="flex items-center w-full text-left p-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                onClick={() => onSectionClick(section.id)}
              >
                <span className="ml-3 text-lg">{section.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;