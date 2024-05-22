// src/components/TeacherForm.js
import React, { useState } from 'react';
import { db } from '../firebase';

const TeacherForm = ({ onClose }) => {
  const [teacherName, setTeacherName] = useState('');
  const [teacherInstitution, setTeacherInstitution] = useState('');

  const handleAddTeacher = async () => {
    try {
      await db.collection('teachers').add({
        name: teacherName,
        institutionId: teacherInstitution,
      });
      alert('Profesor registrado exitosamente');
      setTeacherName('');
      setTeacherInstitution('');
      onClose();
    } catch (error) {
      alert('Error registrando profesor: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Profesor</h2>
        <form>
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
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
          >
            Registrar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;