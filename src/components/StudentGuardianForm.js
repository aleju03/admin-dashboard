// src/components/StudentGuardianForm.js
import React, { useState } from 'react';
import { db } from '../firebase';

const StudentGuardianForm = ({ onClose }) => {
  const [guardianName, setGuardianName] = useState('');
  const [guardianStudent, setGuardianStudent] = useState('');

  const handleAddGuardian = async () => {
    try {
      await db.collection('guardians').add({
        name: guardianName,
        studentId: guardianStudent,
      });
      alert('Encargado registrado exitosamente');
      setGuardianName('');
      setGuardianStudent('');
      onClose();
    } catch (error) {
      alert('Error registrando encargado: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Encargado</h2>
        <form>
          <input
            type="text"
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
            placeholder="Nombre del Encargado"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            value={guardianStudent}
            onChange={(e) => setGuardianStudent(e.target.value)}
            placeholder="ID del Estudiante"
            className="border p-2 mb-2 w-full"
          />
          <button
            type="button"
            onClick={handleAddGuardian}
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

export default StudentGuardianForm;