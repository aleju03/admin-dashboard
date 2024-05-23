// src/components/InstitutionForm.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

const InstitutionForm = ({ onClose, selectedInstitution }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if (selectedInstitution) {
      setNombre(selectedInstitution.nombre);
      setDireccion(selectedInstitution.direccion);
      setTelefono(selectedInstitution.telefono);
    }
  }, [selectedInstitution]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedInstitution) {
      // Editar institución existente
      try {
        await updateDoc(doc(db, 'Instituciones', selectedInstitution.id), {
          nombre,
          direccion,
          telefono,
        });
        alert('Institución actualizada exitosamente');
        onClose();
      } catch (error) {
        alert('Error al actualizar la institución: ' + error.message);
      }
    } else {
      // Agregar nueva institución
      try {
        await addDoc(collection(db, 'Instituciones'), {
          nombre,
          direccion,
          telefono,
        });
        alert('Institución registrada exitosamente');
        onClose();
      } catch (error) {
        alert('Error al registrar la institución: ' + error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {selectedInstitution ? 'Editar Institución' : 'Agregar Nueva Institución'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la Institución"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Dirección de la Institución"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Teléfono de la Institución"
            className="border p-2 mb-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
          >
            {selectedInstitution ? 'Actualizar' : 'Registrar'}
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

export default InstitutionForm;