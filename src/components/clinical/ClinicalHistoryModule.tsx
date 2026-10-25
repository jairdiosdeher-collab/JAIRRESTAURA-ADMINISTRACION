import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Brain,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  Stethoscope,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SoapNote, NoteType } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { SoapNoteModal } from './SoapNoteModal';

export const ClinicalHistoryModule: React.FC = () => {
  const { soapNotes, patients, currentProfile } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredNotes = soapNotes.filter((note) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      note.patientName.toLowerCase().includes(term) ||
      note.subjective.toLowerCase().includes(term) ||
      note.objective.toLowerCase().includes(term) ||
      note.assessment.toLowerCase().includes(term) ||
      note.plan.toLowerCase().includes(term);

    const matchesType = typeFilter === 'todos' ? true : note.type === typeFilter;
    const matchesPatient =
      selectedPatientFilter === 'todos' ? true : note.patientId === selectedPatientFilter;

    return matchesSearch && matchesType && matchesPatient;
  });

  const getNoteBadge = (type: NoteType) => {
    switch (type) {
      case 'psiquiatria_interconsulta':
        return {
          label: 'Interconsulta Médica Psiquiátrica',
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
          icon: Stethoscope,
        };
      case 'orientacion_pastoral':
        return {
          label: 'Acompañamiento Pastoral y Espiritual',
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
          icon: BookOpen,
        };
      case 'psicologia_soap':
        return {
          label: 'Nota Clínica Psicológica (SOAP)',
          bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700',
          icon: FileText,
        };
      default:
        return {
          label: 'Evolución General',
          bg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          icon: FileText,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Historia Clínica Electrónica (SOAP)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Expedientes individuales confidenciales con estricta separación de roles y trazabilidad
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nueva Evolución</span>
          </button>
        </div>

        {/* Segregation Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
          <span>
            <strong>Principio de Disociación y No Invención:</strong> Las notas de acompañamiento pastoral se mantienen separadas de los registros clínicos y diagnósticos formales. Se diferencian rigurosamente los datos manifestados por el consultante de las observaciones objetivas y los planes.
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar en el relato o apreciación clínica..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Patient Selector Filter */}
          <select
            value={selectedPatientFilter}
            onChange={(e) => setSelectedPatientFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
          >
            <option value="todos">Todos los Pacientes</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          {[
            { id: 'todos', label: 'Todos los Registros' },
            { id: 'psicologia_soap', label: 'Psicología' },
            { id: 'psiquiatria_interconsulta', label: 'Psiquiatría' },
            { id: 'orientacion_pastoral', label: 'Acompañamiento Pastoral' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                typeFilter === f.id
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Timeline List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No se encontraron registros con los filtros seleccionados
            </h3>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const badge = getNoteBadge(note.type);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {note.id}
                    </span>
                    <span className="font-bold text-xs text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                      Paciente: {note.patientName}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDateTime(note.date)}</span>
                  </div>
                </div>

                {/* Structured SOAP Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* S - Subjetivo */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/80 space-y-1">
                    <div className="flex items-center justify-between font-bold text-[11px] text-teal-900 dark:text-teal-300">
                      <span>S — SUBJETIVO (Relato del paciente):</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{note.subjective}"
                    </p>
                  </div>

                  {/* O - Objetivo */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/80 space-y-1">
                    <div className="flex items-center justify-between font-bold text-[11px] text-teal-900 dark:text-teal-300">
                      <span>O — OBJETIVO (Observaciones clínicas y signos):</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {note.objective}
                    </p>
                  </div>

                  {/* A - Apreciación */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/80 space-y-1">
                    <div className="flex items-center justify-between font-bold text-[11px] text-teal-900 dark:text-teal-300">
                      <span>A — ANÁLISIS / APRECIACIÓN CLÍNICA:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {note.assessment}
                    </p>
                  </div>

                  {/* P - Plan */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/80 space-y-1">
                    <div className="flex items-center justify-between font-bold text-[11px] text-teal-900 dark:text-teal-300">
                      <span>P — PLAN TERAPÉUTICO Y SEGUIMIENTO:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {note.plan}
                    </p>
                  </div>
                </div>

                {/* Mental Exam Details (if present) */}
                {note.mentalExam && (
                  <div className="p-3 rounded-lg bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/60 text-xs">
                    <span className="font-bold text-[10px] text-teal-900 dark:text-teal-300 uppercase tracking-wider block mb-1">
                      Examen del Estado Mental Documentado:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                      <div>
                        <strong>Porte:</strong> {note.mentalExam.porteYActitud}
                      </div>
                      <div>
                        <strong>Conciencia:</strong> {note.mentalExam.conciencia}
                      </div>
                      <div>
                        <strong>Orientación:</strong> {note.mentalExam.orientacion}
                      </div>
                      <div>
                        <strong>Pensamiento:</strong> {note.mentalExam.pensamiento}
                      </div>
                    </div>
                  </div>
                )}

                {/* Factors & Remissions */}
                {(note.riskFactors || note.protectiveFactors || note.remissions) && (
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                    {note.protectiveFactors && note.protectiveFactors.length > 0 && (
                      <span className="text-emerald-700 dark:text-emerald-400">
                        <strong>Protectores:</strong> {note.protectiveFactors.join(', ')}
                      </span>
                    )}
                    {note.riskFactors && note.riskFactors.length > 0 && (
                      <span className="text-amber-700 dark:text-amber-400">
                        <strong>Riesgo:</strong> {note.riskFactors.join(', ')}
                      </span>
                    )}
                    {note.remissions && (
                      <span className="text-blue-700 dark:text-blue-400">
                        <strong>Remisiones:</strong> {note.remissions}
                      </span>
                    )}
                  </div>
                )}

                {/* Author Signature & Hash Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Registrado por: <strong>{note.authorName}</strong> ({note.authorRegistration})
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-teal-700 dark:text-teal-400">
                    {note.hashIntegrity}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New SOAP Note Modal */}
      {isModalOpen && (
        <SoapNoteModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
