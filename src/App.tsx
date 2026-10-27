/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { PatientsModule } from './components/patients/PatientsModule';
import { ClinicalHistoryModule } from './components/clinical/ClinicalHistoryModule';
import { DiagnosticsModule } from './components/diagnostics/DiagnosticsModule';
import { TreatmentPlanModule } from './components/treatment/TreatmentPlanModule';
import { PrescriptionModule } from './components/prescriptions/PrescriptionModule';
import { ClinicalReportsModule } from './components/reports/ClinicalReportsModule';
import { AgendaModule } from './components/agenda/AgendaModule';
import { FinanceModule } from './components/finance/FinanceModule';
import { DocumentsAuditModule } from './components/documents/DocumentsAuditModule';
import { ProfessionalsModule } from './components/professionals/ProfessionalsModule';
import { ProfessionalModal } from './components/professionals/ProfessionalModal';
import { PastorsModule } from './components/pastors/PastorsModule';
import { PastorModal } from './components/pastors/PastorModal';
import { PatientModal } from './components/patients/PatientModal';
import { AppointmentModal } from './components/agenda/AppointmentModal';
import { SoapNoteModal } from './components/clinical/SoapNoteModal';
import { PrescriptionModal } from './components/prescriptions/PrescriptionModal';
import { AiClinicalAssistantModal } from './components/ai/AiClinicalAssistantModal';
import { PsychotherapyEngineModule } from './components/psychotherapy/PsychotherapyEngineModule';
import { HelpCenterModule } from './components/help/HelpCenterModule';
import { ContextualHelpDrawer } from './components/help/ContextualHelpDrawer';


const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global modals
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isNewProfessionalOpen, setIsNewProfessionalOpen] = useState(false);
  const [isNewPastorOpen, setIsNewPastorOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [soapPatientId, setSoapPatientId] = useState<string | null>(null);
  const [rxPatientId, setRxPatientId] = useState<string | null>(null);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onOpenNewPatient={() => setIsNewPatientOpen(true)}
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
            onOpenPrescriptionModule={() => setActiveTab('prescriptions')}
          />
        );
      case 'patients':
        return (
          <PatientsModule
            onOpenNewSoapModal={(patientId) => setSoapPatientId(patientId)}
            onOpenNewPrescriptionModal={(patientId) => setRxPatientId(patientId)}
          />
        );
      case 'clinical':
        return <ClinicalHistoryModule />;
      case 'diagnostics':
        return <DiagnosticsModule />;
      case 'treatments':
        return <TreatmentPlanModule />;
      case 'prescriptions':
        return <PrescriptionModule />;
      case 'reports':
        return <ClinicalReportsModule />;
      case 'agenda':
        return <AgendaModule />;
      case 'finance':
        return <FinanceModule />;
      case 'documents':
        return <DocumentsAuditModule />;
      case 'professionals':
        return <ProfessionalsModule />;
      case 'pastors':
        return (
          <PastorsModule
            onOpenNewSoapModal={(patientId) => {
              setSoapPatientId(patientId || null);
            }}
          />
        );
      case 'psychotherapy':
        return <PsychotherapyEngineModule />;
      case 'help':
        return <HelpCenterModule />;
      default:

        return (
          <Dashboard
            onOpenNewPatient={() => setIsNewPatientOpen(true)}
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
            onOpenPrescriptionModule={() => setActiveTab('prescriptions')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenNewPatient={() => setIsNewPatientOpen(true)}
        onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
        onOpenNewProfessional={() => setIsNewProfessionalOpen(true)}
        onOpenNewPastor={() => setIsNewPastorOpen(true)}
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Modals */}
      {isNewPatientOpen && <PatientModal onClose={() => setIsNewPatientOpen(false)} />}
      {isNewAppointmentOpen && <AppointmentModal onClose={() => setIsNewAppointmentOpen(false)} />}
      {isNewProfessionalOpen && <ProfessionalModal onClose={() => setIsNewProfessionalOpen(false)} />}
      {isNewPastorOpen && <PastorModal onClose={() => setIsNewPastorOpen(false)} />}
      {isAiAssistantOpen && <AiClinicalAssistantModal onClose={() => setIsAiAssistantOpen(false)} />}
      {soapPatientId && (
        <SoapNoteModal
          defaultPatientId={soapPatientId}
          onClose={() => setSoapPatientId(null)}
        />
      )}
      {rxPatientId && (
        <PrescriptionModal
          defaultPatientId={rxPatientId}
          onClose={() => setRxPatientId(null)}
        />
      )}

      {/* Global Contextual Help Slide-Over Drawer */}
      <ContextualHelpDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
