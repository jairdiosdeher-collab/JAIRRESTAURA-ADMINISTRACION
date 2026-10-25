import React, { useState } from 'react';
import { Activity, X, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CIE10_CATALOG } from '../../data/initialData';
import { DiagnosticType, DiagnosticStatus } from '../../types';

interface DiagnosticModalProps {
  onClose: () => void;
  defaultPatientId?: string;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  onClose,
  defaultPatientId,
}) => {
  const { patients, currentProfile, addDiagnostic } = useApp();

  const [patientId, setPatientId] = useState<string>(
    defaultPatientId || (patients[0]?.id || '')
  );

  const selectedPatient = patients.find((p) => p.id === patientId) || patients[0];

  const [selectedCie, setSelectedCie] = useState(CIE10_CATALOG[0]);
  const [customDescription, setCustomDescription] = useState(CIE10_CATALOG[0].desc);
  const [type, setType] = useState<DiagnosticType>('Principal');
  const [status, setStatus] = useState<DiagnosticStatus>('Confirmado');
  const [dateIdentified, setDateIdentified] = useState('2026-10-25');
  const [clinicalEvidence, setClinicalEvidence] = useState(
    'Criterios clínicos documentados mediante entrevista estructurada y escalas validadas.'
  );
  const [observations, setObservations] = useState(
    'En seguimiento interdisciplinario con evaluación periódica.'
  );
  const [remissionsRequired, setRemissionsRequired] = useState('');

  const handleCieChange = (code: string) => {
    const found = CIE10_CATALOG.find((c) => c.code === code) || CIE10_CATALOG[0];
    setSelectedCie(found);
    setCustomDescription(found.desc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addDiagnostic({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      codeCIE10: selectedCie.code,
      codeCIE11: selectedCie.cie11,
      description: customDescription,
      type,
      status,
      dateIdentified,
      professionalId: currentProfile.id,
      professionalName: currentProfile.name,
      professionalRole: currentProfile.role,
      clinicalEvidence,
      observations,
      remissionsRequired: remissionsRequired || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">Registro de Diagnóstico Clínico (CIE-10 / CIE-11)</h2>
              <p className="text-[11px] text-slate-400">
                Identificación de criterios diagnósticos documentados y autoría profesional
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Author notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-bold text-slate-900 dark:text-white">
              Profesional que documenta el diagnóstico:
            </span>{' '}
            <span>
              {currentProfile.name} ({currentProfile.title} — {currentProfile.registrationNumber})
            </span>
          </div>

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
                Fecha de Identificación:
              </label>
              <input
                type="date"
                required
                value={dateIdentified}
                onChange={(e) => setDateIdentified(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Catálogo de Diagnóstico (CIE-10 / CIE-11):
              </label>
              <select
                value={selectedCie.code}
                onChange={(e) => handleCieChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
              >
                {CIE10_CATALOG.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} (CIE-11: {c.cie11}) — {c.desc}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Descripción / Especificación Clínica:
              </label>
              <input
                type="text"
                required
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jerarquía del Diagnóstico:
              </label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="Principal">Diagnóstico Principal</option>
                <option value="Secundario">Diagnóstico Secundario</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Condición Diagnóstica:
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
              >
                <option value="Confirmado">Confirmado</option>
                <option value="Provisional">Provisional</option>
                <option value="Diferencial">Diferencial</option>
                <option value="Pendiente de Evaluación">Pendiente de Evaluación</option>
                <option value="En Remisión">En Remisión</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Evidencias Clínicas y Criterios Documentados*:
            </label>
            <textarea
              rows={3}
              required
              value={clinicalEvidence}
              onChange={(e) => setClinicalEvidence(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observaciones y Evolución:
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Remisiones a Medicina, Psiquiatría u Otras Especialidades:
            </label>
            <input
              type="text"
              placeholder="Ej. Interconsulta a Psiquiatría para evaluación farmacológica..."
              value={remissionsRequired}
              onChange={(e) => setRemissionsRequired(e.target.value)}
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
              Guardar Diagnóstico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
