import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';

const StudentGuardianForm = ({ onClose, selectedStudentGuardian, fetchStudentGuardians }) => {
  const { institutions } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [carne, setCarne] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (selectedStudentGuardian) {
      setNombre(selectedStudentGuardian.nombre);
      setCarne(selectedStudentGuardian.carne);
      setContraseña(selectedStudentGuardian.contraseña);
      setInstitucion(selectedStudentGuardian.institucion.id);
    }
  }, [selectedStudentGuardian]);

  useEffect(() => {
    setIsFormValid(nombre !== '' && carne !== '' && contraseña !== '' && institucion !== '');
  }, [nombre, carne, contraseña, institucion]);

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
        onClose(true); // Indica que se han realizado cambios
        fetchStudentGuardians();
      } catch (error) {
        alert('Error al actualizar el encargado: ' + error.message);
      }
    } else {
      // Verificar si ya existe un usuario con el mismo carné
      const usuariosSnapshot = await getDocs(
        query(collection(db, 'Usuarios'), where('carne', '==', carne))
      );

      if (!usuariosSnapshot.empty) {
        alert('Ya existe un usuario con el mismo carné. Por favor, ingresa un carné único.');
        return;
      }

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
        onClose(true); // Indica que se han realizado cambios
        fetchStudentGuardians();
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
            required
          />
          <input
            type="text"
            value={carne}
            onChange={(e) => setCarne(e.target.value)}
            placeholder="Carné del Encargado"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            placeholder="Contraseña del Encargado"
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
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isFormValid}
          >
            {selectedStudentGuardian ? 'Actualizar' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={() => onClose(false)} // Indica que no se han realizado cambios
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentGuardianForm;