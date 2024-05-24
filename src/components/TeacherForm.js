import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';

const TeacherForm = ({ onClose, selectedTeacher }) => {
  const { institutions } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [carne, setCarne] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [institucion, setInstitucion] = useState('');

  useEffect(() => {
    if (selectedTeacher) {
      setNombre(selectedTeacher.nombre);
      setCarne(selectedTeacher.carne);
      setContraseña(selectedTeacher.contraseña);
      setInstitucion(selectedTeacher.institucion.id);
    }
  }, [selectedTeacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const institucionRef = doc(db, 'Instituciones', institucion);

    if (selectedTeacher) {
      // Edit existing teacher
      try {
        await updateDoc(doc(db, 'Usuarios', selectedTeacher.id), {
          nombre,
          carne,
          contraseña,
          institucion: institucionRef,
        });
        alert('Profesor actualizado exitosamente');
        onClose();
      } catch (error) {
        alert('Error al actualizar el profesor: ' + error.message);
      }
    } else {
      // Add new teacher
      try {
        await addDoc(collection(db, 'Usuarios'), {
          nombre,
          carne,
          contraseña,
          rol: 'docente',
          institucion: institucionRef,
        });
        alert('Profesor registrado exitosamente');
        onClose();
      } catch (error) {
        alert('Error registrando profesor: ' + error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {selectedTeacher ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del Profesor"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            value={carne}
            onChange={(e) => setCarne(e.target.value)}
            placeholder="Carné del Profesor"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            placeholder="Contraseña del Profesor"
            className="border p-2 mb-2 w-full"
          />
          <select
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="" disabled>Seleccionar Institución</option>
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.nombre}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
          >
            {selectedTeacher ? 'Actualizar' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;