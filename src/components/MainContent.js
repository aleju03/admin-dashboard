// src/components/MainContent.js
import React, { useState } from 'react';
import InstitutionForm from './InstitutionForm';
import TeacherForm from './TeacherForm';
import StudentGuardianForm from './StudentGuardianForm';

const MainContent = ({ activeSection }) => {
  const [showInstitutionForm, setShowInstitutionForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showStudentGuardianForm, setShowStudentGuardianForm] = useState(false);

  const handleCloseInstitutionForm = () => {
    setShowInstitutionForm(false);
  };

  const handleCloseTeacherForm = () => {
    setShowTeacherForm(false);
  };

  const handleCloseStudentGuardianForm = () => {
    setShowStudentGuardianForm(false);
  };

  return (
    <div className="flex-1 p-8">
      {activeSection === 'institutions' && (
        <div id="institutions">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Instituciones</h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => setShowInstitutionForm(true)}
            >
              Agregar Nueva Institución
            </button>
          </div>
          {showInstitutionForm && (
            <InstitutionForm onClose={handleCloseInstitutionForm} />
          )}
        </div>
      )}

      {activeSection === 'teachers' && (
        <div id="teachers">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profesores</h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => setShowTeacherForm(true)}
            >
              Agregar Nuevo Profesor
            </button>
          </div>
          {showTeacherForm && <TeacherForm onClose={handleCloseTeacherForm} />}
        </div>
      )}

      {activeSection === 'studentGuardians' && (
        <div id="studentGuardians">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Encargados de Estudiantes</h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => setShowStudentGuardianForm(true)}
            >
              Agregar Nuevo Encargado de Estudiante
            </button>
          </div>
          {showStudentGuardianForm && (
            <StudentGuardianForm onClose={handleCloseStudentGuardianForm} />
          )}
        </div>
      )}
    </div>
  );
};

export default MainContent;