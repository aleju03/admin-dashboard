// src/components/TeacherForm.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { addDoc, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const TeacherForm = ({ onClose, selectedTeacher }) => {
  const [nombre, setNombre] = useState('');
  const [carne, setCarne] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [instituciones, setInstituciones] = useState([]);

  useEffect(() => {
    const fetchInstituciones = async () => {
      const institucionesSnapshot = await getDocs(collection(db, 'Instituciones'));
      const institucionesData = institucionesSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((institucion) => institucion.nombre); // Filtrar instituciones vacías
      setInstituciones(institucionesData);
    };

    fetchInstituciones();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      setNombre(selectedTeacher.nombre);
      setCarne(selectedTeacher.carne);
      setContraseña(selectedTeacher.contraseña);
      // Asegúrate de establecer el ID de la institución, no el nombre
      setInstitucion(selectedTeacher.institucion.id);
    }
  }, [selectedTeacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const institucionRef = doc(db, 'Instituciones', institucion);

    if (selectedTeacher) {
      // Editar profesor existente
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
      // Agregar nuevo profesor
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
            <option value="">Seleccionar Institución</option>
            {instituciones.map((inst) => (
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
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;