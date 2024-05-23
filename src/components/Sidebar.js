// src/components/Sidebar.js
import React from 'react';

const Sidebar = ({ onSectionClick }) => {
  return (
    <div className="bg-blue-900 text-white w-1/5 p-6 flex flex-col">
      <h1
        className="text-2xl font-bold mb-8 cursor-pointer"
        onClick={() => onSectionClick('dashboard')}
      >
        Panel de Administración
      </h1>
      <nav className="flex-1">
        <ul>
          <li className="mb-4">
            <button
              id="institutions-link"
              className="w-full text-left block py-2 px-4 hover:bg-blue-800 rounded"
              onClick={() => onSectionClick('institutions')}
            >
              Instituciones
            </button>
          </li>
          <li className="mb-4">
            <button
              id="teachers-link"
              className="w-full text-left block py-2 px-4 hover:bg-blue-800 rounded"
              onClick={() => onSectionClick('teachers')}
            >
              Profesores
            </button>
          </li>
          <li className="mb-4">
            <button
              id="studentGuardians-link"
              className="w-full text-left block py-2 px-4 hover:bg-blue-800 rounded"
              onClick={() => onSectionClick('studentGuardians')}
            >
              Encargados de Estudiantes
            </button>
          </li>
          <li className="mb-4">
            <button
              id="groups-link"
              className="w-full text-left block py-2 px-4 hover:bg-blue-800 rounded"
              onClick={() => onSectionClick('groups')}
            >
              Grupos
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;