import React, { useState } from 'react';
import {
  Play,
  X,
  CheckCircle,
  PauseCircle,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Clock,
  Heart,
  Save,
  CheckSquare,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PsychotherapyModality, GuidedSessionRecord } from '../../types';
import { PSYCHOTHERAPY_PROTOCOLS } from '../../data/psychotherapyProtocols';

interface GuidedSessionRunnerModalProps {
  defaultPatientId?: string | null;
  onClose: () => void;
}

export const GuidedSessionRunnerModal: React.FC<GuidedSessionRunnerModalProps> = ({
  defaultPatientId,
  onClose,
}) => {
  const { patients, currentProfile, addGuidedSession, getPatientSessions } = useApp();

  const [patientId, setPatientId] = useState(defaultPatientId || (patients[0]?.id || ''));
  const selectedPatient = patients.find((p) => p.id === patientId);

  const prevSessions = getPatientSessions(patientId);
  const nextSessionNumber = prevSessions.length + 1;

  const [activeStep, setActiveStep] = useState(1); // 1 to 10
  const [modality, setModality] = useState<PsychotherapyModality>('tcc');
  const activeProtocol = PSYCHOTHERAPY_PROTOCOLS.find((p) => p.id === modality) || PSYCHOTHERAPY_PROTOCOLS[0];

  // Session fields
  const [openingMoodNotes, setOpeningMoodNotes] = useState('Paciente asiste puntual. Manifiesta disposición al trabajo terapéutico.');
  const [agendaInput, setAgendaInput] = useState('Revisión de tarea de autorregistro; Análisis de conflicto laboral; Ensayo de técnica de reestructuración.');
  const [homeworkReview, setHomeworkReview] = useState('Completó 2 de 3 registros solicitados. Manifiesta dificultad para frenar rumiación en la noche.');
  const [focalExploration, setFocalExploration] = useState('Exploración del suceso del martes donde sintió taquicardia al recibir correo de supervisor.');
  const [consentConfirmed, setConsentConfirmed] = useState(true);
  const [techniqueApplied, setTechniqueApplied] = useState('Reestructuración Cognitiva y Búsqueda de Evidencias (RPD)');
  const [techniqueNotes, setTechniqueNotes] = useState('Se detectó distorsión de Lectura de Mente y Catastrofización. Se formuló pensamiento alternativo equilibrado.');
  const [patientInsights, setPatientInsights] = useState('Consultante concluye: "Mis pensamientos no son hechos comprobados; reaccioné antes de verificar los hechos".');
  const [preSuds, setPreSuds] = useState(7);
  const [postSuds, setPostSuds] = useState(3);
  const [voluntaryHomework, setVoluntaryHomework] = useState('1. Practicar pausa consciente de 3 minutos antes de almuerzo; 2. Diligenciar 1 RPD si aparece ansiedad.');

  // Emergency Pause Modal State
  const [isPausedForDysregulation, setIsPausedForDysregulation] = useState(false);
  const [pauseReason, setPauseReason] = useState('Elevación súbita de ansiedad (SUDS > 8) con temblor distal y respiración entrecortada.');
  const [groundingApplied, setGroundingApplied] = useState('Se suspendió la exploración cognitiva y se aplicó protocolo Grounding 5-4-3-2-1 con respiración acompasada 4-7-8 hasta retorno a la ventana de tolerancia.');

  const [isSaved, setIsSaved] = useState(false);

  const steps = [
    { num: 1, letter: 'A', title: 'Apertura & Sintonía' },
    { num: 2, letter: 'B', title: 'Agenda de Sesión' },
    { num: 3, letter: 'C', title: 'Revisión de Tareas' },
    { num: 4, letter: 'D', title: 'Exploración Focal' },
    { num: 5, letter: 'E', title: 'Técnica e Intervención' },
    { num: 6, letter: 'F', title: 'Consentimiento Clínico' },
    { num: 7, letter: 'G', title: 'Aplicación Guiada' },
    { num: 8, letter: 'H', title: 'Vivencia & SUDS' },
    { num: 9, letter: 'I', title: 'Tareas Voluntarias' },
    { num: 10, letter: 'J', title: 'Cierre & Firma' },
  ];

  const handleFinishSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addGuidedSession({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      professionalId: currentProfile.id,
      professionalName: currentProfile.name,
      professionalRole: currentProfile.role,
      date: new Date().toISOString().slice(0, 10),
      sessionNumber: nextSessionNumber,
      modality,
      agendaTopics: agendaInput.split(';').map((s) => s.trim()).filter(Boolean),
      preSuds,
      postSuds,
      consentConfirmed,
      techniqueApplied,
      techniqueObservations: techniqueNotes,
      patientInsights,
      wasPausedForDysregulation: isPausedForDysregulation,
      pauseReasonAndGroundingApplied: isPausedForDysregulation ? `${pauseReason} | ${groundingApplied}` : undefined,
      voluntaryHomework: voluntaryHomework.split(';').map((s) => s.trim()).filter(Boolean),
      clinicianSignature: `${currentProfile.name} — ${currentProfile.title} (${currentProfile.registrationNumber})`,
      signedAt: new Date().toISOString(),
    });

    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Conductor de Sesión Clínica Guiada</h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-800 text-[11px] font-semibold">
                  Sesión #{nextSessionNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Flujo estructurado de 10 pasos con monitoreo SUDS y control de desregulación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Prominent Pause button */}
            <button
              type="button"
              onClick={() => setIsPausedForDysregulation(!isPausedForDysregulation)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isPausedForDysregulation
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
              }`}
            >
              <PauseCircle className="w-4 h-4" />
              {isPausedForDysregulation ? 'Pausa por Desregulación ACTIVA' : 'Pausar si hay Desregulación'}
            </button>

            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-3 border-b border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0">
          <div className="flex items-center justify-between min-w-[620px] gap-1">
            {steps.map((st) => (
              <button
                key={st.num}
                type="button"
                onClick={() => setActiveStep(st.num)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeStep === st.num
                    ? 'bg-teal-600 text-white shadow-xs'
                    : activeStep > st.num
                    ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                  {st.letter}
                </span>
                <span className="whitespace-nowrap">{st.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dysregulation Alert Banner if active */}
        {isPausedForDysregulation && (
          <div className="bg-amber-500 text-slate-950 px-6 py-3 shrink-0 flex items-start justify-between gap-3 font-medium text-xs">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">
                  Sesión pausada para estabilización y contención somática
                </span>
                Se ha detenido la exploración cognitiva o el recuerdo doloroso. Proceda con enraizamiento 5-4-3-2-1, respiración acompasada y contacto con el presente seguro.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPausedForDysregulation(false)}
              className="px-3 py-1 bg-slate-900 text-white rounded-lg font-bold text-xs shrink-0"
            >
              Reanudar Flujo
            </button>
          </div>
        )}

        {/* Main Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Step 1: Apertura & Sintonía */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso A — Apertura, Sintonía Vincular & Chequeo Inicial
                  </h3>
                  <p className="text-slate-500">
                    Establecer contacto cálido, evaluar estado afectivo inicial y confirmar asistencia.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  Paso 1 de 10
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Paciente en Consulta *
                  </label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enfoque Psicoterapéutico de la Sesión *
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as PsychotherapyModality)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-xs"
                  >
                    {PSYCHOTHERAPY_PROTOCOLS.map((proto) => (
                      <option key={proto.id} value={proto.id}>
                        {proto.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas de Apertura y Observación de Entrada
                </label>
                <textarea
                  rows={4}
                  value={openingMoodNotes}
                  onChange={(e) => setOpeningMoodNotes(e.target.value)}
                  placeholder="¿Cómo llega el paciente hoy? Porte, contacto visual, velocidad del habla, energía vital..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Step 2: Agenda */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso B — Establecimiento Colaborativo de la Agenda
                  </h3>
                  <p className="text-slate-500">
                    Construir conjuntamente el temario de los 50 minutos para evitar divagaciones improductivas.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  Paso 2 de 10
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Temas Acordados para la Sesión (separados por punto y coma) *
                </label>
                <textarea
                  rows={3}
                  value={agendaInput}
                  onChange={(e) => setAgendaInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-200 text-xs">
                <span className="font-bold block mb-1">Guía del Terapeuta ({activeProtocol.shortName}):</span>
                Pregunte: "¿Qué asunto o situación de esta semana es prioritario que abordemos hoy para que sientas que esta sesión valió la pena?".
              </div>
            </div>
          )}

          {/* Step 3: Revisión de Tareas */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso C — Revisión de Tareas & Práctica Inter-sesiones
                  </h3>
                  <p className="text-slate-500">
                    Validar el esfuerzo inter-sesión, normalizar tropiezos y reforzar la autoeficacia.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  Paso 3 de 10
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Revisión de Tareas y Aprendizajes Obtenidos
                </label>
                <textarea
                  rows={4}
                  value={homeworkReview}
                  onChange={(e) => setHomeworkReview(e.target.value)}
                  placeholder="¿Pudo practicar el ejercicio acordado? ¿Qué obstáculos surgieron? ¿Qué aprendió de sí mismo al intentarlo?"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Step 4: Exploración Focal */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso D — Exploración Focalizada del Motivo o Estresor
                  </h3>
                  <p className="text-slate-500">
                    Delimitar el suceso específico analizando la interacción entre situación, emoción y cognición.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  Paso 4 de 10
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción del Suceso / Problema Foco de la Sesión
                </label>
                <textarea
                  rows={4}
                  value={focalExploration}
                  onChange={(e) => setFocalExploration(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Sample open questions from protocol */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  Preguntas Guiadas Recomendadas ({activeProtocol.shortName}):
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                  {activeProtocol.openTherapeuticQuestions[0]?.questions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Step 5: Selección de Técnica */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso E — Selección Colaborativa de la Técnica o Intervención
                  </h3>
                  <p className="text-slate-500">
                    Elegir el ejercicio o herramienta basada en evidencia más apropiada para el foco.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  Paso 5 de 10
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Técnica Seleccionada *
                </label>
                <input
                  type="text"
                  value={techniqueApplied}
                  onChange={(e) => setTechniqueApplied(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                />
              </div>

              {/* Protocol Exercises Quick Selection */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ejercicios Estructurados del Protocolo ({activeProtocol.name}):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProtocol.practicalExercises.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => setTechniqueApplied(ex.title)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        techniqueApplied === ex.title
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-bold block mb-1">{ex.title}</span>
                      <p className="text-[11px] opacity-80">{ex.objective}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Consentimiento */}
          {activeStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso F — Verificación de Consentimiento Informado & Disposición
                  </h3>
                  <p className="text-slate-500">
                    Confirmar la disposición voluntaria del consultante antes de proceder con el ejercicio vivencial.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  Paso 6 de 10
                </span>
              </div>

              <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentConfirmed}
                    onChange={(e) => setConsentConfirmed(e.target.checked)}
                    className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div className="text-xs text-teal-950 dark:text-teal-200">
                    <span className="font-bold block text-sm mb-0.5">
                      Consentimiento Verbal Explícito Verificado en Sesión
                    </span>
                    El paciente comprende el propósito del ejercicio "{techniqueApplied}", acepta participar de forma voluntaria y sabe que puede detenerse en cualquier momento si siente incomodidad excesiva.
                  </div>
                </label>
              </div>

              {/* SUDS Pre measurement */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-slate-100">
                    Escala Subjetiva de Malestar (SUDS PRE-TÉCNICA): {preSuds} / 10
                  </label>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    {preSuds >= 8 ? 'Malestar Severo' : preSuds >= 5 ? 'Malestar Moderado' : 'Malestar Leve'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={preSuds}
                  onChange={(e) => setPreSuds(parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>0 - Calma absoluta</span>
                  <span>5 - Malestar notable</span>
                  <span>10 - Desbordamiento máximo</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Aplicación Guiada */}
          {activeStep === 7 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso G — Aplicación Guiada de la Técnica en Vivo
                  </h3>
                  <p className="text-slate-500">
                    Acompañar paso a paso la ejecución del ejercicio respetando el ritmo del paciente.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  Paso 7 de 10
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observaciones de la Ejecución y Reacciones del Consultante
                </label>
                <textarea
                  rows={5}
                  value={techniqueNotes}
                  onChange={(e) => setTechniqueNotes(e.target.value)}
                  placeholder="Detalla qué respuestas dio el paciente, qué resistencias o aperturas surgieron y cómo se procesó la información..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold block mb-1 text-slate-900 dark:text-slate-100">
                  Recordatorio de Seguridad Clínica:
                </span>
                Si durante este paso observa signos de disociación ocular, agitación o llanto desbordante incontrolable, pulse el botón superior <strong>"Pausar si hay Desregulación"</strong> para activar inmediatamente el protocolo de enraizamiento.
              </div>
            </div>
          )}

          {/* Step 8: Vivencia & SUDS Post */}
          {activeStep === 8 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso H — Revisión Vivencial, Insights & SUDS POST
                  </h3>
                  <p className="text-slate-500">
                    Evaluar el aprendizaje significativo y el impacto fisiológico tras la intervención.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  Paso 8 de 10
                </span>
              </div>

              {/* SUDS Post slider */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-slate-100">
                    Escala Subjetiva de Malestar (SUDS POST-TÉCNICA): {postSuds} / 10
                  </label>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      postSuds < preSuds
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Diferencia: {postSuds - preSuds} pts (Pre: {preSuds} → Post: {postSuds})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={postSuds}
                  onChange={(e) => setPostSuds(parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Conclusiones / Insights Propios Expresados por el Paciente
                </label>
                <textarea
                  rows={4}
                  value={patientInsights}
                  onChange={(e) => setPatientInsights(e.target.value)}
                  placeholder="¿Con qué frase o reflexión clave se queda el consultante tras el ejercicio?"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Step 9: Tareas Voluntarias */}
          {activeStep === 9 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso I — Asignación Colaborativa de Tareas Voluntarias
                  </h3>
                  <p className="text-slate-500">
                    Diseñar puentes conductuales para generalizar lo aprendido a la vida cotidiana.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  Paso 9 de 10
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tareas Acordadas (separadas por punto y coma) *
                </label>
                <textarea
                  rows={4}
                  value={voluntaryHomework}
                  onChange={(e) => setVoluntaryHomework(e.target.value)}
                  placeholder="1. Practicar ejercicio X 3 veces por semana; 2. Anotar en diario de emociones..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                Recuerde que las tareas deben ser 100% voluntarias, realistas y no sobrecargar al consultante.
              </div>
            </div>
          )}

          {/* Step 10: Cierre & Firma */}
          {activeStep === 10 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Paso J — Cierre Profesional & Registro en Historia Clínica
                  </h3>
                  <p className="text-slate-500">
                    Resumen final y firma del profesional tratante conforme a Ley 1090/2006.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  Finalizar
                </span>
              </div>

              {/* Session Summary Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <div><strong>Paciente:</strong> {selectedPatient?.firstName} {selectedPatient?.lastName}</div>
                  <div><strong>Fecha:</strong> {new Date().toISOString().slice(0, 10)}</div>
                  <div><strong>Enfoque:</strong> {activeProtocol.name}</div>
                  <div><strong>Técnica:</strong> {techniqueApplied}</div>
                  <div><strong>Variación SUDS:</strong> {preSuds}/10 → {postSuds}/10</div>
                  <div><strong>Pausa por Desregulación:</strong> {isPausedForDysregulation ? 'Sí (Registrada)' : 'No'}</div>
                </div>
              </div>

              {/* Clinician Signature block */}
              <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/40 dark:bg-teal-950/20">
                <span className="block text-xs font-bold text-teal-900 dark:text-teal-200 mb-1">
                  Constancia de Firma Profesional Responsable
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {currentProfile.name} — {currentProfile.title} ({currentProfile.registrationNumber})
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Registro sellado digitalmente con hash de integridad inmutable en la historia clínica.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <span className="text-xs font-semibold text-slate-500">
            Paso {activeStep} de 10
          </span>

          {activeStep < 10 ? (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.min(10, prev + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaved}
              onClick={handleFinishSession}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 animate-bounce" />
                  Sesión Guardada en Expediente...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Finalizar y Registrar Sesión
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
