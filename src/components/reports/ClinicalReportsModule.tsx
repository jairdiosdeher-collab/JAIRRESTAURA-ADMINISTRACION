import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Printer,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Pill,
  ExternalLink,
  ShieldCheck,
  User,
  Clock,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClinicalReport } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { downloadClinicalReportPDF } from '../../utils/pdfGenerator';
import { ReportPrintView } from './ReportPrintView';
import { ReportGeneratorModal } from './ReportGeneratorModal';

export const ClinicalReportsModule: React.FC = () => {
  const { reports, prescriptions, currentProfile } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [selectedForPrint, setSelectedForPrint] = useState<ClinicalReport | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.diagnosticAppraisal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'todos' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Módulo de Informes Clínicos y Certificaciones
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Informes de evaluación, evolución, remisiones e integración obligatoria de fórmulas farmacológicas
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Generar Informe Oficial</span>
          </button>
        </div>

        {/* Regulatory note */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Integración Farmacológica Obligatoria:</strong> Todo informe clínico que documente tratamiento psicofarmacológico debe adjuntar la fórmula validada por el Psiquiatra o exhibir la advertencia de derivación a médico autorizado.
            </span>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por paciente, diagnóstico o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'Evaluación Psicológica', label: 'Evaluación' },
            { id: 'Seguimiento y Evolución', label: 'Evolución' },
            { id: 'Remisión a Psiquiatría / Medicina', label: 'Remisión' },
            { id: 'Resumen de Historia Clínica', label: 'Resumen Historia' },
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

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const linkedPrescription = report.linkedPrescriptionId
            ? prescriptions.find((p) => p.id === report.linkedPrescriptionId)
            : undefined;

          return (
            <div
              key={report.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {report.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {report.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                    Paciente: {report.patientName} • {report.patientDocument}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Propósito: {report.purpose} • Dirigido a: {report.addressedTo}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      const linked = report.linkedPrescriptionId
                        ? prescriptions.find((p) => p.id === report.linkedPrescriptionId)
                        : undefined;
                      downloadClinicalReportPDF(report, linked);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition flex items-center gap-1.5"
                    title="Descargar archivo PDF directamente"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar PDF</span>
                  </button>

                  <button
                    onClick={() => setSelectedForPrint(report)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-600" />
                    <span>Vista Previa</span>
                  </button>
                </div>
              </div>

              {/* Details Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 space-y-1">
                  <span className="font-bold text-[11px] text-slate-500 uppercase block">
                    Apreciación Diagnóstica:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">
                    {report.diagnosticAppraisal}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 line-clamp-2">
                    {report.clinicalFindings}
                  </p>
                </div>

                {/* Pharmacological status in report */}
                <div
                  className={`p-3 rounded-lg border space-y-1 ${
                    report.isValidatedPrescription
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                      : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                  }`}
                >
                  <span className="font-bold text-[11px] uppercase flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5" />
                    Tratamiento Farmacológico y Prescripción
                  </span>

                  {report.isValidatedPrescription ? (
                    <div className="text-[11px] space-y-0.5">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Fórmula Vigente Asociada: {report.linkedPrescriptionId}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {report.pharmacologicalNotes ||
                          'Prescripción psicofarmacológica aprobada y firmada por Médico Psiquiatra.'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-[11px] space-y-0.5">
                      <p className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Advertencia Reglamentaria Incorporada:
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 italic">
                        "{report.validationWarning || 'Sin prescripción médica validada registrada en el expediente.'}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
                <span>
                  Responsable: {report.professionalName} ({report.professionalRegistration})
                </span>
                <span className="font-mono text-[10px]">
                  Firma Criptográfica: {report.signatureHash?.slice(0, 24)}...
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Sheet View */}
      {selectedForPrint && (
        <ReportPrintView
          report={selectedForPrint}
          prescription={
            selectedForPrint.linkedPrescriptionId
              ? prescriptions.find((p) => p.id === selectedForPrint.linkedPrescriptionId)
              : undefined
          }
          onClose={() => setSelectedForPrint(null)}
        />
      )}

      {/* New Report Modal */}
      {isNewModalOpen && (
        <ReportGeneratorModal onClose={() => setIsNewModalOpen(false)} />
      )}
    </div>
  );
};
