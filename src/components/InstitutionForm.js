// src/components/InstitutionForm.js
import React, { useState } from 'react';
import { db } from '../firebase';

const InstitutionForm = ({ onClose }) => {
  const [institutionName, setInstitutionName] = useState('');
  const [institutionLocation, setInstitutionLocation] = useState('');

  const handleAddInstitution = async () => {
    try {
      await db.collection('institutions').add({
        name: institutionName,
        location: institutionLocation,
      });
      alert('Institución registrada exitosamente');
      setInstitutionName('');
      setInstitutionLocation('');
      onClose();
    } catch (error) {
      alert('Error registrando institución: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Agregar Nueva Institución</h2>
        <form>
          <input
            type="text"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            placeholder="Nombre de la Institución"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            value={institutionLocation}
            onChange={(e) => setInstitutionLocation(e.target.value)}
            placeholder="Ubicación de la Institución"
            className="border p-2 mb-2 w-full"
          />
          <button
            type="button"
            onClick={handleAddInstitution}
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

export default InstitutionForm;