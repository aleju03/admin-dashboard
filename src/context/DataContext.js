import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, getDoc } from 'firebase/firestore';

export const DataContext = createContext();

const getEncargadoData = async (encargadoRefs) => {
  const encargadoDocs = await Promise.all(encargadoRefs.map(ref => getDoc(ref)));
  return encargadoDocs.map(doc => doc.exists() ? { id: doc.id, ...doc.data() } : null);
};

const getEstudiantesWithEncargados = async (estudiantes) => {
  const encargadoRefs = estudiantes.map(est => est.encargado);
  const encargadosData = await getEncargadoData(encargadoRefs);
  return estudiantes.map((estudiante, index) => ({
    ...estudiante,
    encargado: encargadosData[index],
  }));
};

export const DataProvider = ({ children }) => {
  const [institutions, setInstitutions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentGuardians, setStudentGuardians] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstitutions = async () => {
    const institucionesSnapshot = await getDocs(collection(db, 'Instituciones'));
    const institucionesData = institucionesSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((institucion) => institucion.nombre);
    setInstitutions(institucionesData);
  };

  const fetchTeachers = async () => {
    const usuariosSnapshot = await getDocs(collection(db, 'Usuarios'));
    const docentesData = usuariosSnapshot.docs
      .filter((doc) => doc.data().rol === 'docente')
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    setTeachers(docentesData);
  };

  const fetchStudentGuardians = async () => {
    const usuariosSnapshot = await getDocs(collection(db, 'Usuarios'));
    const encargadosData = usuariosSnapshot.docs
      .filter((doc) => doc.data().rol === 'encargado')
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    setStudentGuardians(encargadosData);
  };

  const fetchGroups = async () => {
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
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchInstitutions(),
        fetchTeachers(),
        fetchStudentGuardians(),
        fetchGroups()
      ]);
      setLoading(false);
    };
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
        fetchInstitutions,
        fetchTeachers,
        fetchStudentGuardians,
        fetchGroups
      }}
    >
      {children}
    </DataContext.Provider>
  );
};