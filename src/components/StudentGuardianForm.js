import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';
import { SparklesIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const StudentGuardianForm = ({ onClose, selectedStudentGuardian, fetchStudentGuardians }) => {
  const { institutions } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [carne, setCarne] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (selectedStudentGuardian) {
      setNombre(selectedStudentGuardian.nombre);
      setCarne(selectedStudentGuardian.carne);
      setContrasena(selectedStudentGuardian.contrasena);
      setInstitucion(selectedStudentGuardian.institucion.id);
      setEstudiantes(selectedStudentGuardian.estudiantes || []);
    }
  }, [selectedStudentGuardian]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const institucionRef = doc(db, 'Instituciones', institucion);

    // Check if carne already exists
    const carneQuery = query(collection(db, 'Usuarios'), where('carne', '==', carne));
    const carneSnapshot = await getDocs(carneQuery);

    if (!carneSnapshot.empty && (!selectedStudentGuardian || carneSnapshot.docs[0].id !== selectedStudentGuardian.id)) {
      alert('El carné ya está en uso por otro usuario.');
      return;
    }

    if (selectedStudentGuardian) {
      // Editar encargado existente
      try {
        await updateDoc(doc(db, 'Usuarios', selectedStudentGuardian.id), {
          nombre,
          carne,
          contrasena,
          institucion: institucionRef,
          estudiantes,
        });
        alert('Encargado actualizado exitosamente');
        onClose(true);
        fetchStudentGuardians();
      } catch (error) {
        alert('Error al actualizar el encargado: ' + error.message);
      }
    } else {
      // Agregar nuevo encargado
      try {
        await addDoc(collection(db, 'Usuarios'), {
          nombre,
          carne,
          contrasena,
          rol: 'encargado',
          institucion: institucionRef,
          estudiantes,
        });
        alert('Encargado registrado exitosamente');
        onClose(true);
        fetchStudentGuardians();
      } catch (error) {
        alert('Error registrando encargado: ' + error.message);
      }
    }
  };

  const handleAddEstudiante = () => {
    if (nombreEstudiante.trim() !== '') {
      setEstudiantes([...estudiantes, { nombre: nombreEstudiante }]);
      setNombreEstudiante('');
    }
  };

  const handleRemoveEstudiante = (index) => {
    const updatedEstudiantes = [...estudiantes];
    updatedEstudiantes.splice(index, 1);
    setEstudiantes(updatedEstudiantes);
  };

  const generateCarne = () => {
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const generatedCarne = currentYear.toString() + randomDigits;
    setCarne(generatedCarne);
  };

  const generateContrasena = () => {
    const nameParts = nombre.trim().split(' ');
    const firstPart = nameParts[0].toLowerCase();
    const secondInitial = nameParts[1] ? nameParts[1][0].toLowerCase() : '';
    const randomDigits = Math.floor(Math.random() * 900) + 100; // generates a random 3 digit number
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // generates a random letter

    const generatedContrasena = `${firstPart}${secondInitial}${randomDigits}${randomLetter}`;
    setContrasena(generatedContrasena);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-h-[80vh] overflow-y-auto">
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
          <div className="relative">
            <input
              type="text"
              value={carne}
              onChange={(e) => setCarne(e.target.value)}
              placeholder="Carné del Encargado"
              className="border p-2 mb-2 w-full pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-[calc(50%-4px)] transform -translate-y-1/2 text-blue-500"
              onClick={generateCarne}
            >
              <SparklesIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Contraseña del Encargado"
              className="border p-2 mb-2 w-full pr-10"
              required
            />
            {nombre.trim() && (
              <button
                type="button"
                className="absolute right-2 top-[calc(50%-4px)] transform -translate-y-1/2 text-blue-500"
                onClick={generateContrasena}
              >
                <SparklesIcon className="h-6 w-6" />
              </button>
            )}
            <button
              type="button"
              className={`absolute ${nombre.trim() ? 'right-12' : 'right-2'} top-[calc(50%-4px)] transform -translate-y-1/2 text-gray-500`}
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <EyeIcon className="h-6 w-6" /> : <EyeSlashIcon className="h-6 w-6" />}
            </button>
          </div>
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
          <div className="mb-4">
            <label htmlFor="estudiante" className="block mb-1 font-bold">
              Estudiantes:
            </label>
            <div className="flex">
              <input
                type="text"
                id="estudiante"
                value={nombreEstudiante}
                onChange={(e) => setNombreEstudiante(e.target.value)}
                placeholder="Nombre del estudiante"
                className="border p-2 w-full"
              />
              <button
                type="button"
                onClick={handleAddEstudiante}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 ml-2"
              >
                Agregar
              </button>
            </div>
          </div>
          {estudiantes.length > 0 && (
            <ul className="mb-4 space-y-2">
              {estudiantes.map((estudiante, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <span className="text-gray-700">{estudiante.nombre}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEstudiante(index)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
          >
            {selectedStudentGuardian ? 'Actualizar' : 'Registrar'}
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

export default StudentGuardianForm;