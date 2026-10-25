import React, { useState } from 'react';
import {
  Target,
  Plus,
  Search,
  CheckCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TreatmentPlan } from '../../types';
import { formatDate } from '../../utils/formatters';
import { TreatmentPlanModal } from './TreatmentPlanModal';

export const TreatmentPlanModule: React.FC = () => {
  const { treatmentPlans, updateTreatmentPlan } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPlans = treatmentPlans.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.patientName.toLowerCase().includes(term) ||
      p.title.toLowerCase().includes(term) ||
      p.approach.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'todos' ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateGoalProgress = (
    planId: string,
    goalId: string,
    newProgress: number
  ) => {
    const plan = treatmentPlans.find((tp) => tp.id === planId);
    if (!plan) return;
    const updatedGoals = plan.goals.map((g) =>
      g.id === goalId ? { ...g, currentProgressPercent: newProgress } : g
    );
    updateTreatmentPlan(planId, { goals: updatedGoals });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Planes de Tratamiento e Intervención Psicológica
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estructuración por metas terapéuticas medibles, tareas acordadas e indicadores de avance
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Plan de Intervención</span>
          </button>
        </div>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {filteredPlans.map((plan) => {
          const totalProgress = Math.round(
            plan.goals.reduce((sum, g) => sum + g.currentProgressPercent, 0) /
              (plan.goals.length || 1)
          );

          return (
            <div
              key={plan.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200">
                      {plan.id}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {plan.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                    Paciente: {plan.patientName} • Modalidad: {plan.modality} ({plan.frequency})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Enfoque: {plan.approach} • Revisión programada: {formatDate(plan.reviewDate)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Progreso Global
                  </span>
                  <span className="text-xl font-black text-teal-700 dark:text-teal-400">
                    {totalProgress}%
                  </span>
                </div>
              </div>

              {/* Goals list with interactive progress sliders */}
              <div className="space-y-3">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block">
                  Metas Terapéuticas y Avance Cuantificable:
                </span>
                {plan.goals.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {g.description}
                      </span>
                      <span className="font-bold text-teal-800 dark:text-teal-300 text-xs">
                        {g.currentProgressPercent}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${g.currentProgressPercent}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={g.currentProgressPercent}
                        onChange={(e) =>
                          handleUpdateGoalProgress(plan.id, g.id, Number(e.target.value))
                        }
                        className="w-24 accent-teal-600 cursor-pointer"
                        title="Ajustar avance de la meta"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      <strong>Indicador:</strong> {g.indicator}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tasks agreed */}
              {plan.agreedTasks.length > 0 && (
                <div className="p-3 rounded-lg bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 text-xs space-y-1">
                  <span className="font-bold text-[11px] text-teal-900 dark:text-teal-300 uppercase block">
                    Tareas y Compromisos Inter-Sesión Acordados:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 text-[11px]">
                    {plan.agreedTasks.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Responsable: {plan.professionalName} ({plan.professionalRole.toUpperCase()})
                </span>
                <span>Última revisión: {formatDate(plan.updatedAt)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && <TreatmentPlanModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
