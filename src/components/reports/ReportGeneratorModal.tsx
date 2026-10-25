import React, { useState } from 'react';
import {
  FileCheck2,
  X,
  AlertTriangle,
  CheckCircle,
  Pill,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportType, ClinicalReport } from '../../types';
import { generateHash } from '../../utils/formatters';

interface ReportGeneratorModalProps {
  onClose: () => void;
  defaultPatientId?: string;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  onClose,
  defaultPatientId,
}) => {
  const {
    patients,
    prescriptions,
    diagnostics,
    currentProfile,
    addReport,
  } = useApp();

  const [patientId, setPatientId] = useState<string>(
    defaultPatientId || (patients[0]?.id || '')
  );

  const selectedPatient = patients.find((p) => p.id === patientId) || patients[0];

  // Check if patient has an approved psychiatric prescription
  const approvedPrescription = prescriptions.find(
    (p) =>
      p.patientId === patientId &&
      (p.status === 'Aprobada y Firmada por Psiquiatra' || p.status === 'Emitida al Paciente')
  );

  const patientDiagnostics = diagnostics.filter((d) => d.patientId === patientId);

  const [type, setType] = useState<ReportType>('Seguimiento y Evolución');
  const [purpose, setPurpose] = useState('Informe de evolución clínica y reporte de adherencia terapéutica');
  const [addressedTo, setAddressedTo] = useState('A quien pueda interesar / Entidad Solicitante');

  const [backgroundSummary, setBackgroundSummary] = useState(
    `Consultante de ${selectedPatient ? selectedPatient.city : ''}, ingresó en ${
      selectedPatient ? selectedPatient.admissionDate : ''
    }. Refiere motivo de consulta relacionado con dificultades emocionales y manejo del estrés.`
  );

  const [clinicalFindings, setClinicalFindings] = useState(
    'Afecto reactivo y modulado, pensamiento lógico sin alteraciones del curso ni del contenido. Adecuada introspección y alianza terapéutica consolidada.'
  );

  const [diagnosticAppraisal, setDiagnosticAppraisal] = useState(
    patientDiagnostics.length > 0
      ? patientDiagnostics.map((d) => `${d.codeCIE10} - ${d.description} (${d.status})`).join('; ')
      : 'Evaluación clínica en curso; sin diagnóstico definitivo establecido.'
  );

  const [therapeuticInterventions, setTherapeuticInterventions] = useState(
    'Intervención cognitivo-conductual centrada en regulación emocional, activación conductual y reestructuración de distorsiones cognitivas.'
  );

  const [recommendations, setRecommendations] = useState(
    'Continuar sesiones de acompañamiento según cronograma. Mantener hábitos de sueño y actividad física estructurada.'
  );

  const [remissions, setRemissions] = useState(
    approvedPrescription ? 'Control periódico con Psiquiatría Médica.' : 'Se recomienda interconsulta médica si los síntomas persisten.'
  );

  const [includePrescription, setIncludePrescription] = useState<boolean>(!!approvedPrescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const signatureHash = generateHash(
      `${selectedPatient.id}-${type}-${currentProfile.registrationNumber}-${Date.now()}`
    );

    addReport({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      patientDocument: `${selectedPatient.documentType} ${selectedPatient.documentNumber}`,
      type,
      date: '2026-10-25',
      purpose,
      addressedTo,
      professionalId: currentProfile.id,
      professionalName: currentProfile.name,
      professionalRole: currentProfile.role,
      professionalRegistration: currentProfile.registrationNumber,
      backgroundSummary,
      clinicalFindings,
      diagnosticAppraisal,
      therapeuticInterventions,
      recommendations,
      remissions,
      hasPharmacologicalTreatment: includePrescription && !!approvedPrescription,
      linkedPrescriptionId: approvedPrescription ? approvedPrescription.id : undefined,
      pharmacologicalNotes:
        includePrescription && approvedPrescription
          ? `Prescripción Médica Validada (${approvedPrescription.id}) expedida por ${approvedPrescription.psychiatristName}.`
          : undefined,
      isValidatedPrescription: includePrescription && !!approvedPrescription,
      validationWarning:
        !approvedPrescription || !includePrescription
          ? 'Sin prescripción médica validada registrada en el expediente. Consulte con un médico autorizado para la valoración y eventual formulación.'
          : undefined,
      status: 'Validado y Firmado',
      signedAt: new Date().toISOString(),
      signatureHash,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">Generador de Informes Clínicos Oficiales</h2>
              <p className="text-[11px] text-slate-400">
                Formato conforme a la Ley 1090 de 2006 y normativa de prescripción médica
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
                Tipo de Informe:
              </label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
              >
                <option value="Evaluación Psicológica">Informe de Evaluación Psicológica</option>
                <option value="Seguimiento y Evolución">Informe de Seguimiento y Evolución</option>
                <option value="Remisión a Psiquiatría / Medicina">Informe de Remisión a Psiquiatría / Medicina</option>
                <option value="Resumen de Historia Clínica">Resumen de Historia Clínica</option>
                <option value="Cierre Terapéutico">Informe de Cierre Terapéutico</option>
                <option value="Constancia de Asistencia">Constancia de Asistencia y Acompañamiento</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Propósito del Documento:
              </label>
              <input
                type="text"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Destinatario:
              </label>
              <input
                type="text"
                required
                value={addressedTo}
                onChange={(e) => setAddressedTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              1. Resumen de Antecedentes Pertinentes:
            </label>
            <textarea
              rows={2}
              required
              value={backgroundSummary}
              onChange={(e) => setBackgroundSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              2. Hallazgos Clínicos / Procedimientos Realizados:
            </label>
            <textarea
              rows={2}
              required
              value={clinicalFindings}
              onChange={(e) => setClinicalFindings(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              3. Apreciación Diagnóstica:
            </label>
            <input
              type="text"
              required
              value={diagnosticAppraisal}
              onChange={(e) => setDiagnosticAppraisal(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* Pharmacological Section Controller */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-teal-600" />
                Sección Obligatoria: Tratamiento Farmacológico
              </span>
              <span className="text-[10px] text-slate-500">Exigencia Legal</span>
            </div>

            {approvedPrescription ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Se detectó prescripción médica validada en el expediente: {approvedPrescription.id}
                </p>
                <p className="text-[11px]">
                  Prescriptor: {approvedPrescription.psychiatristName} ({approvedPrescription.psychiatristRegistration}).
                </p>
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePrescription}
                    onChange={(e) => setIncludePrescription(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span className="text-xs font-semibold">
                    Adjuntar detalle íntegro de la prescripción validada al informe
                  </span>
                </label>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-lg text-amber-950 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Sin prescripción psiquiátrica validada para este paciente</span>
                </div>
                <p className="text-[11px] leading-snug">
                  El informe incluirá automáticamente la cláusula de advertencia reglamentaria:
                  <em> "Sin prescripción médica validada registrada en el expediente. Consulte con un médico autorizado para la valoración y eventual formulación."</em>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              4. Recomendaciones Terapéuticas:
            </label>
            <textarea
              rows={2}
              required
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              5. Remisiones Necesarias:
            </label>
            <input
              type="text"
              value={remissions}
              onChange={(e) => setRemissions(e.target.value)}
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
              Generar y Firmar Informe Oficial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
