import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';
import { SparklesIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const TeacherForm = ({ onClose, selectedTeacher, fetchTeachers }) => {
  const { institutions } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [carne, setCarne] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (selectedTeacher) {
      setNombre(selectedTeacher.nombre);
      setCarne(selectedTeacher.carne);
      setContraseña(selectedTeacher.contraseña);
      setInstitucion(selectedTeacher.institucion.id);
    }
  }, [selectedTeacher]);

  useEffect(() => {
    setIsFormValid(nombre !== '' && carne !== '' && contraseña !== '' && institucion !== '');
  }, [nombre, carne, contraseña, institucion]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const institucionRef = doc(db, 'Instituciones', institucion);

    if (selectedTeacher) {
      // Editar profesor existente
      try {
        await updateDoc(doc(db, 'Usuarios', selectedTeacher.id), {
          nombre,
          carne,
          contraseña,
          institucion: institucionRef,
        });
        alert('Profesor actualizado exitosamente');
        onClose(true);
        fetchTeachers();
      } catch (error) {
        alert('Error al actualizar el profesor: ' + error.message);
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

      // Agregar nuevo profesor
      try {
        await addDoc(collection(db, 'Usuarios'), {
          nombre,
          carne,
          contraseña,
          rol: 'docente',
          institucion: institucionRef,
        });
        alert('Profesor registrado exitosamente');
        onClose(true);
        fetchTeachers();
      } catch (error) {
        alert('Error registrando profesor: ' + error.message);
      }
    }
  };

  const generateCarne = () => {
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const generatedCarne = currentYear.toString() + randomDigits;
    setCarne(generatedCarne);
  };

  const generateContraseña = () => {
    const nameParts = nombre.trim().split(' ');
    const firstPart = nameParts[0].toLowerCase();
    const secondInitial = nameParts[1] ? nameParts[1][0].toLowerCase() : '';
    const randomDigits = Math.floor(Math.random() * 900) + 100; // generates a random 3 digit number
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // generates a random letter

    const generatedContraseña = `${firstPart}${secondInitial}${randomDigits}${randomLetter}`;
    setContraseña(generatedContraseña);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {selectedTeacher ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del Profesor"
            className="border p-2 mb-2 w-full"
            required
          />
          <div className="relative">
            <input
              type="text"
              value={carne}
              onChange={(e) => setCarne(e.target.value)}
              placeholder="Carné del Profesor"
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
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Contraseña del Profesor"
              className="border p-2 mb-2 w-full pr-10"
              required
            />
            {nombre.trim() && (
              <button
                type="button"
                className="absolute right-2 top-[calc(50%-4px)] transform -translate-y-1/2 text-blue-500"
                onClick={generateContraseña}
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
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2 ${
              !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!isFormValid}
          >
            {selectedTeacher ? 'Actualizar' : 'Registrar'}
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

export default TeacherForm;