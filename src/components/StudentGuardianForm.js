// src/components/StudentGuardianForm.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { addDoc, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const StudentGuardianForm = ({ onClose, selectedStudentGuardian }) => {
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
    if (selectedStudentGuardian) {
      setNombre(selectedStudentGuardian.nombre);
      setCarne(selectedStudentGuardian.carne);
      setContraseña(selectedStudentGuardian.contraseña);
      setInstitucion(selectedStudentGuardian.institucion.id);
    }
  }, [selectedStudentGuardian]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const institucionRef = doc(db, 'Instituciones', institucion);

    if (selectedStudentGuardian) {
      // Editar encargado existente
      try {
        await updateDoc(doc(db, 'Usuarios', selectedStudentGuardian.id), {
          nombre,
          carne,
          contraseña,
          institucion: institucionRef,
        });
        alert('Encargado actualizado exitosamente');
        onClose();
      } catch (error) {
        alert('Error al actualizar el encargado: ' + error.message);
      }
    } else {
      // Agregar nuevo encargado
      try {
        await addDoc(collection(db, 'Usuarios'), {
          nombre,
          carne,
          contraseña,
          rol: 'encargado',
          institucion: institucionRef,
        });
        alert('Encargado registrado exitosamente');
        onClose();
      } catch (error) {
        alert('Error registrando encargado: ' + error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {selectedStudentGuardian ? 'Editar Encargado' : 'Agregar Nuevo Encargado'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del Encargado"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            value={carne}
            onChange={(e) => setCarne(e.target.value)}
            placeholder="Carné del Encargado"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            placeholder="Contraseña del Encargado"
            className="border p-2 mb-2 w-full"
          />
          <select
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="" disabled>Seleccionar Institución</option>
            {instituciones.map((institucion) => (
              <option key={institucion.id} value={institucion.id}>
                {institucion.nombre}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
          >
            {selectedStudentGuardian ? 'Actualizar' : 'Registrar'}
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