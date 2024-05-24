import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';

const GroupForm = ({ onClose, selectedGroup, fetchGroups }) => {
  const { institutions, teachers, studentGuardians } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [docente, setDocente] = useState('');
  const [encargados, setEncargados] = useState([]);

  useEffect(() => {
    if (selectedGroup) {
      setNombre(selectedGroup.nombre);
      setInstitucion(selectedGroup.institucion.id);
      setDocente(selectedGroup.docente.id);
      setEncargados(selectedGroup.encargados.map((encargado) => encargado.id));
    } else {
      setNombre('');
      setInstitucion('');
      setDocente('');
      setEncargados([]);
    }
  }, [selectedGroup]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const institucionRef = doc(db, 'Instituciones', institucion);
    const docenteRef = doc(db, 'Usuarios', docente);
    const encargadosRefs = encargados.map((encargadoId) => doc(db, 'Usuarios', encargadoId));

    if (selectedGroup) {
      // Editar grupo existente
      try {
        await updateDoc(doc(db, 'Grupos', selectedGroup.id), {
          nombre,
          institucion: institucionRef,
          docente: docenteRef,
          encargados: encargadosRefs,
        });
        alert('Grupo actualizado exitosamente');
        onClose();
        fetchGroups();
      } catch (error) {
        alert('Error al actualizar el grupo: ' + error.message);
      }
    } else {
      // Agregar nuevo grupo
      try {
        await addDoc(collection(db, 'Grupos'), {
          nombre,
          institucion: institucionRef,
          docente: docenteRef,
          encargados: encargadosRefs,
        });
        alert('Grupo registrado exitosamente');
        onClose();
        fetchGroups();
      } catch (error) {
        alert('Error al registrar el grupo: ' + error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {selectedGroup ? 'Editar Grupo' : 'Agregar Nuevo Grupo'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del Grupo"
            className="border p-2 mb-2 w-full"
            required
          />
          <select
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            className="border p-2 mb-2 w-full"
            required
          >
            <option value="" disabled>Seleccionar Institución</option>
            {institutions.map((institucion) => (
              <option key={institucion.id} value={institucion.id}>
                {institucion.nombre}
              </option>
            ))}
          </select>
          <select
            value={docente}
            onChange={(e) => setDocente(e.target.value)}
            className="border p-2 mb-2 w-full"
            required
          >
            <option value="" disabled>Seleccionar Docente</option>
            {teachers.map((docente) => (
              <option key={docente.id} value={docente.id}>
                {docente.nombre}
              </option>
            ))}
          </select>
          <div className="mb-4">
            <label htmlFor="encargados" className="block mb-1 font-bold">Encargados:</label>
            <select
              id="encargados"
              multiple
              value={encargados}
              onChange={(e) => setEncargados(Array.from(e.target.selectedOptions, option => option.value))}
              className="border p-2 w-full"
            >
              {studentGuardians.map((encargado) => (
                <option key={encargado.id} value={encargado.id}>
                  {encargado.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
          >
            {selectedGroup ? 'Actualizar' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupForm;