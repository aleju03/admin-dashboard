// src/components/GroupForm.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import StudentForm from './StudentForm';

const GroupForm = ({ onClose, selectedGroup }) => {
  const [nombre, setNombre] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [docente, setDocente] = useState('');
  const [instituciones, setInstituciones] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const institucionesSnapshot = await getDocs(collection(db, 'Instituciones'));
      const institucionesData = institucionesSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((institucion) => institucion.nombre);
      setInstituciones(institucionesData);

      const docentesSnapshot = await getDocs(collection(db, 'Usuarios'));
      const docentesData = docentesSnapshot.docs
        .filter((doc) => doc.data().rol === 'docente')
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setDocentes(docentesData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      setNombre(selectedGroup.nombre);
      setInstitucion(selectedGroup.institucion);
      setDocente(selectedGroup.docente);
      setEstudiantes(selectedGroup.estudiantes || []);
    } else {
      setNombre('');
      setInstitucion('');
      setDocente('');
      setEstudiantes([]);
    }
  }, [selectedGroup]);

  const handleSubmit = async () => {
    try {
      const institucionQuery = query(collection(db, 'Instituciones'), where('nombre', '==', institucion));
      const docenteQuery = query(collection(db, 'Usuarios'), where('nombre', '==', docente));

      const institucionDoc = await getDocs(institucionQuery);
      const docenteDoc = await getDocs(docenteQuery);

      if (institucionDoc.empty || docenteDoc.empty) {
        alert('La institución o el docente seleccionado no existe');
        return;
      }

      const institucionRef = institucionDoc.docs[0].ref;
      const docenteRef = docenteDoc.docs[0].ref;

      if (selectedGroup) {
        await updateDoc(doc(db, 'Grupos', selectedGroup.id), {
          nombre,
          institucion: institucionRef,
          docente: docenteRef,
          estudiantes: estudiantes,
        });
        alert('Grupo actualizado exitosamente');
      } else {
        await addDoc(collection(db, 'Grupos'), {
          nombre,
          institucion: institucionRef,
          docente: docenteRef,
          estudiantes: estudiantes,
        });
        alert('Grupo registrado exitosamente');
      }
      setNombre('');
      setInstitucion('');
      setDocente('');
      setEstudiantes([]);
      onClose();
    } catch (error) {
      alert('Error al guardar el grupo: ' + error.message);
    }
  };

  const handleCloseStudentForm = (estudianteAgregado) => {
    setShowStudentForm(false);
    setSelectedStudent(null);
    if (estudianteAgregado) {
      if (selectedStudent) {
        const estudiantesActualizados = estudiantes.map((estudiante) =>
          estudiante.nombre_estudiante === selectedStudent.nombre_estudiante ? estudianteAgregado : estudiante
        );
        setEstudiantes(estudiantesActualizados);
      } else {
        setEstudiantes([...estudiantes, estudianteAgregado]);
      }
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowStudentForm(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentForm(true);
  };

  const handleDeleteStudent = (student) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      const estudiantesActualizados = estudiantes.filter(
        (estudiante) => estudiante.nombre_estudiante !== student.nombre_estudiante
      );
      setEstudiantes(estudiantesActualizados);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {selectedGroup ? 'Editar Grupo' : 'Agregar Nuevo Grupo'}
        </h2>
        <form>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del Grupo"
            className="border p-2 mb-2 w-full"
          />
          <select
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="" disabled>Seleccionar Institución</option>
            {instituciones.map((institucion) => (
              <option key={institucion.id} value={institucion.nombre}>
                {institucion.nombre}
              </option>
            ))}
          </select>
          <select
            value={docente}
            onChange={(e) => setDocente(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="" disabled>Seleccionar Docente</option>
            {docentes.map((docente) => (
              <option key={docente.id} value={docente.nombre}>
                {docente.nombre}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
          >
            {selectedGroup ? 'Actualizar' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </form>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Estudiantes</h3>
          <button
            type="button"
            onClick={handleAddStudent}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
          >
            Agregar Estudiante
          </button>
          {estudiantes.length > 0 ? (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                    Nombre
                  </th>
                  <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                    Encargados
                  </th>
                  <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {estudiantes.map((estudiante, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4">{estudiante.nombre_estudiante}</td>
                    <td className="py-3 px-4">
                      {estudiante.encargados && estudiante.encargados.map((encargado) => encargado.nombre).join(', ')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded mr-2"
                        onClick={() => handleEditStudent(estudiante)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                        onClick={() => handleDeleteStudent(estudiante)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
        {showStudentForm && (
          <StudentForm
            onClose={handleCloseStudentForm}
            selectedGroup={selectedGroup}
            selectedStudent={selectedStudent}
          />
        )}
      </div>
    </div>
  );
};

export default GroupForm;