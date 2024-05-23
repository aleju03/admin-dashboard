// src/components/sections/InstitutionSection.js
import React, { useState, useEffect } from 'react';
import InstitutionForm from '../InstitutionForm';
import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const InstitutionSection = () => {
  const [showInstitutionForm, setShowInstitutionForm] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    const institucionesSnapshot = await getDocs(collection(db, 'Instituciones'));
    const institucionesData = institucionesSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((institucion) => institucion.nombre);
    setInstitutions(institucionesData);
  };

  const handleCloseInstitutionForm = () => {
    setShowInstitutionForm(false);
    setSelectedInstitution(null);
    fetchInstitutions();
  };

  const handleEditInstitution = (institution) => {
    setSelectedInstitution(institution);
    setShowInstitutionForm(true);
  };

  const handleDeleteInstitution = async (institutionId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta institución?')) {
      await deleteDoc(doc(db, 'Instituciones', institutionId));
      alert('Institución eliminada exitosamente');
      fetchInstitutions();
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
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left" style={{ width: '20%' }}>ID</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left" style={{ width: '20%' }}>Nombre</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left" style={{ width: '20%' }}>Dirección</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left" style={{ width: '20%' }}>Teléfono</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left" style={{ width: '20%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {institutions.map((institution) => (
              <tr key={institution.id}>
                <td className="py-3 px-4" style={{ width: '20%' }}>{institution.id}</td>
                <td className="py-3 px-4" style={{ width: '20%' }}>{institution.nombre}</td>
                <td className="py-3 px-4" style={{ width: '20%' }}>{institution.direccion}</td>
                <td className="py-3 px-4" style={{ width: '20%' }}>{institution.telefono}</td>
                <td className="py-3 px-4" style={{ width: '20%' }}>
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