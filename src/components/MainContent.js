// src/components/MainContent.js
import React from 'react';
import InstitutionSection from './sections/InstitutionSection';
import TeacherSection from './sections/TeacherSection';
import StudentGuardianSection from './sections/StudentGuardianSection';
import GroupSection from './sections/GroupSection';
import DashboardStats from './sections/DashboardStats';

const MainContent = ({ activeSection, onSectionChange }) => {
  return (
    <div className="flex-1 p-8">
      {activeSection === 'dashboard' && <DashboardStats onSectionChange={onSectionChange} />}
      {activeSection === 'institutions' && <InstitutionSection />}
      {activeSection === 'teachers' && <TeacherSection />}
      {activeSection === 'studentGuardians' && <StudentGuardianSection />}
      {activeSection === 'groups' && <GroupSection />}
    </div>
  );
};

export default MainContent;