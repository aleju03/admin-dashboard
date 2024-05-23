// src/components/sections/InstitutionSection.js
import React, { useContext, useState } from 'react';
import InstitutionForm from '../InstitutionForm';
import { DataContext } from '../../context/DataContext';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const InstitutionSection = () => {
  const { institutions, fetchData } = useContext(DataContext);
  const [showInstitutionForm, setShowInstitutionForm] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const handleCloseInstitutionForm = () => {
    setShowInstitutionForm(false);
    setSelectedInstitution(null);
    fetchData();
  };

  const handleEditInstitution = (institution) => {
    setSelectedInstitution(institution);
    setShowInstitutionForm(true);
  };

  const handleDeleteInstitution = async (institutionId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta institución?')) {
      await deleteDoc(doc(db, 'Instituciones', institutionId));
      alert('Institución eliminada exitosamente');
      fetchData();
    }
  };

  return (
    <div id="institutions">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Instituciones</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => setShowInstitutionForm(true)}
        >
          Agregar
        </button>
      </div>
      {showInstitutionForm && (
        <InstitutionForm
          onClose={handleCloseInstitutionForm}
          selectedInstitution={selectedInstitution}
        />
      )}
      {institutions.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Nombre</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Dirección</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Teléfono</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {institutions.map((institution) => (
              <tr key={institution.id}>
                <td className="py-3 px-4">{institution.id}</td>
                <td className="py-3 px-4">{institution.nombre}</td>
                <td className="py-3 px-4">{institution.direccion}</td>
                <td className="py-3 px-4">{institution.telefono}</td>
                <td className="py-3 px-4">
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleEditInstitution(institution)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                    onClick={() => handleDeleteInstitution(institution.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay instituciones registradas.</p>
      )}
    </div>
  );
};

export default InstitutionSection;