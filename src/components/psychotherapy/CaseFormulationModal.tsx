import React, { useState } from 'react';
import {
  FileCode,
  X,
  Sparkles,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Layers,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  PsychotherapyModality,
  SmartGoal,
  ClinicalCaseFormulation,
} from '../../types';
import { PSYCHOTHERAPY_PROTOCOLS } from '../../data/psychotherapyProtocols';
import { requestClinicalAiFormulation } from '../../utils/psychotherapyAi';

interface CaseFormulationModalProps {
  existingFormulation?: ClinicalCaseFormulation | null;
  defaultPatientId?: string | null;
  onClose: () => void;
}

export const CaseFormulationModal: React.FC<CaseFormulationModalProps> = ({
  existingFormulation,
  defaultPatientId,
  onClose,
}) => {
  const {
    patients,
    currentProfile,
    addCaseFormulation,
    updateCaseFormulation,
  } = useApp();

  const [patientId, setPatientId] = useState(
    existingFormulation?.patientId || defaultPatientId || (patients[0]?.id || '')
  );
  const selectedPatient = patients.find((p) => p.id === patientId);

  const [modalityPrimary, setModalityPrimary] = useState<PsychotherapyModality>(
    existingFormulation?.modalityPrimary || 'tcc'
  );
  const [secondaryModalities, setSecondaryModalities] = useState<PsychotherapyModality[]>(
    existingFormulation?.secondaryModalities || []
  );

  const [predisposingFactors, setPredisposingFactors] = useState(
    existingFormulation?.predisposingFactors || ''
  );
  const [precipitatingFactors, setPrecipitatingFactors] = useState(
    existingFormulation?.precipitatingFactors || ''
  );
  const [maintainingFactors, setMaintainingFactors] = useState(
    existingFormulation?.maintainingFactors || ''
  );
  const [protectiveFactors, setProtectiveFactors] = useState(
    existingFormulation?.protectiveFactors || ''
  );
  const [workingHypothesis, setWorkingHypothesis] = useState(
    existingFormulation?.workingHypothesis || ''
  );

  const [smartGoals, setSmartGoals] = useState<SmartGoal[]>(
    existingFormulation?.smartGoals || [
      {
        id: 'goal-1',
        description: 'Identificar pensamientos automáticos y aplicar Registro de Pensamientos (RPD) al menos 3 veces por semana.',
        targetDate: '2026-11-20',
        indicator: 'RPD entregado y revisado en sesión',
        progressPercent: 20,
      },
    ]
  );

  const [reviewDate, setReviewDate] = useState(
    existingFormulation?.reviewDate || '2026-11-20'
  );
  const [clinicalValidationNotes, setClinicalValidationNotes] = useState(
    existingFormulation?.clinicalValidationNotes ||
      `Validado por ${currentProfile.name} (${currentProfile.title} - ${currentProfile.registrationNumber}). Conforme a Ley 1090/2006 y Dec. 780/2016.`
  );

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestionsNotice, setAiSuggestionsNotice] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Toggle secondary modality
  const handleToggleSecondary = (mod: PsychotherapyModality) => {
    if (mod === modalityPrimary) return;
    if (secondaryModalities.includes(mod)) {
      setSecondaryModalities(secondaryModalities.filter((m) => m !== mod));
    } else {
      setSecondaryModalities([...secondaryModalities, mod]);
    }
  };

  // Add goal
  const handleAddGoal = () => {
    const newGoal: SmartGoal = {
      id: `goal-${Date.now()}`,
      description: '',
      targetDate: reviewDate,
      indicator: '',
      progressPercent: 0,
    };
    setSmartGoals([...smartGoals, newGoal]);
  };

  const handleUpdateGoal = (id: string, updates: Partial<SmartGoal>) => {
    setSmartGoals(smartGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const handleRemoveGoal = (id: string) => {
    setSmartGoals(smartGoals.filter((g) => g.id !== id));
  };

  // AI Assist button
  const handleAiAssist = async () => {
    if (!selectedPatient) return;
    setIsAiLoading(true);
    setAiSuggestionsNotice(null);

    try {
      const response = await requestClinicalAiFormulation({
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        modality: modalityPrimary,
        symptomsAndChiefComplaint: selectedPatient.generalNotes || 'Ansiedad generalizada y sobrecarga situacional.',
        triggers: precipitatingFactors || 'Cambios laborales recientes y alta exigencia.',
        personalHistory: predisposingFactors || 'Autoexigencia y antecedentes de perfeccionismo.',
        currentCoping: maintainingFactors || 'Aislamiento y sobrecompensación horaria.',
      });

      if (!predisposingFactors) setPredisposingFactors(response.predisposingFactors);
      if (!precipitatingFactors) setPrecipitatingFactors(response.precipitatingFactors);
      if (!maintainingFactors) setMaintainingFactors(response.maintainingFactors);
      if (!protectiveFactors) setProtectiveFactors(response.protectiveFactors);
      setWorkingHypothesis(response.workingHypothesis);

      if (response.suggestedSmartGoals.length > 0 && smartGoals.length <= 1) {
        const newGoals: SmartGoal[] = response.suggestedSmartGoals.map((sg, idx) => ({
          id: `goal-ai-${Date.now()}-${idx}`,
          description: sg.description,
          targetDate: new Date(Date.now() + sg.targetWeeks * 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          indicator: sg.indicator,
          progressPercent: 0,
        }));
        setSmartGoals(newGoals);
      }

      setAiSuggestionsNotice(
        'Propuesta de formulación clínica generada basada en evidencia científica. Recuerde que como profesional responsable, usted debe revisar, ajustar y validar cada campo antes de aprobarla.'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    if (existingFormulation) {
      updateCaseFormulation(existingFormulation.id, {
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        modalityPrimary,
        secondaryModalities,
        predisposingFactors,
        precipitatingFactors,
        maintainingFactors,
        protectiveFactors,
        workingHypothesis,
        smartGoals,
        reviewDate,
        clinicalValidationNotes,
      });
    } else {
      addCaseFormulation({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        professionalId: currentProfile.id,
        professionalName: currentProfile.name,
        professionalRole: currentProfile.role,
        date: new Date().toISOString().slice(0, 10),
        status: 'Activa',
        modalityPrimary,
        secondaryModalities,
        predisposingFactors,
        precipitatingFactors,
        maintainingFactors,
        protectiveFactors,
        workingHypothesis,
        smartGoals,
        reviewDate,
        aiAssisted: !!aiSuggestionsNotice,
        clinicalValidationNotes,
      });
    }

    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {existingFormulation ? 'Editar Formulación de Caso' : 'Nueva Formulación Clínica & Metas SMART'}
              </h2>
              <p className="text-xs text-slate-400">
                Matriz funcional de las 4 P's • Hipótesis integradora • Plan de intervención con supervisión
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Helper Banner */}
        <div className="bg-teal-50 dark:bg-teal-950/40 border-b border-teal-200 dark:border-teal-900/40 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="text-xs text-teal-900 dark:text-teal-200">
              ¿Deseas una sugerencia de hipótesis estructurada basada en los antecedentes y enfoque clínico?
            </span>
          </div>
          <button
            type="button"
            onClick={handleAiAssist}
            disabled={isAiLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 disabled:opacity-50"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Analizando con IA...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Asistir Formulación con IA
              </>
            )}
          </button>
        </div>

        {aiSuggestionsNotice && (
          <div className="bg-blue-50 dark:bg-blue-950/40 px-6 py-2.5 border-b border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{aiSuggestionsNotice}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Patient and Primary Modality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paciente Vinculado *
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                disabled={!!existingFormulation}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100"
                required
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
                Enfoque Terapéutico Principal *
              </label>
              <select
                value={modalityPrimary}
                onChange={(e) => setModalityPrimary(e.target.value as PsychotherapyModality)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 font-medium"
              >
                {PSYCHOTHERAPY_PROTOCOLS.map((proto) => (
                  <option key={proto.id} value={proto.id}>
                    {proto.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Modalities Chips */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Enfoques Complementarios / Módulos de Integración (Opcional)
            </label>
            <div className="flex flex-wrap gap-2">
              {PSYCHOTHERAPY_PROTOCOLS.filter((p) => p.id !== modalityPrimary).map((proto) => {
                const isSelected = secondaryModalities.includes(proto.id);
                return (
                  <button
                    key={proto.id}
                    type="button"
                    onClick={() => handleToggleSecondary(proto.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    + {proto.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 P's Functional Formulation Matrix */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                <Layers className="w-4 h-4 text-teal-600" />
                Matriz de Formulación Clínica de las 4 P's
              </h3>
              <span className="text-[11px] text-slate-500">
                Estructura longitudinal y funcional del caso
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Predisposing */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. Factores Predisponentes (Historia previa / Biológico)
                </label>
                <textarea
                  rows={3}
                  value={predisposingFactors}
                  onChange={(e) => setPredisposingFactors(e.target.value)}
                  placeholder="Estilos de crianza tempranos, antecedentes familiares, temperamento biológico, esquemas tempranos desadaptativos..."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              {/* Precipitating */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  2. Factores Precipitantes (Gatillantes recientes)
                </label>
                <textarea
                  rows={3}
                  value={precipitatingFactors}
                  onChange={(e) => setPrecipitatingFactors(e.target.value)}
                  placeholder="Eventos estresores detonantes, pérdidas recientes, transiciones vitales, crisis de pareja o laboral..."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              {/* Maintaining */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  3. Factores Mantenedores (Bucle de perpetuación)
                </label>
                <textarea
                  rows={3}
                  value={maintainingFactors}
                  onChange={(e) => setMaintainingFactors(e.target.value)}
                  placeholder="Evitación experiencial, distorsiones cognitivas activas, conductas de escape, aislamiento, reforzadores secundarios..."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              {/* Protective */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  4. Factores Protectores (Recursos y fortalezas)
                </label>
                <textarea
                  rows={3}
                  value={protectiveFactors}
                  onChange={(e) => setProtectiveFactors(e.target.value)}
                  placeholder="Red de apoyo familiar, valores personales, espiritualidad, talentos, insight, adherencia al tratamiento..."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Working Hypothesis */}
          <div>
            <label className="block font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center justify-between">
              <span>Hipótesis Explicativa Integradora de Trabajo *</span>
              <span className="text-[11px] font-normal text-slate-500">
                Resumen clínico funcional que guía la intervención
              </span>
            </label>
            <textarea
              rows={4}
              value={workingHypothesis}
              onChange={(e) => setWorkingHypothesis(e.target.value)}
              placeholder="Explica cómo interactúan los factores y por qué la técnica elegida producirá el cambio conductual y cognitivo..."
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          {/* SMART Goals Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Metas Terapéuticas SMART Acordadas
                </h4>
                <p className="text-[11px] text-slate-500">
                  Específicas, Medibles, Alcanzables, Relevantes y con Tiempo delimitado
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddGoal}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar Meta
              </button>
            </div>

            <div className="space-y-2">
              {smartGoals.map((goal, idx) => (
                <div
                  key={goal.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-start md:items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                    <input
                      type="text"
                      placeholder="Descripción de la meta SMART..."
                      value={goal.description}
                      onChange={(e) => handleUpdateGoal(goal.id, { description: e.target.value })}
                      className="sm:col-span-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-1.5 bg-white dark:bg-slate-800"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Indicador observable de logro..."
                      value={goal.indicator}
                      onChange={(e) => handleUpdateGoal(goal.id, { indicator: e.target.value })}
                      className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-1.5 bg-white dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500">Avance:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={goal.progressPercent}
                        onChange={(e) =>
                          handleUpdateGoal(goal.id, {
                            progressPercent: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                          })
                        }
                        className="w-14 text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-1 bg-white dark:bg-slate-800 text-center font-bold"
                      />
                      <span className="text-[11px] text-slate-500">%</span>
                    </div>
                    {smartGoals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(goal.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Date and Clinician Validation Sign-off */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Fecha Programada de Revisión de Metas *
              </label>
              <input
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Constancia de Validación Profesional y Supervisión *
              </label>
              <input
                type="text"
                value={clinicalValidationNotes}
                onChange={(e) => setClinicalValidationNotes(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                required
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  Formulación Guardada...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Formulación Clínica
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
