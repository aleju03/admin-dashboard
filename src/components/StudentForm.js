import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { doc } from 'firebase/firestore';
import { db } from '../firebase';

const StudentForm = ({ onClose, selectedGroup, selectedStudent }) => {
  const { studentGuardians } = useContext(DataContext);
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [encargado, setEncargado] = useState('');

  useEffect(() => {
    if (selectedStudent) {
      setNombreEstudiante(selectedStudent.nombre_estudiante);
      setEncargado(selectedStudent.encargado.id);
    } else {
      setNombreEstudiante('');
      setEncargado('');
    }
  }, [selectedStudent]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const encargadoRef = doc(db, 'Usuarios', encargado);

    const estudianteActualizado = {
      nombre_estudiante: nombreEstudiante,
      encargado: encargadoRef,
    };

    onClose(estudianteActualizado);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {selectedStudent ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nombreEstudiante}
            onChange={(e) => setNombreEstudiante(e.target.value)}
            placeholder="Nombre del Estudiante"
            className="border p-2 mb-2 w-full"
            required
          />
          <select
            value={encargado}
            onChange={(e) => setEncargado(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="">Seleccionar Encargado</option>
            {studentGuardians.map((encargado) => (
              <option key={encargado.id} value={encargado.id}>
                {encargado.nombre}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
          >
            {selectedStudent ? 'Actualizar' : 'Agregar'}
          </button>
          <button
            type="button"
            onClick={() => onClose(null)}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;