import React, { useState } from 'react';
import { db } from '../firebase';

const MainContent = ({ activeSection }) => {
  const [institutionName, setInstitutionName] = useState('');
  const [institutionLocation, setInstitutionLocation] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherInstitution, setTeacherInstitution] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentGuardian, setStudentGuardian] = useState('');

  const handleAddInstitution = async () => {
    try {
      await db.collection('institutions').add({
        name: institutionName,
        location: institutionLocation,
      });
      alert('Institución registrada exitosamente');
      setInstitutionName('');
      setInstitutionLocation('');
    } catch (error) {
      alert('Error registrando institución: ' + error.message);
    }
  };

  const handleAddTeacher = async () => {
    try {
      await db.collection('teachers').add({
        name: teacherName,
        institutionId: teacherInstitution,
      });
      alert('Profesor registrado exitosamente');
      setTeacherName('');
      setTeacherInstitution('');
    } catch (error) {
      alert('Error registrando profesor: ' + error.message);
    }
  };

  const handleAddStudentGuardian = async () => {
    try {
      await db.collection('studentGuardians').add({
        studentId: studentName,
        guardianName: studentGuardian,
      });
      alert('Encargado de estudiante registrado exitosamente');
      setStudentName('');
      setStudentGuardian('');
    } catch (error) {
      alert('Error registrando encargado de estudiante: ' + error.message);
    }
  };

  return (
    <div className="flex-1 p-8">
      {activeSection === 'institutions' && (
        <div id="institutions">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Instituciones</h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => document.getElementById('addInstitutionForm').style.display = 'block'}
            >
              Agregar Nueva Institución
            </button>
          </div>
          <form id="addInstitutionForm" style={{ display: 'none' }} className="mb-6">
            <input
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder="Nombre de la Institución"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={institutionLocation}
              onChange={(e) => setInstitutionLocation(e.target.value)}
              placeholder="Ubicación de la Institución"
              className="border p-2 mb-2 w-full"
            />
            <button
              type="button"
              onClick={handleAddInstitution}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Registrar Institución
            </button>
          </form>
        </div>
      )}

      {activeSection === 'teachers' && (
        <div id="teachers">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profesores</h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => document.getElementById('addTeacherForm').style.display = 'block'}
            >
              Agregar Nuevo Profesor
            </button>
          </div>
          <form id="addTeacherForm" style={{ display: 'none' }} className="mb-6">
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Nombre del Profesor"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={teacherInstitution}
              onChange={(e) => setTeacherInstitution(e.target.value)}
              placeholder="ID de la Institución"
              className="border p-2 mb-2 w-full"
            />
            <button
              type="button"
              onClick={handleAddTeacher}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Registrar Profesor
            </button> 
          </form>
        </div>
      )}

      {activeSection === 'studentGuardians' && (
        <div id="studentGuardians">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Encargados de Estudiantes</h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => document.getElementById('addStudentGuardianForm').style.display = 'block'}
            >
              Agregar Nuevo Encargado de Estudiante
            </button>
          </div>
          <form id="addStudentGuardianForm" style={{ display: 'none' }} className="mb-6">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="ID del Estudiante"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={studentGuardian}
              onChange={(e) => setStudentGuardian(e.target.value)}
              placeholder="Nombre del Encargado"
              className="border p-2 mb-2 w-full"
            />
            <button
              type="button"
              onClick={handleAddStudentGuardian}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Registrar Encargado de Estudiante
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MainContent;
