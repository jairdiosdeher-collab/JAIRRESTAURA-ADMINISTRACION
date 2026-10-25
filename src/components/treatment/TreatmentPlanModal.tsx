import React, { useState } from 'react';
import { Target, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttentionModality, TreatmentStatus, TreatmentGoal } from '../../types';

interface TreatmentPlanModalProps {
  onClose: () => void;
  defaultPatientId?: string;
}

export const TreatmentPlanModal: React.FC<TreatmentPlanModalProps> = ({
  onClose,
  defaultPatientId,
}) => {
  const { patients, currentProfile, addTreatmentPlan } = useApp();

  const [patientId, setPatientId] = useState<string>(
    defaultPatientId || (patients[0]?.id || '')
  );

  const selectedPatient = patients.find((p) => p.id === patientId) || patients[0];

  const [title, setTitle] = useState(
    'Plan Psicoterapéutico de Intervención y Reestructuración Conductual'
  );
  const [approach, setApproach] = useState(
    'Terapia Cognitivo-Conductual (TCC) + Técnicas de Tercera Generación'
  );
  const [modality, setModality] = useState<AttentionModality>('Virtual');
  const [frequency, setFrequency] = useState('Semanal (50 minutos)');
  const [reviewDate, setReviewDate] = useState('2026-12-15');
  const [status, setStatus] = useState<TreatmentStatus>('Activo');
  const [sessionIndicators, setSessionIndicators] = useState(
    'Registro de escalas psicométricas (PHQ-9 / GAD-7) y cumplimiento de autorregistros conductuales.'
  );

  const [goals, setGoals] = useState<TreatmentGoal[]>([
    {
      id: 'g-1',
      description: 'Implementar rutina diaria de activación conductual y hábitos de higiene del sueño',
      indicator: 'Días con rutina cumplida (meta: 5 días/semana)',
      targetProgressPercent: 100,
      currentProgressPercent: 60,
    },
    {
      id: 'g-2',
      description: 'Disminución de rumiación ansiosa mediante reestructuración cognitiva',
      indicator: 'Puntaje de ansiedad autoreportado en bitácora',
      targetProgressPercent: 100,
      currentProgressPercent: 50,
    },
  ]);

  const [tasksText, setTasksText] = useState(
    'Registro diario de pensamientos automáticos en plantilla ABC; Caminata de 20 min diaria; Desconexión digital 8:00 PM.'
  );

  const handleAddGoal = () => {
    setGoals((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}`,
        description: '',
        indicator: '',
        targetProgressPercent: 100,
        currentProgressPercent: 20,
      },
    ]);
  };

  const handleRemoveGoal = (id: string) => {
    if (goals.length === 1) return;
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleGoalChange = (id: string, field: keyof TreatmentGoal, val: any) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: val } : g))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addTreatmentPlan({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      title,
      approach,
      modality,
      frequency,
      goals,
      agreedTasks: tasksText
        .split(';')
        .map((t) => t.trim())
        .filter(Boolean),
      sessionIndicators,
      reviewDate,
      status,
      professionalId: currentProfile.id,
      professionalName: currentProfile.name,
      professionalRole: currentProfile.role,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">Nuevo Plan de Tratamiento Psicológico</h2>
              <p className="text-[11px] text-slate-400">
                Objetivos medibles (SMART), enfoque terapéutico e indicadores de progreso
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paciente:
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} — ({p.documentType} {p.documentNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Título del Plan:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enfoque de Intervención:
              </label>
              <input
                type="text"
                required
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Modalidad:
              </label>
              <select
                value={modality}
                onChange={(e: any) => setModality(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="Virtual">Virtual (Teleconsulta)</option>
                <option value="Presencial">Presencial en Consultorio</option>
                <option value="Híbrida">Híbrida</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Frecuencia Prevista:
              </label>
              <input
                type="text"
                required
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Revisión / Evaluación:
              </label>
              <input
                type="date"
                required
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Goals management */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Objetivos Terapéuticos Medibles (SMART)
              </span>
              <button
                type="button"
                onClick={handleAddGoal}
                className="text-teal-700 dark:text-teal-400 font-semibold text-xs flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Objetivo</span>
              </button>
            </div>

            {goals.map((g, idx) => (
              <div
                key={g.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-800 dark:text-teal-400 text-xs">
                    Objetivo #{idx + 1}
                  </span>
                  {goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(g.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Descripción del Objetivo:
                    </label>
                    <input
                      type="text"
                      required
                      value={g.description}
                      onChange={(e) => handleGoalChange(g.id, 'description', e.target.value)}
                      placeholder="Ej. Desarrollar estrategias de afrontamiento ante estresores laborales..."
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Progreso Actual (%): {g.currentProgressPercent}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={g.currentProgressPercent}
                      onChange={(e) =>
                        handleGoalChange(g.id, 'currentProgressPercent', Number(e.target.value))
                      }
                      className="w-full accent-teal-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tareas y Actividades Acordadas (separadas por punto y coma ';'):
            </label>
            <textarea
              rows={2}
              value={tasksText}
              onChange={(e) => setTasksText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Indicadores de Progreso y Evaluación:
            </label>
            <input
              type="text"
              value={sessionIndicators}
              onChange={(e) => setSessionIndicators(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition"
            >
              Guardar Plan Terapéutico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
