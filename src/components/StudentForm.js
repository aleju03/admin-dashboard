// src/components/StudentForm.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc } from 'firebase/firestore';

const StudentForm = ({ onClose, selectedGroup, selectedStudent }) => {
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [encargados, setEncargados] = useState([]);
  const [listaEncargados, setListaEncargados] = useState([]);

  useEffect(() => {
    const fetchEncargados = async () => {
      const encargadosSnapshot = await getDocs(collection(db, 'Usuarios'));
      const encargadosData = encargadosSnapshot.docs
        .filter((doc) => doc.data().rol === 'encargado')
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setListaEncargados(encargadosData);
    };

    fetchEncargados();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      setNombreEstudiante(selectedStudent.nombre_estudiante);
      setEncargados(selectedStudent.encargados.map((encargado) => encargado.id));
    } else {
      setNombreEstudiante('');
      setEncargados([]);
    }
  }, [selectedStudent]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const encargadosRefs = encargados.map((encargadoId) => doc(db, 'Usuarios', encargadoId));

    const estudianteActualizado = {
      nombre_estudiante: nombreEstudiante,
      encargados: encargadosRefs,
    };

    onClose(estudianteActualizado);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
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
            multiple
            value={encargados}
            onChange={(e) =>
              setEncargados(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="border p-2 mb-2 w-full"
          >
            {listaEncargados.map((encargado) => (
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
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;