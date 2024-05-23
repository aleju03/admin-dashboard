// src/components/sections/GroupSection.js
import React, { useState, useEffect } from 'react';
import GroupForm from '../GroupForm';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';

const GroupSection = () => {
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const gruposSnapshot = await getDocs(collection(db, 'Grupos'));
    const gruposData = await Promise.all(
      gruposSnapshot.docs
        .filter((doc) => doc.data().nombre) // Filtrar grupos vacíos
        .map(async (doc) => {
          const grupoData = doc.data();
          const institucionRef = grupoData.institucion;
          const docenteRef = grupoData.docente;
          const institucion = institucionRef ? await getDoc(institucionRef) : null;
          const docente = docenteRef ? await getDoc(docenteRef) : null;
          return {
            id: doc.id,
            ...grupoData,
            institucion: institucion && institucion.data() ? institucion.data().nombre : 'Desconocida',
            docente: docente && docente.data() ? docente.data().nombre : 'Desconocido',
          };
        })
    );
    setGroups(gruposData);
  };

  const handleCloseGroupForm = () => {
    setShowGroupForm(false);
    setSelectedGroup(null);
    fetchGroups();
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setShowGroupForm(true);
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
      await deleteDoc(doc(db, 'Grupos', groupId));
      alert('Grupo eliminado exitosamente');
      fetchGroups();
    }
  };

  return (
    <div id="groups">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Grupos</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => setShowGroupForm(true)}
        >
          Agregar
        </button>
      </div>
      {showGroupForm && (
        <GroupForm onClose={handleCloseGroupForm} selectedGroup={selectedGroup} />
      )}
      {groups.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Nombre
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Institución
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Docente
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="py-3 px-4">{group.nombre}</td>
                <td className="py-3 px-4">{group.institucion}</td>
                <td className="py-3 px-4">{group.docente}</td>
                <td className="py-3 px-4">
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleEditGroup(group)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                    onClick={() => handleDeleteGroup(group.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay grupos registrados.</p>
      )}
    </div>
  );
};

export default GroupSection;