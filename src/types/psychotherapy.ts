import { UserRole } from './index';

export type PsychotherapyModality =
  | 'tcc'
  | 'act'
  | 'dbt'
  | 'entrevista_motivacional'
  | 'psicoeducacion'
  | 'trauma'
  | 'mindfulness'
  | 'sistemica_pareja';

export interface ProtocolEvidence {
  authors: string;
  year: string;
  title: string;
  journalOrPublisher: string;
  evidenceLevel: string; // e.g. 'Nivel I (Metaanálisis)', 'Guía NICE 2024', 'Ensayos Controlados Aleatorizados'
}

export interface ProtocolStep {
  stepNumber: number;
  title: string;
  objective: string;
  clinicalActions: string[];
  therapistGuidance: string;
}

export interface TherapeuticQuestionCategory {
  category: string;
  questions: string[];
}

export interface PracticalExerciseTemplateField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'scale';
}

export interface PracticalExercise {
  id: string;
  title: string;
  objective: string;
  instructions: string[];
  templateFields: PracticalExerciseTemplateField[];
}

export interface ClinicalProtocol {
  id: PsychotherapyModality;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  clinicalGoals: string[];
  targetPopulation: string[];
  indications: string[];
  limitations: string[];
  contraindications: string[];
  evidenceBase: ProtocolEvidence[];
  stepByStepGuide: ProtocolStep[];
  openTherapeuticQuestions: TherapeuticQuestionCategory[];
  practicalExercises: PracticalExercise[];
  referralCriteria: string[];
  supervisionRequirements: string;
  culturalAdaptationNotes: string;
}

export interface SmartGoal {
  id: string;
  description: string;
  targetDate: string;
  indicator: string;
  progressPercent: number;
}

export interface ClinicalCaseFormulation {
  id: string; // FORM-2026-001
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  professionalRole: UserRole;
  date: string;
  status: 'Activa' | 'En Revisión' | 'Cumplida' | 'Archivada';
  modalityPrimary: PsychotherapyModality;
  secondaryModalities?: PsychotherapyModality[];
  predisposingFactors: string; // Factores predisponentes (biológicos, temperamento, historia de apego)
  precipitatingFactors: string; // Factores precipitantes (gatillantes recientes, pérdidas, eventos estresantes)
  maintainingFactors: string; // Factores mantenedores (conductas de evitación, distorsiones cognitivas, reforzadores)
  protectiveFactors: string; // Factores protectores (fortalezas personales, valores, red de apoyo)
  workingHypothesis: string; // Hipótesis clínica integradora y funcional
  smartGoals: SmartGoal[];
  reviewDate: string;
  aiAssisted?: boolean;
  clinicalValidationNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuidedSessionRecord {
  id: string; // SES-2026-001
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  professionalRole: UserRole;
  date: string;
  sessionNumber: number;
  modality: PsychotherapyModality;
  agendaTopics: string[];
  preSuds: number; // 0 - 10 Subjective Units of Distress Scale
  postSuds: number; // 0 - 10
  consentConfirmed: boolean;
  techniqueApplied: string;
  techniqueObservations: string;
  patientInsights: string;
  wasPausedForDysregulation: boolean;
  pauseReasonAndGroundingApplied?: string;
  voluntaryHomework: string[];
  clinicianSignature: string;
  signedAt: string;
  createdAt: string;
}

export interface InterSessionRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  moodScore: number; // 1-10
  primaryEmotion: string;
  exerciseCompleted: string;
  reflectionNotes: string;
  distressLevel: number; // 0-10
  escalationAlert: boolean;
  alertNotes?: string;
  status: 'Completado' | 'Pendiente' | 'Revisado por Profesional';
  createdAt: string;
}

export type SafetyRiskLevel = 'Verde' | 'Amarillo' | 'Naranja' | 'Rojo';

export interface SafetyPlanData {
  warningSigns: string[];
  internalCoping: string[];
  supportPeople: { name: string; phone: string }[];
  professionalHelp: string[];
  makingEnvironmentSafe: string[];
}

export interface SafetyTriageRecord {
  id: string; // TRI-2026-001
  patientId: string;
  patientName: string;
  assessedAt: string;
  professionalId: string;
  professionalName: string;
  riskLevel: SafetyRiskLevel;
  riskFactorsPresent: string[];
  protectiveFactorsPresent: string[];
  suicidalIdeationLevel:
    | 'Ninguna'
    | 'Pasiva sin plan ni intención'
    | 'Activa con ideación difusa'
    | 'Activa estructurada con plan o intención inminente';
  immediateContainmentSteps: string[];
  emergencyContactInformed: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  referredToEmergencyLine: boolean; // Línea 106 / 192 / Línea Púrpura / 123
  safetyPlanAgreed: boolean;
  safetyPlanDetails: SafetyPlanData;
  notes: string;
  createdAt: string;
}
