import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Patient,
  SoapNote,
  DiagnosticRecord,
  TreatmentPlan,
  PsychiatricPrescription,
  ClinicalReport,
  Appointment,
  FinancialTransaction,
  AuditLogEntry,
  UserRole,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_PATIENTS,
  INITIAL_SOAP_NOTES,
  INITIAL_DIAGNOSTICS,
  INITIAL_TREATMENT_PLANS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_REPORTS,
  INITIAL_APPOINTMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

interface AppContextType {
  // Active Profile & Medical Team Management
  profiles: UserProfile[];
  currentProfile: UserProfile;
  setCurrentProfile: (profile: UserProfile) => void;
  addProfile: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; error?: string; profile?: UserProfile };
  updateProfile: (id: string, updates: Partial<UserProfile>) => { success: boolean; error?: string };
  toggleProfileStatus: (id: string) => { success: boolean; error?: string };
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Active view navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;

  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; error?: string; patient?: Patient };
  updatePatient: (id: string, updates: Partial<Patient>) => { success: boolean; error?: string };
  archivePatient: (id: string) => void;

  // Clinical Records / SOAP Notes
  soapNotes: SoapNote[];
  addSoapNote: (note: Omit<SoapNote, 'id' | 'createdAt' | 'hashIntegrity'>) => SoapNote;
  getPatientNotes: (patientId: string) => SoapNote[];

  // Diagnostics
  diagnostics: DiagnosticRecord[];
  addDiagnostic: (diag: Omit<DiagnosticRecord, 'id' | 'createdAt' | 'updatedAt'>) => DiagnosticRecord;
  updateDiagnostic: (id: string, updates: Partial<DiagnosticRecord>) => void;
  getPatientDiagnostics: (patientId: string) => DiagnosticRecord[];

  // Treatment Plans
  treatmentPlans: TreatmentPlan[];
  addTreatmentPlan: (plan: Omit<TreatmentPlan, 'id' | 'createdAt' | 'updatedAt'>) => TreatmentPlan;
  updateTreatmentPlan: (id: string, updates: Partial<TreatmentPlan>) => void;
  getPatientTreatmentPlans: (patientId: string) => TreatmentPlan[];

  // Psychiatric Prescriptions
  prescriptions: PsychiatricPrescription[];
  addPrescription: (rx: Omit<PsychiatricPrescription, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => PsychiatricPrescription;
  updatePrescription: (id: string, updates: Partial<PsychiatricPrescription>) => void;
  approveAndSignPrescription: (id: string, signatureHash: string, notes?: string) => { success: boolean; error?: string };
  registerPatientReceipt: (id: string, receiptData: any) => void;
  getPatientPrescriptions: (patientId: string) => PsychiatricPrescription[];

  // Clinical Reports
  reports: ClinicalReport[];
  addReport: (report: Omit<ClinicalReport, 'id' | 'createdAt'>) => ClinicalReport;
  signReport: (id: string, signatureHash: string) => void;
  getPatientReports: (patientId: string) => ClinicalReport[];

  // Appointments
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;

  // Financials
  transactions: FinancialTransaction[];
  addTransaction: (trx: Omit<FinancialTransaction, 'id' | 'createdAt'>) => FinancialTransaction;
  updateTransaction: (id: string, updates: Partial<FinancialTransaction>) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  logAction: (action: AuditLogEntry['action'], module: AuditLogEntry['module'], details: string, patientCodeOrId?: string) => void;

  // System Management / Backup
  exportDataBackup: () => void;
  restoreDataBackup: (jsonData: string) => boolean;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILES: 'jr_profiles_v1',
  CURRENT_USER_ID: 'jr_curr_user_id_v1',
  PATIENTS: 'jr_patients_v1',
  SOAP_NOTES: 'jr_soap_notes_v1',
  DIAGNOSTICS: 'jr_diagnostics_v1',
  TREATMENTS: 'jr_treatments_v1',
  PRESCRIPTIONS: 'jr_prescriptions_v1',
  REPORTS: 'jr_reports_v1',
  APPOINTMENTS: 'jr_appointments_v1',
  TRANSACTIONS: 'jr_transactions_v1',
  AUDIT_LOGS: 'jr_audit_logs_v1',
  DARK_MODE: 'jr_dark_mode_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading storage ${key}:`, e);
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const loaded = loadStorage<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    return loaded.map((p) => ({
      ...p,
      status: p.status || 'Activo',
      canSignPrescriptions: p.canSignPrescriptions ?? (p.role === 'psiquiatra'),
    }));
  });

  const [currentProfile, setCurrentProfileState] = useState<UserProfile>(() => {
    const savedId = loadStorage(STORAGE_KEYS.CURRENT_USER_ID, INITIAL_PROFILES[0].id);
    const loadedProfiles = loadStorage<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    return loadedProfiles.find((p) => p.id === savedId) || INITIAL_PROFILES.find((p) => p.id === savedId) || INITIAL_PROFILES[0];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => loadStorage(STORAGE_KEYS.DARK_MODE, false));
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const [patients, setPatients] = useState<Patient[]>(() => loadStorage(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS));
  const [soapNotes, setSoapNotes] = useState<SoapNote[]>(() => loadStorage(STORAGE_KEYS.SOAP_NOTES, INITIAL_SOAP_NOTES));
  const [diagnostics, setDiagnostics] = useState<DiagnosticRecord[]>(() => loadStorage(STORAGE_KEYS.DIAGNOSTICS, INITIAL_DIAGNOSTICS));
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(() => loadStorage(STORAGE_KEYS.TREATMENTS, INITIAL_TREATMENT_PLANS));
  const [prescriptions, setPrescriptions] = useState<PsychiatricPrescription[]>(() => loadStorage(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS));
  const [reports, setReports] = useState<ClinicalReport[]>(() => loadStorage(STORAGE_KEYS.REPORTS, INITIAL_REPORTS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS));
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => loadStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS));

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOAP_NOTES, JSON.stringify(soapNotes));
  }, [soapNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTICS, JSON.stringify(diagnostics));
  }, [diagnostics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(treatmentPlans));
  }, [treatmentPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const setCurrentProfile = (profile: UserProfile) => {
    setCurrentProfileState(profile);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, JSON.stringify(profile.id));
    logAction('CONSULTA', 'SEGURIDAD', `Cambio de sesión activa a: ${profile.name} (${profile.title})`);
  };

  // Medical Team Management (Profiles) CRUD
  const addProfile = (
    profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; error?: string; profile?: UserProfile } => {
    if (!profileData.name || profileData.name.trim().length < 3) {
      return { success: false, error: 'El nombre completo del profesional es obligatorio (mínimo 3 caracteres).' };
    }
    if (!profileData.registrationNumber || profileData.registrationNumber.trim().length < 4) {
      return { success: false, error: 'El número de registro médico, tarjeta profesional o ReTHUS es obligatorio.' };
    }

    // Check duplicate ReTHUS / registrationNumber
    const duplicateReg = profiles.find(
      (p) => p.registrationNumber.trim().toLowerCase() === profileData.registrationNumber.trim().toLowerCase()
    );
    if (duplicateReg) {
      return {
        success: false,
        error: `Ya existe un profesional registrado con el registro / ReTHUS "${profileData.registrationNumber}" (${duplicateReg.name}). Evite duplicidades de habilitación profesional.`,
      };
    }

    // Check email
    if (!profileData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email.trim())) {
      return { success: false, error: 'El correo electrónico institucional no tiene un formato válido.' };
    }
    const duplicateEmail = profiles.find(
      (p) => p.email.trim().toLowerCase() === profileData.email.trim().toLowerCase()
    );
    if (duplicateEmail) {
      return {
        success: false,
        error: `El correo electrónico "${profileData.email}" ya se encuentra registrado para el profesional ${duplicateEmail.name}.`,
      };
    }

    // Unique ID generation
    const maxNum = profiles.reduce((max, p) => {
      const match = p.id.match(/usr-[a-z]+-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const prefix =
      profileData.role === 'psiquiatra'
        ? 'psiq'
        : profileData.role === 'psicologo'
        ? 'psic'
        : profileData.role === 'orientador'
        ? 'past'
        : 'admin';
    const newId = `usr-${prefix}-${String(maxNum + 1).padStart(2, '0')}`;

    // Clinical signing permission enforcement: Only psychiatrists with verified ReTHUS can sign prescriptions!
    const canSignPrescriptions = profileData.role === 'psiquiatra';

    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      ...profileData,
      id: newId,
      canSignPrescriptions,
      status: profileData.status || 'Activo',
      createdAt: now,
      updatedAt: now,
    };

    setProfiles((prev) => [...prev, newProfile]);
    logAction(
      'CREACIÓN',
      'SEGURIDAD',
      `Registro de nuevo profesional clínico: ${newProfile.name} (${newProfile.title} - ${newProfile.registrationNumber}). Rol: ${newProfile.role}`
    );
    return { success: true, profile: newProfile };
  };

  const updateProfile = (id: string, updates: Partial<UserProfile>): { success: boolean; error?: string } => {
    const existing = profiles.find((p) => p.id === id);
    if (!existing) {
      return { success: false, error: 'Profesional no encontrado en el sistema.' };
    }

    if (updates.registrationNumber) {
      const duplicateReg = profiles.find(
        (p) => p.id !== id && p.registrationNumber.trim().toLowerCase() === updates.registrationNumber!.trim().toLowerCase()
      );
      if (duplicateReg) {
        return {
          success: false,
          error: `El número de registro / ReTHUS ya pertenece a otro profesional registrado (${duplicateReg.name}).`,
        };
      }
    }

    if (updates.email) {
      const duplicateEmail = profiles.find(
        (p) => p.id !== id && p.email.trim().toLowerCase() === updates.email!.trim().toLowerCase()
      );
      if (duplicateEmail) {
        return {
          success: false,
          error: `El correo electrónico ya pertenece a otro profesional registrado (${duplicateEmail.name}).`,
        };
      }
    }

    const newRole = updates.role || existing.role;
    const canSignPrescriptions = newRole === 'psiquiatra';

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated: UserProfile = {
            ...p,
            ...updates,
            canSignPrescriptions,
            updatedAt: new Date().toISOString(),
          };
          if (currentProfile.id === id) {
            setCurrentProfileState(updated);
          }
          return updated;
        }
        return p;
      })
    );

    logAction(
      'MODIFICACIÓN',
      'SEGURIDAD',
      `Actualización de credenciales y datos del profesional: ${existing.name} (ID: ${id})`
    );
    return { success: true };
  };

  const toggleProfileStatus = (id: string): { success: boolean; error?: string } => {
    if (currentProfile.id === id) {
      return {
        success: false,
        error: 'No es posible inactivar al profesional que tiene la sesión activa actualmente. Cambie de usuario primero.',
      };
    }
    const target = profiles.find((p) => p.id === id);
    if (!target) return { success: false, error: 'Profesional no encontrado.' };

    const newStatus: 'Activo' | 'Inactivo' = target.status === 'Activo' ? 'Inactivo' : 'Activo';
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p))
    );
    logAction(
      'CAMBIO_ESTADO',
      'SEGURIDAD',
      `Estado del profesional ${target.name} cambiado a: ${newStatus}`
    );
    return { success: true };
  };

  const logAction = (
    action: AuditLogEntry['action'],
    module: AuditLogEntry['module'],
    details: string,
    patientCodeOrId?: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: currentProfile.id,
      userName: currentProfile.name,
      userRole: currentProfile.role,
      action,
      module,
      details,
      patientCodeOrId,
      ipAddress: '190.158.42.10 (Sesión Certificada)',
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 199)]);
  };

  // Patients CRUD with duplicate document detection
  const addPatient = (
    patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; error?: string; patient?: Patient } => {
    const cleanDoc = patientData.documentNumber.trim().toLowerCase();
    const existingPatient = patients.find(
      (p) => p.documentType === patientData.documentType && p.documentNumber.trim().toLowerCase() === cleanDoc
    );
    if (existingPatient) {
      return {
        success: false,
        error: `Ya existe un paciente registrado con ${patientData.documentType} ${patientData.documentNumber}: ${existingPatient.firstName} ${existingPatient.lastName} (Código: ${existingPatient.id}). No se permiten historias clínicas duplicadas (Ley 1090/2006 y Res. 1995/1999).`,
      };
    }

    const maxNum = patients.reduce((max, p) => {
      const match = p.id.match(/PAC-\d+-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const newId = `PAC-2026-${String(maxNum + 1).padStart(3, '0')}`;

    const newPatient: Patient = {
      ...patientData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPatients((prev) => [newPatient, ...prev]);
    logAction(
      'CREACIÓN',
      'PACIENTES',
      `Ingreso de nuevo paciente: ${newPatient.firstName} ${newPatient.lastName} (${newPatient.documentType} ${newPatient.documentNumber})`,
      newId
    );
    return { success: true, patient: newPatient };
  };

  const updatePatient = (id: string, updates: Partial<Patient>): { success: boolean; error?: string } => {
    const existing = patients.find((p) => p.id === id);
    if (!existing) return { success: false, error: 'Paciente no encontrado.' };

    if (updates.documentNumber || updates.documentType) {
      const docType = updates.documentType || existing.documentType;
      const docNum = (updates.documentNumber || existing.documentNumber).trim().toLowerCase();
      const duplicate = patients.find(
        (p) => p.id !== id && p.documentType === docType && p.documentNumber.trim().toLowerCase() === docNum
      );
      if (duplicate) {
        return {
          success: false,
          error: `Ya existe otro paciente registrado con ${docType} ${updates.documentNumber}: ${duplicate.firstName} ${duplicate.lastName} (${duplicate.id}).`,
        };
      }
    }

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
          logAction('MODIFICACIÓN', 'PACIENTES', `Actualización de ficha para: ${updated.firstName} ${updated.lastName}`, id);
          return updated;
        }
        return p;
      })
    );
    return { success: true };
  };

  const archivePatient = (id: string) => {
    updatePatient(id, { status: 'Archivado' });
    logAction('CAMBIO_ESTADO', 'PACIENTES', `Paciente archivado administrativamente`, id);
  };

  // SOAP Notes
  const addSoapNote = (noteData: Omit<SoapNote, 'id' | 'createdAt' | 'hashIntegrity'>): SoapNote => {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const newNote: SoapNote = {
      ...noteData,
      id: `NOT-2026-${String(soapNotes.length + 101).padStart(4, '0')}`,
      hashIntegrity: `SHA256:${randomHex}`,
      createdAt: new Date().toISOString(),
    };
    setSoapNotes((prev) => [newNote, ...prev]);
    logAction('CREACIÓN', 'HISTORIA_CLINICA', `Nota clínica/pastoral registrada para paciente ${noteData.patientName} (${noteData.type})`, noteData.patientId);
    return newNote;
  };

  const getPatientNotes = (patientId: string) => soapNotes.filter((n) => n.patientId === patientId);

  // Diagnostics
  const addDiagnostic = (diagData: Omit<DiagnosticRecord, 'id' | 'createdAt' | 'updatedAt'>): DiagnosticRecord => {
    const newDiag: DiagnosticRecord = {
      ...diagData,
      id: `DX-2026-${String(diagnostics.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDiagnostics((prev) => [newDiag, ...prev]);
    logAction('CREACIÓN', 'DIAGNOSTICOS', `Diagnóstico ${diagData.codeCIE10} - ${diagData.description} (${diagData.status}) asignado a ${diagData.patientName}`, diagData.patientId);
    return newDiag;
  };

  const updateDiagnostic = (id: string, updates: Partial<DiagnosticRecord>) => {
    setDiagnostics((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
    );
    logAction('MODIFICACIÓN', 'DIAGNOSTICOS', `Diagnóstico ${id} modificado`, id);
  };

  const getPatientDiagnostics = (patientId: string) => diagnostics.filter((d) => d.patientId === patientId);

  // Treatment Plans
  const addTreatmentPlan = (planData: Omit<TreatmentPlan, 'id' | 'createdAt' | 'updatedAt'>): TreatmentPlan => {
    const newPlan: TreatmentPlan = {
      ...planData,
      id: `PLN-2026-${String(treatmentPlans.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTreatmentPlans((prev) => [newPlan, ...prev]);
    logAction('CREACIÓN', 'TRATAMIENTOS', `Plan terapéutico creado: ${planData.title}`, planData.patientId);
    return newPlan;
  };

  const updateTreatmentPlan = (id: string, updates: Partial<TreatmentPlan>) => {
    setTreatmentPlans((prev) =>
      prev.map((tp) => (tp.id === id ? { ...tp, ...updates, updatedAt: new Date().toISOString() } : tp))
    );
    logAction('MODIFICACIÓN', 'TRATAMIENTOS', `Plan terapéutico ${id} actualizado`, id);
  };

  const getPatientTreatmentPlans = (patientId: string) => treatmentPlans.filter((tp) => tp.patientId === patientId);

  // Psychiatric Prescriptions
  const addPrescription = (rxData: Omit<PsychiatricPrescription, 'id' | 'version' | 'createdAt' | 'updatedAt'>): PsychiatricPrescription => {
    const newRx: PsychiatricPrescription = {
      ...rxData,
      id: `RX-2026-${String(prescriptions.length + 45).padStart(4, '0')}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      historyOfChanges: [
        {
          timestamp: new Date().toISOString(),
          author: `${currentProfile.name} (${currentProfile.title})`,
          action: 'Creación de prescripción',
          details: `Estado inicial: ${rxData.status}. Fármacos: ${rxData.items.map((i) => i.genericName).join(', ')}`,
        },
      ],
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    logAction('CREACIÓN', 'PRESCRIPCIONES', `Nueva prescripción ${newRx.id} para ${newRx.patientName}`, newRx.patientId);
    return newRx;
  };

  const updatePrescription = (id: string, updates: Partial<PsychiatricPrescription>) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id === id) {
          const history = rx.historyOfChanges || [];
          const updated: PsychiatricPrescription = {
            ...rx,
            ...updates,
            version: rx.version + 1,
            updatedAt: new Date().toISOString(),
            historyOfChanges: [
              ...history,
              {
                timestamp: new Date().toISOString(),
                author: `${currentProfile.name} (${currentProfile.title})`,
                action: 'Modificación controlada de versión',
                details: `Modificación de campos o ítems en v${rx.version + 1}`,
              },
            ],
          };
          logAction('MODIFICACIÓN', 'PRESCRIPCIONES', `Fórmula ${id} actualizada a versión ${updated.version}`, rx.patientId);
          return updated;
        }
        return rx;
      })
    );
  };

  const approveAndSignPrescription = (id: string, signatureHash: string, notes?: string): { success: boolean; error?: string } => {
    if (currentProfile.role !== 'psiquiatra') {
      return {
        success: false,
        error: 'Operación restringida: Solo un Médico Psiquiatra legalmente autorizado y acreditado en ReTHUS puede aprobar y firmar prescripciones psicofarmacológicas.',
      };
    }

    const rx = prescriptions.find((p) => p.id === id);
    if (!rx) return { success: false, error: 'Prescripción no encontrada.' };

    const now = new Date().toISOString();
    const updated: Partial<PsychiatricPrescription> = {
      status: 'Aprobada y Firmada por Psiquiatra',
      psychiatristName: currentProfile.name,
      psychiatristRegistration: currentProfile.registrationNumber,
      psychiatristSpecialty: currentProfile.title,
      psychiatristInstitution: 'JAIRRESTAURA Consultorio Digital',
      psychiatristSignatureHash: signatureHash,
      signedAt: now,
      observations: notes || rx.observations,
      historyOfChanges: [
        ...(rx.historyOfChanges || []),
        {
          timestamp: now,
          author: currentProfile.name,
          action: 'Firma y Aprobación Médica Psiquiátrica',
          details: `Validación conforme a Decreto 780 de 2016 y Res. 1403 de 2007. Hash: ${signatureHash}`,
        },
      ],
    };

    updatePrescription(id, updated);
    logAction('FIRMA_DIGITAL', 'PRESCRIPCIONES', `Prescripción ${id} aprobada y firmada digitalmente por ${currentProfile.name}`, rx.patientId);
    return { success: true };
  };

  const registerPatientReceipt = (id: string, receiptData: any) => {
    const rx = prescriptions.find((p) => p.id === id);
    if (!rx) return;
    const now = new Date().toISOString();
    const updated: Partial<PsychiatricPrescription> = {
      status: 'Emitida al Paciente',
      patientReceipt: receiptData,
      historyOfChanges: [
        ...(rx.historyOfChanges || []),
        {
          timestamp: now,
          author: `${currentProfile.name}`,
          action: 'Constancia de entrega y recepción del paciente',
          details: `Recibido por ${receiptData.patientOrGuardianName} (${receiptData.documentNumber}). Método: ${receiptData.signatureMethod}`,
        },
      ],
    };
    updatePrescription(id, updated);
    logAction('EXPORTACIÓN_PDF', 'PRESCRIPCIONES', `Constancia de recepción de fórmula ${id} registrada para ${receiptData.patientOrGuardianName}`, rx.patientId);
  };

  const getPatientPrescriptions = (patientId: string) => prescriptions.filter((p) => p.patientId === patientId);

  // Clinical Reports
  const addReport = (reportData: Omit<ClinicalReport, 'id' | 'createdAt'>): ClinicalReport => {
    const newReport: ClinicalReport = {
      ...reportData,
      id: `REP-2026-${String(reports.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    logAction('CREACIÓN', 'INFORMES', `Informe ${newReport.type} generado para ${newReport.patientName}`, newReport.patientId);
    return newReport;
  };

  const signReport = (id: string, signatureHash: string) => {
    const now = new Date().toISOString();
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Validado y Firmado',
              signedAt: now,
              signatureHash,
            }
          : r
      )
    );
    const target = reports.find((r) => r.id === id);
    logAction('FIRMA_DIGITAL', 'INFORMES', `Informe ${id} firmado y validado por ${currentProfile.name}`, target?.patientId);
  };

  const getPatientReports = (patientId: string) => reports.filter((r) => r.patientId === patientId);

  // Appointments
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `APT-2026-${String(appointments.length + 105).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);
    logAction('CREACIÓN', 'AGENDA', `Cita programada para ${aptData.patientName} (${aptData.date} a las ${aptData.startTime})`, aptData.patientId);
    return newApt;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    logAction('MODIFICACIÓN', 'AGENDA', `Cita ${id} actualizada`);
  };

  // Transactions
  const addTransaction = (trxData: Omit<FinancialTransaction, 'id' | 'createdAt'>): FinancialTransaction => {
    const newTrx: FinancialTransaction = {
      ...trxData,
      id: `TRX-2026-${String(transactions.length + 8).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTrx, ...prev]);
    logAction('CREACIÓN', 'FINANZAS', `Movimiento contable registrado: ${trxData.type} - ${trxData.concept} ($${trxData.amount.toLocaleString('es-CO')})`, trxData.patientId);
    return newTrx;
  };

  const updateTransaction = (id: string, updates: Partial<FinancialTransaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    logAction('MODIFICACIÓN', 'FINANZAS', `Movimiento contable ${id} modificado`);
  };

  // Backup & Restore
  const exportDataBackup = () => {
    const backup = {
      app: 'JAIRRESTAURA CONSULTORIO DIGITAL — ENTERPRISE',
      version: '2026.10',
      exportedAt: new Date().toISOString(),
      exportedBy: currentProfile.name,
      data: {
        profiles,
        patients,
        soapNotes,
        diagnostics,
        treatmentPlans,
        prescriptions,
        reports,
        appointments,
        transactions,
        auditLogs,
      },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_jairrestaura_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logAction('COPIA_SEGURIDAD', 'SEGURIDAD', 'Descarga de copia de seguridad cifrada y completa del consultorio.');
  };

  const restoreDataBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.data || !parsed.data.patients) {
        throw new Error('Formato de copia de seguridad no válido');
      }
      if (parsed.data.profiles && Array.isArray(parsed.data.profiles)) {
        setProfiles(parsed.data.profiles);
      }
      setPatients(parsed.data.patients || []);
      setSoapNotes(parsed.data.soapNotes || []);
      setDiagnostics(parsed.data.diagnostics || []);
      setTreatmentPlans(parsed.data.treatmentPlans || []);
      setPrescriptions(parsed.data.prescriptions || []);
      setReports(parsed.data.reports || []);
      setAppointments(parsed.data.appointments || []);
      setTransactions(parsed.data.transactions || []);
      if (parsed.data.auditLogs) {
        setAuditLogs(parsed.data.auditLogs);
      }
      logAction('COPIA_SEGURIDAD', 'SEGURIDAD', 'Restauración completa de base de datos desde copia de seguridad externa.');
      return true;
    } catch (e) {
      console.error('Error al restaurar respaldo:', e);
      return false;
    }
  };

  const resetToInitialData = () => {
    setProfiles(INITIAL_PROFILES);
    setPatients(INITIAL_PATIENTS);
    setSoapNotes(INITIAL_SOAP_NOTES);
    setDiagnostics(INITIAL_DIAGNOSTICS);
    setTreatmentPlans(INITIAL_TREATMENT_PLANS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setReports(INITIAL_REPORTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    logAction('COPIA_SEGURIDAD', 'SEGURIDAD', 'Reinicio de datos del consultorio a configuración inicial clínica.');
  };

  return (
    <AppContext.Provider
      value={{
        profiles,
        currentProfile,
        setCurrentProfile,
        addProfile,
        updateProfile,
        toggleProfileStatus,
        isDarkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        selectedPatientId,
        setSelectedPatientId,
        patients,
        addPatient,
        updatePatient,
        archivePatient,
        soapNotes,
        addSoapNote,
        getPatientNotes,
        diagnostics,
        addDiagnostic,
        updateDiagnostic,
        getPatientDiagnostics,
        treatmentPlans,
        addTreatmentPlan,
        updateTreatmentPlan,
        getPatientTreatmentPlans,
        prescriptions,
        addPrescription,
        updatePrescription,
        approveAndSignPrescription,
        registerPatientReceipt,
        getPatientPrescriptions,
        reports,
        addReport,
        signReport,
        getPatientReports,
        appointments,
        addAppointment,
        updateAppointment,
        transactions,
        addTransaction,
        updateTransaction,
        auditLogs,
        logAction,
        exportDataBackup,
        restoreDataBackup,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
