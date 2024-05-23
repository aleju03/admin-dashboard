// src/components/sections/DashboardStats.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AcademicCapIcon, UserGroupIcon, UsersIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const DashboardStats = ({ onSectionChange }) => {
  const [numInstituciones, setNumInstituciones] = useState(0);
  const [numDocentes, setNumDocentes] = useState(0);
  const [numEncargados, setNumEncargados] = useState(0);
  const [numGrupos, setNumGrupos] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const institucionesSnapshot = await getDocs(collection(db, 'Instituciones'));
      const validInstituciones = institucionesSnapshot.docs.filter(doc => doc.data().nombre); // Filtra solo documentos con nombre válido
      setNumInstituciones(validInstituciones.length);

      const usuariosSnapshot = await getDocs(collection(db, 'Usuarios'));
      const docentes = usuariosSnapshot.docs.filter(doc => doc.data().rol === 'docente' && doc.data().nombre); // Filtra solo documentos con rol docente y nombre válido
      const encargados = usuariosSnapshot.docs.filter(doc => doc.data().rol === 'encargado' && doc.data().nombre); // Filtra solo documentos con rol encargado y nombre válido
      setNumDocentes(docentes.length);
      setNumEncargados(encargados.length);

      const gruposSnapshot = await getDocs(collection(db, 'Grupos'));
      const validGrupos = gruposSnapshot.docs.filter(doc => doc.data().nombre); // Filtra solo documentos con nombre válido
      setNumGrupos(validGrupos.length);
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-8">Estadísticas del Sistema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 cursor-pointer"
            onClick={() => onSectionChange('institutions')}
          >
            <div className="flex items-center justify-center">
              <BuildingOfficeIcon className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mt-4">Instituciones</h3>
            <p className="text-4xl mt-2 text-blue-500">{numInstituciones}</p>
          </div>
          <div
            className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 cursor-pointer"
            onClick={() => onSectionChange('teachers')}
          >
            <div className="flex items-center justify-center">
              <AcademicCapIcon className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mt-4">Docentes</h3>
            <p className="text-4xl mt-2 text-green-500">{numDocentes}</p>
          </div>
          <div
            className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 cursor-pointer"
            onClick={() => onSectionChange('studentGuardians')}
          >
            <div className="flex items-center justify-center">
              <UsersIcon className="h-12 w-12 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mt-4">Encargados</h3>
            <p className="text-4xl mt-2 text-yellow-500">{numEncargados}</p>
          </div>
          <div
            className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 cursor-pointer"
            onClick={() => onSectionChange('groups')}
          >
            <div className="flex items-center justify-center">
              <UserGroupIcon className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mt-4">Grupos</h3>
            <p className="text-4xl mt-2 text-purple-500">{numGrupos}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;