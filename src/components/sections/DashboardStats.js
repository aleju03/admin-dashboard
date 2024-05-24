// src/components/sections/DashboardStats.js
import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { AcademicCapIcon, UserGroupIcon, UsersIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { BarLoader } from 'react-spinners';

const DashboardStats = ({ onSectionChange }) => {
  const { institutions, teachers, studentGuardians, groups, loading } = useContext(DataContext);

  return (
    <div className="flex justify-center items-center h-full">
      {loading ? (
        <div className="animate-fade-in">
          <BarLoader color="#3B82F6" size={80} />
        </div>
      ) : (
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
              <p className="text-4xl mt-2 text-blue-500">{institutions.length}</p>
            </div>
            <div
              className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 cursor-pointer"
              onClick={() => onSectionChange('teachers')}
            >
              <div className="flex items-center justify-center">
                <AcademicCapIcon className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mt-4">Docentes</h3>
              <p className="text-4xl mt-2 text-green-500">{teachers.length}</p>
            </div>
            <div
              className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 cursor-pointer"
              onClick={() => onSectionChange('studentGuardians')}
            >
              <div className="flex items-center justify-center">
                <UsersIcon className="h-12 w-12 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mt-4">Encargados</h3>
              <p className="text-4xl mt-2 text-yellow-500">{studentGuardians.length}</p>
            </div>
            <div
              className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 cursor-pointer"
              onClick={() => onSectionChange('groups')}
            >
              <div className="flex items-center justify-center">
                <UserGroupIcon className="h-12 w-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mt-4">Grupos</h3>
              <p className="text-4xl mt-2 text-purple-500">{groups.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;