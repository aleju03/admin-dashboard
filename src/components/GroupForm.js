import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, query, where, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';
import StudentForm from './StudentForm';

// Function to get data of the responsible
const getEncargadoData = async (encargadoRef) => {
  const encargadoDoc = await getDoc(encargadoRef);
  if (encargadoDoc.exists()) {
    return { id: encargadoDoc.id, ...encargadoDoc.data() };
  }
  return null;
};

// Function to get students with data of responsible
const getEstudiantesWithEncargados = async (estudiantes) => {
  const estudiantesWithEncargados = await Promise.all(estudiantes.map(async (estudiante) => {
    const encargadosData = await Promise.all(estudiante.encargados.map(getEncargadoData));
    return {
      ...estudiante,
      encargados: encargadosData.filter(encargado => encargado !== null),
    };
  }));
  return estudiantesWithEncargados;
};

const GroupForm = ({ onClose, selectedGroup }) => {
  const { institutions, teachers, fetchData } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [docente, setDocente] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      setNombre(selectedGroup.nombre);
      setInstitucion(selectedGroup.institucion);
      setDocente(selectedGroup.docente);

      const fetchEstudiantes = async () => {
        const estudiantesWithEncargados = await getEstudiantesWithEncargados(selectedGroup.estudiantes || []);
        setEstudiantes(estudiantesWithEncargados);
      };

      fetchEstudiantes();
    } else {
      setNombre('');
      setInstitucion('');
      setDocente('');
      setEstudiantes([]);
    }
  }, [selectedGroup]);

  useEffect(() => {
    setIsFormValid(nombre !== '' && institucion !== '' && docente !== '');
  }, [nombre, institucion, docente]);

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
      fetchData();
    } catch (error) {
      alert('Error al guardar el grupo: ' + error.message);
    }
  };

  const handleCloseStudentForm = async (estudianteAgregado) => {
    setShowStudentForm(false);
    setSelectedStudent(null);
    if (estudianteAgregado) {
      if (selectedStudent) {
        const estudiantesActualizados = estudiantes.map((estudiante) =>
          estudiante.nombre_estudiante === selectedStudent.nombre_estudiante ? estudianteAgregado : estudiante
        );
        setEstudiantes(estudiantesActualizados);
      } else {
        const encargadosData = await Promise.all(
          estudianteAgregado.encargados.map(async (encargadoRef) => {
            const encargadoDoc = await getDoc(encargadoRef);
            return encargadoDoc.data();
          })
        );
        const estudianteConEncargados = {
          ...estudianteAgregado,
          encargados: encargadosData,
        };
        setEstudiantes([...estudiantes, estudianteConEncargados]);
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
      <div className="bg-white rounded-lg p-8 shadow-lg max-h-[80vh] overflow-y-auto">
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
            {institutions.map((institucion) => (
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
            {teachers.map((docente) => (
              <option key={docente.id} value={docente.nombre}>
                {docente.nombre}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSubmit}
            className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isFormValid}
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
            <div className="max-h-[40vh] overflow-y-auto">
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
                        {estudiante.encargados.map((encargado) => encargado.nombre).join(', ')}
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
            </div>
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