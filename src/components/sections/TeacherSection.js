// src/components/sections/TeacherSection.js
import React, { useState, useEffect } from 'react';
import TeacherForm from '../TeacherForm';
import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const TeacherSection = () => {
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const usuariosSnapshot = await getDocs(collection(db, 'Usuarios'));
    const docentesData = usuariosSnapshot.docs
      .filter((doc) => doc.data().rol === 'docente')
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    setTeachers(docentesData);
  };

  const handleCloseTeacherForm = () => {
    setShowTeacherForm(false);
    setSelectedTeacher(null);
    fetchTeachers();
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowTeacherForm(true);
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      await deleteDoc(doc(db, 'Usuarios', teacherId));
      alert('Profesor eliminado exitosamente');
      fetchTeachers();
    }
  };

  return (
    <div id="teachers">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Profesores</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => setShowTeacherForm(true)}
        >
          Agregar
        </button>
      </div>
      {showTeacherForm && (
        <TeacherForm
          onClose={handleCloseTeacherForm}
          selectedTeacher={selectedTeacher}
        />
      )}
      {teachers.length > 0 ? (
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
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="py-3 px-4">{teacher.nombre}</td>
                <td className="py-3 px-4">{teacher.carne}</td>
                <td className="py-3 px-4">{teacher.institucion ? teacher.institucion.id : 'Desconocida'}</td>
                <td className="py-3 px-4">
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleEditTeacher(teacher)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay profesores registrados.</p>
      )}
    </div>
  );
};

export default TeacherSection;