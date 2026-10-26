export type UserRole = 'psiquiatra' | 'psicologo' | 'orientador' | 'administrador';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  registrationNumber: string; // Registro Médico / Tarjeta Profesional / ReTHUS
  specialty: string;
  email: string;
  phone?: string;
  status: 'Activo' | 'Inactivo';
  canSignPrescriptions?: boolean; // Solo activo para Médicos Especialistas en Psiquiatría habilitados
  admissionDate?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DocumentType = 'CC' | 'TI' | 'CE' | 'Pasaporte' | 'RC' | 'PEP';
export type PatientStatus = 'Activo' | 'En Pausa' | 'Egresado' | 'Archivado';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface LegalGuardian {
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  id: string; // e.g. PAC-2026-001
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'Femenino' | 'Masculino' | 'Otro' | 'Prefiero no reportar';
  phone: string;
  whatsapp?: string;
  email: string;
  city: string;
  department: string;
  address?: string;
  occupation?: string;
  civilStatus?: 'Soltero/a' | 'Casado/a' | 'Unión Libre' | 'Separado/a' | 'Viudo/a';
  emergencyContact: EmergencyContact;
  legalGuardian?: LegalGuardian;
  admissionDate: string;
  status: PatientStatus;
  hasSignedConsent: boolean;
  consentSignedDate?: string;
  consentMethod?: 'Firma Digital' | 'Manuscrita Escaneada' | 'Aceptación Electrónica Verificada';
  responsibleProfessionalId: string;
  responsibleProfessionalName: string;
  allergies: string[];
  medicalAlerts: string[];
  generalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NoteType = 'psicologia_soap' | 'psiquiatria_interconsulta' | 'orientacion_pastoral' | 'evolucion_general';

export interface SoapNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // ISO
  type: NoteType;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorRegistration: string;
  // SOAP components
  subjective: string; // Motivo de consulta y lo que el paciente relata
  objective: string; // Examen mental, observaciones conductuales, signos
  assessment: string; // Análisis clínico o reflexiones terapéuticas
  plan: string; // Plan de acción, tareas, próxima cita
  // Additional clinical fields
  mentalExam?: {
    porteYActitud?: string;
    conciencia?: string;
    orientacion?: string;
    atencionYMemoria?: string;
    pensamiento?: string;
    afecto?: string;
    sensoPercepcion?: string;
    juicioYRaciocinio?: string;
    insight?: string;
  };
  riskFactors?: string[];
  protectiveFactors?: string[];
  remissions?: string;
  hashIntegrity: string;
  createdAt: string;
}

export type DiagnosticType = 'Principal' | 'Secundario';
export type DiagnosticStatus = 'Confirmado' | 'Provisional' | 'Diferencial' | 'Pendiente de Evaluación' | 'En Remisión';

export interface DiagnosticRecord {
  id: string;
  patientId: string;
  patientName: string;
  codeCIE10: string; // e.g. F32.1
  codeCIE11?: string; // e.g. 6A71
  description: string;
  type: DiagnosticType;
  status: DiagnosticStatus;
  dateIdentified: string;
  professionalId: string;
  professionalName: string;
  professionalRole: UserRole;
  clinicalEvidence: string;
  observations?: string;
  remissionsRequired?: string;
  createdAt: string;
  updatedAt: string;
}

export type TreatmentStatus = 'Activo' | 'En Revisión' | 'Cumplido' | 'Suspendido';
export type AttentionModality = 'Virtual' | 'Presencial' | 'Híbrida';

export interface TreatmentGoal {
  id: string;
  description: string;
  indicator: string;
  targetProgressPercent: number;
  currentProgressPercent: number;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  approach: string; // e.g. Terapia Cognitivo-Conductual, Logoterapia, Acompañamiento Integral
  modality: AttentionModality;
  frequency: string; // e.g. Semanal (50 min)
  goals: TreatmentGoal[];
  agreedTasks: string[];
  sessionIndicators: string;
  reviewDate: string;
  status: TreatmentStatus;
  professionalId: string;
  professionalName: string;
  professionalRole: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type PrescriptionStatus = 
  | 'Borrador' 
  | 'Pendiente de revisión clínica' 
  | 'Observado o requiere corrección' 
  | 'Aprobado por el profesional' 
  | 'Firmado' 
  | 'Emitido' 
  | 'Anulado'
  // Compatibilidad hacia atrás con registros previos
  | 'Pendiente de Revisión Psiquiatra' 
  | 'Observada / Devuelta' 
  | 'Aprobada y Firmada por Psiquiatra' 
  | 'Emitida al Paciente' 
  | 'Suspendida / Finalizada';

export interface PrescribedMedicationItem {
  id: string;
  genericName: string;
  commercialName?: string;
  concentration: string; // e.g. 50 mg
  pharmaceuticalForm: string; // e.g. Tableta, Cápsula, Solución oral
  dosage: string; // e.g. 1 tableta
  route: string; // e.g. Oral
  frequency: string; // e.g. Cada 24 horas (en la noche)
  duration: string; // e.g. 30 días
  totalQuantity: string; // e.g. 30 (Treinta) tabletas
  particularInstructions?: string;
  relevantPrecautions?: string;
  startDate: string;
  endDate?: string;
}

export interface PatientReceiptRecord {
  patientOrGuardianName: string;
  documentNumber: string;
  receivedDate: string;
  signatureMethod: 'Digital' | 'Manuscrita en Físico' | 'Código de Verificación OTP';
  notes?: string;
  integrityConfirmed: boolean;
}

export interface PsychiatricPrescription {
  id: string; // e.g. RX-2026-0045
  version: number;
  patientId: string;
  patientName: string;
  patientDocumentType: DocumentType;
  patientDocumentNumber: string;
  patientBirthDate: string;
  issueDate: string;
  expiryDate: string;
  status: PrescriptionStatus;
  diagnosisLinked: string; // e.g. F32.1 Trastorno depresivo recurrente
  clinicalJustification: string;
  items: PrescribedMedicationItem[];
  // Prescribing Psychiatrist info
  psychiatristName: string;
  psychiatristRegistration: string; // ReTHUS / Registro Médico
  psychiatristSpecialty: string; // "Médico Especialista en Psiquiatría"
  psychiatristInstitution: string; // "JAIRRESTAURA Consultorio Digital"
  psychiatristSignatureHash?: string;
  signedAt?: string;
  verificationMethod?: 'Firma Digital Certificada' | 'Acreditación Biométrica / OTP' | 'Validación Manual en Físico';
  verificationCode?: string;
  observations?: string;
  observationNotes?: string; // Observaciones de corrección cuando está Observada
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  historyOfChanges?: {
    timestamp: string;
    author: string;
    action: string;
    details: string;
  }[];
  patientReceipt?: PatientReceiptRecord;
  createdAt: string;
  updatedAt: string;
}

export type ReportType = 
  | 'Evaluación Psicológica' 
  | 'Seguimiento y Evolución' 
  | 'Remisión a Psiquiatría / Medicina' 
  | 'Resumen de Historia Clínica' 
  | 'Cierre Terapéutico' 
  | 'Constancia de Asistencia';

export interface ClinicalReport {
  id: string;
  patientId: string;
  patientName: string;
  patientDocument: string;
  type: ReportType;
  date: string;
  purpose: string;
  addressedTo: string; // e.g. A quien interese, EPS, Dr. Psiquiatra
  professionalId: string;
  professionalName: string;
  professionalRole: UserRole;
  professionalRegistration: string;
  backgroundSummary: string;
  clinicalFindings: string;
  diagnosticAppraisal: string;
  therapeuticInterventions: string;
  recommendations: string;
  remissions: string;
  // Obligatory Pharmacological Section
  hasPharmacologicalTreatment: boolean;
  linkedPrescriptionId?: string;
  pharmacologicalNotes?: string;
  isValidatedPrescription: boolean;
  validationWarning?: string; // Text if no valid formula exists
  status: 'Borrador' | 'Validado y Firmado';
  signedAt?: string;
  signatureHash?: string;
  createdAt: string;
}

export type AppointmentStatus = 'Programada' | 'Confirmada' | 'En Curso' | 'Realizada' | 'Cancelada' | 'No Asistió';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  professionalId: string;
  professionalName: string;
  professionalRole: UserRole;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  modality: AttentionModality;
  meetingLink?: string;
  location?: string;
  status: AppointmentStatus;
  cost: number;
  paymentStatus: 'Pendiente' | 'Pagado' | 'Abonado';
  notes?: string;
  postSessionFollowUp?: string;
  createdAt: string;
}

export type TransactionType = 'Ingreso' | 'Gasto';
export type PaymentMethod = 'Bancolombia' | 'Nequi' | 'Daviplata' | 'PSE' | 'Efectivo' | 'Tarjeta de Crédito' | 'Transferencia';
export type TransactionStatus = 'Pagado' | 'Pendiente' | 'Abonado' | 'Anulado';

export interface FinancialTransaction {
  id: string; // e.g. TRX-2026-0120
  type: TransactionType;
  concept: string;
  category: string; // e.g. Consulta Psicológica, Consulta Psiquiatría, Paquete Terapéutico, Software, etc.
  amount: number;
  paidAmount: number;
  date: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  patientId?: string;
  patientName?: string;
  voucherNumber?: string;
  notes?: string;
  isReceivable: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'CREACIÓN' | 'CONSULTA' | 'MODIFICACIÓN' | 'FIRMA_DIGITAL' | 'EXPORTACIÓN_PDF' | 'CAMBIO_ESTADO' | 'COPIA_SEGURIDAD';
  module: 'PACIENTES' | 'HISTORIA_CLINICA' | 'DIAGNOSTICOS' | 'TRATAMIENTOS' | 'PRESCRIPCIONES' | 'INFORMES' | 'AGENDA' | 'FINANZAS' | 'SEGURIDAD' | 'PASTORAL' | 'PSICOTERAPIA';
  details: string;
  patientCodeOrId?: string;
  ipAddress?: string;
}

export interface Pastor {
  id: string; // e.g. PAS-2026-001
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  churchName: string; // Iglesia o congregación
  ministerialRole: string; // e.g. Pastor Principal, Pastor Asociado, Consejero Pastoral, Capellán, etc.
  denomination?: string;
  phone: string;
  email: string;
  city: string;
  department?: string;
  address?: string;
  pastoralFocus: string[]; // e.g. ['Duelo y Pérdida', 'Familia y Matrimonio', 'Acompañamiento Espiritual']
  status: 'Activo' | 'Inactivo';
  linkedUserId?: string; // Vinculación opcional con perfil de orientador para login
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export * from './psychotherapy';

