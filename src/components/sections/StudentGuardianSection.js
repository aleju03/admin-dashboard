// src/components/sections/StudentGuardianSection.js
import React, { useContext, useState } from 'react';
import StudentGuardianForm from '../StudentGuardianForm';
import { DataContext } from '../../context/DataContext';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const StudentGuardianSection = () => {
  const { studentGuardians, fetchData } = useContext(DataContext);
  const [showStudentGuardianForm, setShowStudentGuardianForm] = useState(false);
  const [selectedStudentGuardian, setSelectedStudentGuardian] = useState(null);

  const handleCloseStudentGuardianForm = () => {
    setShowStudentGuardianForm(false);
    setSelectedStudentGuardian(null);
    fetchData();
  };

  const handleEditStudentGuardian = (studentGuardian) => {
    setSelectedStudentGuardian(studentGuardian);
    setShowStudentGuardianForm(true);
  };

  const handleDeleteStudentGuardian = async (studentGuardianId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este encargado de estudiante?')) {
      await deleteDoc(doc(db, 'Usuarios', studentGuardianId));
      alert('Encargado de estudiante eliminado exitosamente');
      fetchData();
    }
  };

  return (
    <div id="studentGuardians">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Encargados de Estudiantes</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => setShowStudentGuardianForm(true)}
        >
          Agregar
        </button>
      </div>
      {showStudentGuardianForm && (
        <StudentGuardianForm
          onClose={handleCloseStudentGuardianForm}
          selectedStudentGuardian={selectedStudentGuardian}
        />
      )}
      {studentGuardians.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Nombre</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Carné</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Institución</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {studentGuardians.map((guardian) => (
              <tr key={guardian.id}>
                <td className="py-3 px-4">{guardian.nombre}</td>
                <td className="py-3 px-4">{guardian.carne}</td>
                <td className="py-3 px-4">{guardian.institucion ? guardian.institucion.id : 'Desconocida'}</td>
                <td className="py-3 px-4">
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleEditStudentGuardian(guardian)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                    onClick={() => handleDeleteStudentGuardian(guardian.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay encargados de estudiantes registrados.</p>
      )}
    </div>
  );
};

export default StudentGuardianSection;