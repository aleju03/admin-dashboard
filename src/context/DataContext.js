import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, getDoc } from 'firebase/firestore';

export const DataContext = createContext();

const getEncargadoData = async (encargadoRef) => {
  const encargadoDoc = await getDoc(encargadoRef);
  if (encargadoDoc.exists()) {
    return { id: encargadoDoc.id, ...encargadoDoc.data() };
  }
  return null;
};

const getEstudiantesWithEncargados = async (estudiantes) => {
  const estudiantesWithEncargados = await Promise.all(estudiantes.map(async (estudiante) => {
    const encargadoData = await getEncargadoData(estudiante.encargado);
    return {
      ...estudiante,
      encargado: encargadoData,
    };
  }));
  return estudiantesWithEncargados;
};

export const DataProvider = ({ children }) => {
  const [institutions, setInstitutions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentGuardians, setStudentGuardians] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const institucionesSnapshot = await getDocs(collection(db, 'Instituciones'));
    const institucionesData = institucionesSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((institucion) => institucion.nombre);
    setInstitutions(institucionesData);

    const usuariosSnapshot = await getDocs(collection(db, 'Usuarios'));
    const docentesData = usuariosSnapshot.docs
      .filter((doc) => doc.data().rol === 'docente')
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    const encargadosData = usuariosSnapshot.docs
      .filter((doc) => doc.data().rol === 'encargado')
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    setTeachers(docentesData);
    setStudentGuardians(encargadosData);

    const gruposSnapshot = await getDocs(collection(db, 'Grupos'));
    const gruposData = await Promise.all(
      gruposSnapshot.docs.map(async (doc) => {
        const grupoData = doc.data();
        const institucion = grupoData.institucion ? await getDoc(grupoData.institucion) : null;
        const docente = grupoData.docente ? await getDoc(grupoData.docente) : null;
        const estudiantesWithEncargados = await getEstudiantesWithEncargados(grupoData.estudiantes || []);
        return {
          id: doc.id,
          ...grupoData,
          institucion: institucion ? institucion.data().nombre : 'Desconocida',
          docente: docente ? docente.data().nombre : 'Desconocido',
          estudiantes: estudiantesWithEncargados,
        };
      })
    );
    setGroups(gruposData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        institutions,
        teachers,
        studentGuardians,
        groups,
        loading,
        fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};