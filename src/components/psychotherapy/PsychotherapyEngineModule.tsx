import React, { useState } from 'react';
import {
  Brain,
  BookOpen,
  FileCode,
  Play,
  Activity,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Heart,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  PhoneCall,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  ExternalLink,
  X,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { PSYCHOTHERAPY_PROTOCOLS } from '../../data/psychotherapyProtocols';
import {
  PsychotherapyModality,
  ClinicalProtocol,
  ClinicalCaseFormulation,
  GuidedSessionRecord,
  InterSessionRecord,
  SafetyTriageRecord,
} from '../../types';
import { CaseFormulationModal } from './CaseFormulationModal';
import { GuidedSessionRunnerModal } from './GuidedSessionRunnerModal';
import { SafetyTriageModal } from './SafetyTriageModal';

export const PsychotherapyEngineModule: React.FC = () => {
  const {
    patients,
    caseFormulations,
    guidedSessions,
    interSessionLogs,
    safetyTriages,
    currentProfile,
    addInterSessionRecord,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'biblioteca' | 'formulador' | 'conductor' | 'seguimiento' | 'triaje'
  >('biblioteca');

  // Modals state
  const [isFormulationModalOpen, setIsFormulationModalOpen] = useState(false);
  const [selectedFormulation, setSelectedFormulation] = useState<ClinicalCaseFormulation | null>(null);
  const [isSessionRunnerOpen, setIsSessionRunnerOpen] = useState(false);
  const [isSafetyTriageOpen, setIsSafetyTriageOpen] = useState(false);

  // Filter state
  const [selectedModalityFilter, setSelectedModalityFilter] = useState<string>('todos');
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>('todos');
  const [expandedProtocolId, setExpandedProtocolId] = useState<PsychotherapyModality | null>('tcc');
  const [protocolSubSection, setProtocolSubSection] = useState<'guia' | 'ejercicios' | 'preguntas' | 'evidencia'>('guia');

  // Quick check-in intersession state
  const [isQuickCheckInOpen, setIsQuickCheckInOpen] = useState(false);
  const [checkInPatientId, setCheckInPatientId] = useState(patients[0]?.id || '');
  const [checkInMood, setCheckInMood] = useState(6);
  const [checkInEmotion, setCheckInEmotion] = useState('Tranquilidad con leve cansancio');
  const [checkInExercise, setCheckInExercise] = useState('Espacio de Respiración de 3 Minutos');
  const [checkInDistress, setCheckInDistress] = useState(3);
  const [checkInNotes, setCheckInNotes] = useState('Pude realizar el ejercicio a media tarde antes de la jornada laboral.');
  const [checkInEscalation, setCheckInEscalation] = useState(false);

  const handleSaveQuickCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === checkInPatientId);
    if (!pat) return;

    addInterSessionRecord({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      date: new Date().toISOString().slice(0, 10),
      moodScore: checkInMood,
      primaryEmotion: checkInEmotion,
      exerciseCompleted: checkInExercise,
      reflectionNotes: checkInNotes,
      distressLevel: checkInDistress,
      escalationAlert: checkInEscalation,
      status: 'Completado',
    });

    setIsQuickCheckInOpen(false);
  };

  const filteredFormulations = caseFormulations.filter((f) => {
    const matchesPatient = selectedPatientFilter === 'todos' || f.patientId === selectedPatientFilter;
    const matchesModality = selectedModalityFilter === 'todos' || f.modalityPrimary === selectedModalityFilter;
    return matchesPatient && matchesModality;
  });

  const filteredSessions = guidedSessions.filter((s) => {
    const matchesPatient = selectedPatientFilter === 'todos' || s.patientId === selectedPatientFilter;
    const matchesModality = selectedModalityFilter === 'todos' || s.modality === selectedModalityFilter;
    return matchesPatient && matchesModality;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 backdrop-blur-xs border border-teal-500/30">
              <Brain className="w-3.5 h-3.5" />
              Motor de Apoyo Psicoterapéutico Avanzado • JAIRRESTAURA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Soporte Clínico Estructurado & Supervisado
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Herramienta de decisión clínica basada en evidencia empírica para la conceptualización funcional de casos, conducción de sesiones guiadas (TCC, ACT, DBT, Trauma, Mindfulness), seguimiento inter-sesión y triaje de seguridad. Sujeto a supervisión y validación por profesional competente.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSafetyTriageOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition-all shadow-xs"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Triaje de Riesgo
            </button>
            <button
              onClick={() => setIsSessionRunnerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-extrabold shadow-lg hover:shadow-teal-500/30 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Iniciar Sesión Guiada
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Protocolos Validados</span>
            <span className="text-lg font-bold text-teal-300">8 Modalidades</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Formulaciones Activas</span>
            <span className="text-lg font-bold text-white">{caseFormulations.length} casos</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Sesiones Conducidas</span>
            <span className="text-lg font-bold text-white">{guidedSessions.length} registradas</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Seguimientos Inter-sesión</span>
            <span className="text-lg font-bold text-teal-300">{interSessionLogs.length} auto-registros</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('biblioteca')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'biblioteca'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Biblioteca de Protocolos (8)
        </button>

        <button
          onClick={() => setActiveTab('formulador')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'formulador'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          Formulador Clínico & Metas SMART ({caseFormulations.length})
        </button>

        <button
          onClick={() => setActiveTab('conductor')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'conductor'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Play className="w-4 h-4" />
          Conductor de Sesión Guiada ({guidedSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('seguimiento')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'seguimiento'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Seguimiento Inter-Sesiones ({interSessionLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('triaje')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'triaje'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Triaje de Riesgo & Crisis ({safetyTriages.length})
        </button>
      </div>

      {/* TAB 1: BIBLIOTECA DE PROTOCOLOS */}
      {activeTab === 'biblioteca' && (
        <div className="space-y-6">
          {/* Modality Chips Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PSYCHOTHERAPY_PROTOCOLS.map((proto) => {
              const isSelected = expandedProtocolId === proto.id;
              return (
                <button
                  key={proto.id}
                  onClick={() => setExpandedProtocolId(proto.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="font-extrabold text-xs block mb-0.5">{proto.shortName}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{proto.name}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Protocol View */}
          {expandedProtocolId && (() => {
            const proto = PSYCHOTHERAPY_PROTOCOLS.find((p) => p.id === expandedProtocolId);
            if (!proto) return null;

            return (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Protocol Header */}
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300">
                          {proto.shortName}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{proto.name}</h2>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{proto.tagline}</p>
                      <p className="text-xs text-slate-500 mt-2 max-w-4xl">{proto.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedFormulation(null);
                          setIsFormulationModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Crear Formulación con {proto.shortName}
                      </button>
                    </div>
                  </div>

                  {/* Clinical Indications & Contraindications Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">
                        Indicaciones Principales:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-emerald-800 dark:text-emerald-300 text-[11px]">
                        {proto.indications.map((ind, i) => (
                          <li key={i}>{ind}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                      <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">
                        Limitaciones Clínicas:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-amber-800 dark:text-amber-300 text-[11px]">
                        {proto.limitations.map((lim, i) => (
                          <li key={i}>{lim}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
                      <span className="font-bold text-red-900 dark:text-red-200 block mb-1">
                        Contraindicaciones Estrictas:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-red-800 dark:text-red-300 text-[11px]">
                        {proto.contraindications.map((ci, i) => (
                          <li key={i}>{ci}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Sub-section Switcher */}
                <div className="px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/20 flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setProtocolSubSection('guia')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      protocolSubSection === 'guia'
                        ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Guía Paso a Paso ({proto.stepByStepGuide.length} pasos)
                  </button>
                  <button
                    onClick={() => setProtocolSubSection('ejercicios')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      protocolSubSection === 'ejercicios'
                        ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Fichas de Ejercicios Prácticos ({proto.practicalExercises.length})
                  </button>
                  <button
                    onClick={() => setProtocolSubSection('preguntas')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      protocolSubSection === 'preguntas'
                        ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Preguntas Terapéuticas Abiertas
                  </button>
                  <button
                    onClick={() => setProtocolSubSection('evidencia')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      protocolSubSection === 'evidencia'
                        ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Base de Evidencia & Citas ({proto.evidenceBase.length})
                  </button>
                </div>

                {/* Sub-section Content */}
                <div className="p-6">
                  {/* GUIA PASO A PASO */}
                  {protocolSubSection === 'guia' && (
                    <div className="space-y-4">
                      {proto.stepByStepGuide.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                              {step.stepNumber}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{step.title}</h3>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
                            <strong>Objetivo:</strong> {step.objective}
                          </p>
                          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 mb-2">
                            <span className="font-semibold block">Acciones Clínicas:</span>
                            <ul className="list-disc pl-5 space-y-0.5">
                              {step.clinicalActions.map((act, idx) => (
                                <li key={idx}>{act}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 text-xs">
                            <strong>Consejo del Terapeuta:</strong> {step.therapistGuidance}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* EJERCICIOS PRACTICOS */}
                  {protocolSubSection === 'ejercicios' && (
                    <div className="space-y-4">
                      {proto.practicalExercises.map((ex) => (
                        <div
                          key={ex.id}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ex.title}</h3>
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-semibold">
                              Plantilla Clínica
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <strong>Objetivo:</strong> {ex.objective}
                          </p>
                          <div className="text-xs space-y-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Instrucciones:</span>
                            <ol className="list-decimal pl-5 space-y-0.5 text-slate-600 dark:text-slate-400">
                              {ex.instructions.map((ins, i) => (
                                <li key={i}>{ins}</li>
                              ))}
                            </ol>
                          </div>

                          {/* Template fields preview */}
                          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                              Campos de la Hoja de Trabajo:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              {ex.templateFields.map((field) => (
                                <div key={field.key} className="space-y-1">
                                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                                    {field.label}
                                  </label>
                                  <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    readOnly
                                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-2 text-slate-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* PREGUNTAS TERAPEUTICAS */}
                  {protocolSubSection === 'preguntas' && (
                    <div className="space-y-4">
                      {proto.openTherapeuticQuestions.map((cat, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                        >
                          <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wide mb-2">
                            {cat.category}
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                            {cat.questions.map((q, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-teal-600 font-bold">•</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* EVIDENCIA CIENTIFICA */}
                  {protocolSubSection === 'evidencia' && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {proto.evidenceBase.map((ev, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                          >
                            <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">
                              {ev.authors} ({ev.year})
                            </span>
                            <span className="italic text-slate-700 dark:text-slate-300 block my-1">
                              "{ev.title}"
                            </span>
                            <span className="text-slate-500 block">{ev.journalOrPublisher}</span>
                            <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[11px] font-semibold">
                              {ev.evidenceLevel}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          Adaptación Cultural & Contexto Colombiano:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400">
                          {proto.culturalAdaptationNotes}
                        </p>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mt-2">
                          Requisitos de Supervisión:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400">
                          {proto.supervisionRequirements}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: FORMULADOR CLÍNICO */}
      {activeTab === 'formulador' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Formulaciones Clínicas & Metas SMART
              </h2>
              <p className="text-xs text-slate-500">
                Matriz funcional de las 4 P's con seguimiento longitudinal del progreso
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedFormulation(null);
                setIsFormulationModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Nueva Formulación de Caso
            </button>
          </div>

          {/* Formulations List */}
          <div className="space-y-4">
            {caseFormulations.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-extrabold text-xs uppercase">
                      {form.modalityPrimary}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {form.patientName} ({form.patientId})
                      </h3>
                      <span className="text-xs text-slate-400">
                        Formulado el {form.date} por {form.professionalName} • Revisión: {form.reviewDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {form.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedFormulation(form);
                        setIsFormulationModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Editar
                    </button>
                  </div>
                </div>

                {/* 4 P's Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Predisponentes:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">{form.predisposingFactors}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Precipitantes:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">{form.precipitatingFactors}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Mantenedores:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">{form.maintainingFactors}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Protectores:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">{form.protectiveFactors}</p>
                  </div>
                </div>

                {/* Hypothesis */}
                <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 text-xs">
                  <span className="font-bold text-teal-900 dark:text-teal-200 block mb-1">
                    Hipótesis Clínica Explicativa:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{form.workingHypothesis}</p>
                </div>

                {/* SMART Goals with Progress Bars */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Avance de Metas SMART:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {form.smartGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {goal.description}
                          </span>
                          <span className="font-bold text-teal-600 dark:text-teal-400 shrink-0">
                            {goal.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-teal-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${goal.progressPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Indicador: {goal.indicator}</span>
                          <span>Meta: {goal.targetDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONDUCTOR DE SESIÓN */}
      {activeTab === 'conductor' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Sesiones Clínicas Guiadas Conducidas
              </h2>
              <p className="text-xs text-slate-500">
                Flujo paso a paso con registro de SUDS pre y post, insights y control de desregulación
              </p>
            </div>
            <button
              onClick={() => setIsSessionRunnerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Nueva Sesión en Vivo
            </button>
          </div>

          <div className="space-y-4">
            {guidedSessions.map((ses) => (
              <div
                key={ses.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-extrabold text-sm flex items-center justify-center">
                      #{ses.sessionNumber}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {ses.patientName} ({ses.patientId})
                      </h3>
                      <span className="text-xs text-slate-400">
                        {ses.date} • {ses.professionalName} • Enfoque: {ses.modality.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center gap-2">
                      <span>SUDS:</span>
                      <span className="text-red-500">{ses.preSuds}/10</span>
                      <span>→</span>
                      <span className="text-emerald-500">{ses.postSuds}/10</span>
                    </div>
                    {ses.wasPausedForDysregulation && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        Pausa Grounding
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Técnica Aplicada:
                    </span>
                    <p className="font-semibold text-teal-700 dark:text-teal-300">{ses.techniqueApplied}</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{ses.techniqueObservations}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Insight del Consultante:
                    </span>
                    <p className="italic text-slate-700 dark:text-slate-300">"{ses.patientInsights}"</p>
                  </div>
                </div>

                {ses.voluntaryHomework.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Tareas Voluntarias Inter-sesión Acordadas:
                    </span>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-600 dark:text-slate-400">
                      {ses.voluntaryHomework.map((hw, i) => (
                        <li key={i}>{hw}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SEGUIMIENTO INTER-SESIONES */}
      {activeTab === 'seguimiento' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Seguimiento Inter-Sesiones & Registro Emocional
              </h2>
              <p className="text-xs text-slate-500">
                Monitoreo continuo de tareas, estado de ánimo y detección de alertas
              </p>
            </div>
            <button
              onClick={() => setIsQuickCheckInOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Nuevo Registro Emocional
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interSessionLogs.map((log) => (
              <div
                key={log.id}
                className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs space-y-3 ${
                  log.escalationAlert
                    ? 'border-red-400 dark:border-red-900/60'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {log.patientName}
                  </span>
                  <span className="text-xs text-slate-400">{log.date}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <div className="flex items-center gap-2">
                    {log.moodScore >= 7 ? (
                      <Smile className="w-5 h-5 text-emerald-500" />
                    ) : log.moodScore >= 4 ? (
                      <Meh className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Frown className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <span className="font-bold block text-slate-800 dark:text-slate-200">
                        Ánimo: {log.moodScore}/10
                      </span>
                      <span className="text-[11px] text-slate-500">{log.primaryEmotion}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">Malestar:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{log.distressLevel}/10</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Ejercicio practicado: {log.exerciseCompleted}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] italic">
                    "{log.reflectionNotes}"
                  </p>
                </div>

                {log.escalationAlert && (
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-[11px] font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Alerta de Escalamiento Emocional Registrada
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TRIAJE DE RIESGO & CRISIS */}
      {activeTab === 'triaje' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Protocolo de Seguridad, Triaje de Riesgo & Manejo de Crisis
              </h2>
              <p className="text-xs text-slate-500">
                Estratificación de riesgo vital, líneas de emergencia de Colombia y contratos de seguridad
              </p>
            </div>
            <button
              onClick={() => setIsSafetyTriageOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              Evaluar Nuevo Triaje de Riesgo
            </button>
          </div>

          {/* Legal and Emergency Banner */}
          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold">
                  Cláusula Obligatoria de Límites del Servicio & Urgencias Sanitarias
                </h3>
                <p>
                  JAIRRESTAURA Consultorio Digital es una plataforma ambulatoria programada de atención en salud mental y psiquiatría. No ofrece servicio de urgencias continuas 24/7 ni monitoreo en tiempo real de emergencias agudas. Ante sospecha o intento suicida inminente, active de inmediato las rutas institucionales de emergencia en Colombia.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900">
                <span className="font-bold block text-sm text-teal-700 dark:text-teal-400">Línea 106</span>
                <span className="text-[11px] text-slate-500">"El poder de ser escuchado" (Nacional)</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900">
                <span className="font-bold block text-sm text-indigo-700 dark:text-indigo-400">Línea 192</span>
                <span className="text-[11px] text-slate-500">MinSalud Salud Mental Nacional</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900">
                <span className="font-bold block text-sm text-purple-700 dark:text-purple-400">018000 112137</span>
                <span className="text-[11px] text-slate-500">Línea Púrpura (Mujeres / Violencia)</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900">
                <span className="font-bold block text-sm text-red-600 dark:text-red-400">123</span>
                <span className="text-[11px] text-slate-500">Número Único de Seguridad y Emergencias</span>
              </div>
            </div>
          </div>

          {/* Historic Triage Records */}
          <div className="space-y-4">
            {safetyTriages.map((tri) => (
              <div
                key={tri.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
                        tri.riskLevel === 'Rojo'
                          ? 'bg-red-600'
                          : tri.riskLevel === 'Naranja'
                          ? 'bg-amber-600'
                          : tri.riskLevel === 'Amarillo'
                          ? 'bg-yellow-600'
                          : 'bg-emerald-600'
                      }`}
                    >
                      Riesgo {tri.riskLevel}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {tri.patientName} ({tri.patientId})
                      </h3>
                      <span className="text-xs text-slate-400">
                        Evaluado el {new Date(tri.assessedAt).toLocaleString()} por {tri.professionalName}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Ideación: {tri.suicidalIdeationLevel}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                    <span className="font-bold text-red-900 dark:text-red-200 block mb-1">
                      Factores de Riesgo Identificados:
                    </span>
                    <ul className="list-disc pl-5 space-y-0.5 text-red-800 dark:text-red-300">
                      {tri.riskFactorsPresent.map((rf, i) => (
                        <li key={i}>{rf}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">
                      Factores Protectores & Anclas:
                    </span>
                    <ul className="list-disc pl-5 space-y-0.5 text-emerald-800 dark:text-emerald-300">
                      {tri.protectiveFactorsPresent.map((pf, i) => (
                        <li key={i}>{pf}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan details */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Plan de Seguridad Acordado: {tri.safetyPlanAgreed ? 'Sí (Firmado)' : 'Pendiente'}
                    </span>
                    <span className="text-slate-500">
                      Contacto Notificado: {tri.emergencyContactInformed ? tri.emergencyContactName : 'No'}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong>Observaciones:</strong> {tri.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Check-in Modal */}
      {isQuickCheckInOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Registrar Check-in Emocional Inter-sesión
              </h3>
              <button onClick={() => setIsQuickCheckInOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickCheckIn} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Paciente</label>
                <select
                  value={checkInPatientId}
                  onChange={(e) => setCheckInPatientId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-800"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Estado de Ánimo (1-10): {checkInMood}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={checkInMood}
                    onChange={(e) => setCheckInMood(parseInt(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Malestar SUDS (0-10): {checkInDistress}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={checkInDistress}
                    onChange={(e) => setCheckInDistress(parseInt(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Emoción Dominante</label>
                <input
                  type="text"
                  value={checkInEmotion}
                  onChange={(e) => setCheckInEmotion(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Ejercicio Completado</label>
                <input
                  type="text"
                  value={checkInExercise}
                  onChange={(e) => setCheckInExercise(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Notas de Reflexión</label>
                <textarea
                  rows={2}
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-800"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={checkInEscalation}
                  onChange={(e) => setCheckInEscalation(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                Marcar Alerta de Escalamiento Emocional
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsQuickCheckInOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Guardar Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Modals */}
      {isFormulationModalOpen && (
        <CaseFormulationModal
          existingFormulation={selectedFormulation}
          onClose={() => {
            setIsFormulationModalOpen(false);
            setSelectedFormulation(null);
          }}
        />
      )}

      {isSessionRunnerOpen && (
        <GuidedSessionRunnerModal
          onClose={() => setIsSessionRunnerOpen(false)}
        />
      )}

      {isSafetyTriageOpen && (
        <SafetyTriageModal
          onClose={() => setIsSafetyTriageOpen(false)}
        />
      )}
    </div>
  );
};
