import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  User,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DiagnosticRecord } from '../../types';
import { formatDate } from '../../utils/formatters';
import { DiagnosticModal } from './DiagnosticModal';

export const DiagnosticsModule: React.FC = () => {
  const { diagnostics } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredDiagnostics = diagnostics.filter((d) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      d.patientName.toLowerCase().includes(term) ||
      d.codeCIE10.toLowerCase().includes(term) ||
      d.description.toLowerCase().includes(term) ||
      d.clinicalEvidence.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'todos' ? true : d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Módulo de Diagnósticos Clínicos (CIE-10 / CIE-11)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registro riguroso de problemas de salud mental, evidencias documentadas y remisiones
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Diagnóstico</span>
          </button>
        </div>

        {/* Clinical Guardrail */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
          <span>
            <strong>Criterio de Rigor Clínico:</strong> El sistema apoya la organización documental, pero no convierte automáticamente cuestionarios en diagnósticos definitivos. Los diagnósticos médicos psiquiátricos corresponden exclusivamente al médico facultado.
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código (ej. F33.1, F41.1), paciente o patología..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'Confirmado', label: 'Confirmados' },
            { id: 'Provisional', label: 'Provisionales' },
            { id: 'Diferencial', label: 'Diferenciales' },
            { id: 'Pendiente de Evaluación', label: 'Pendientes' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === f.id
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Diagnostics */}
      <div className="space-y-4">
        {filteredDiagnostics.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <Activity className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No se encontraron diagnósticos
            </h3>
          </div>
        ) : (
          filteredDiagnostics.map((diag) => (
            <div
              key={diag.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-sm text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                    {diag.codeCIE10}
                  </span>
                  {diag.codeCIE11 && (
                    <span className="text-[10px] font-mono text-slate-500">
                      CIE-11: {diag.codeCIE11}
                    </span>
                  )}
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {diag.description}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      diag.status === 'Confirmado'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {diag.status}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {diag.type}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  Identificado: {formatDate(diag.dateIdentified)}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="text-slate-900 dark:text-white">Paciente:</strong>{' '}
                  {diag.patientName}
                </p>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80">
                  <span className="font-bold text-[10px] uppercase text-slate-500 block mb-0.5">
                    Evidencias Clínicas Documentadas:
                  </span>
                  <p>{diag.clinicalEvidence}</p>
                </div>
                {diag.observations && (
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    <strong>Observaciones:</strong> {diag.observations}
                  </p>
                )}
                {diag.remissionsRequired && (
                  <p className="text-blue-700 dark:text-blue-400 text-[11px] font-medium flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>Remisión: {diag.remissionsRequired}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Profesional: {diag.professionalName} ({diag.professionalRole.toUpperCase()})
                </span>
                <span>Registro Oficial JAIRRESTAURA</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && <DiagnosticModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
