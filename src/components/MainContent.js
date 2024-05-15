import React from 'react';

const MainContent = ({ activeSection }) => {
  return (
    <div className="flex-1 p-8">
      {/* Sección de Instituciones */}
      {activeSection === 'institutions' && (
        <div id="institutions">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Instituciones</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Agregar Nueva Institución
            </button>
          </div>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Nombre</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Ubicación</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">Institución A</td>
                <td className="py-3 px-4">Ciudad A</td>
                <td className="py-3 px-4">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded action-button">
                    Editar
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded action-button">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Sección de Grupos */}
      {activeSection === 'groups' && (
        <div id="groups">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Grupos</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Agregar Nuevo Grupo
            </button>
          </div>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Nombre</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Institución</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">Grupo A</td>
                <td className="py-3 px-4">Institución A</td>
                <td className="py-3 px-4">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded action-button">
                    Editar
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded action-button">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Sección de Estudiantes */}
      {activeSection === 'students' && (
        <div id="students">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Estudiantes</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Agregar Nuevo Estudiante
            </button>
          </div>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Nombre</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Grupo</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">Estudiante A</td>
                <td className="py-3 px-4">Grupo A</td>
                <td className="py-3 px-4">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded action-button">
                    Editar
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded action-button">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Sección de Profesores */}
      {activeSection === 'teachers' && (
        <div id="teachers">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profesores</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Agregar Nuevo Profesor
            </button>
          </div>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Nombre</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Institución</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Grupo</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">Profesor A</td>
                <td className="py-3 px-4">Institución A</td>
                <td className="py-3 px-4">Grupo A</td>
                <td className="py-3 px-4">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded action-button">
                    Editar
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded action-button">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MainContent;