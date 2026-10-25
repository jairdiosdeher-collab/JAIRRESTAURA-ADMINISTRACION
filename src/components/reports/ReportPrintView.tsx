import React, { useState } from 'react';
import {
  Printer,
  ShieldCheck,
  CheckCircle,
  FileText,
  AlertTriangle,
  X,
  Stethoscope,
  Download,
  Check,
} from 'lucide-react';
import { ClinicalReport, PsychiatricPrescription } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { downloadClinicalReportPDF } from '../../utils/pdfGenerator';

interface ReportPrintViewProps {
  report: ClinicalReport;
  prescription?: PsychiatricPrescription;
  onClose: () => void;
}

export const ReportPrintView: React.FC<ReportPrintViewProps> = ({
  report,
  prescription,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = () => {
    try {
      setDownloading(true);
      downloadClinicalReportPDF(report, prescription);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating report PDF:', err);
      alert('Hubo un error al generar el archivo PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isPrescriptionValidated =
    report.isValidatedPrescription &&
    prescription &&
    (prescription.status === 'Aprobada y Firmada por Psiquiatra' ||
      prescription.status === 'Emitida al Paciente');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:rounded-none flex flex-col max-h-[96vh] print:max-h-none">
        {/* Screen Header Controls */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-600 text-white">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold">{report.type}</h2>
              <p className="text-xs text-slate-400">
                {report.id} • {report.patientName} • {formatDate(report.date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition disabled:opacity-50"
              title="Descarga el informe clínico en formato .pdf a su dispositivo"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>¡PDF Descargado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Generando PDF...' : 'Descargar Archivo PDF (.pdf)'}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
              title="Abrir cuadro de impresión"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="p-8 sm:p-10 overflow-y-auto print:p-6 print:overflow-visible space-y-6 text-slate-800 font-sans leading-normal">
          {/* Header */}
          <div className="border-b-2 border-teal-800 pb-5 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-black text-sm">
                  JR
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-900">
                    JAIRRESTAURA CONSULTORIO DIGITAL
                  </h1>
                  <p className="text-[11px] font-semibold text-teal-800 tracking-wider uppercase">
                    Servicio Integral de Salud Mental y Orientación • Colombia
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Ley 1090 de 2006 • Decreto 780 de 2016 • Ley 1581 de 2012 (Habeas Data Clínico)
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Informe Clínico
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono">{report.id}</span>
              <p className="text-[10px] text-slate-500">{formatDate(report.date)}</p>
            </div>
          </div>

          <div className="text-center py-2 border-b border-slate-200">
            <h2 className="text-base font-extrabold uppercase text-slate-900 tracking-wide">
              {report.type}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">Propósito: {report.purpose}</p>
            <p className="text-[11px] text-slate-500">Dirigido a: {report.addressedTo}</p>
          </div>

          {/* Patient identification banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Paciente:</span>
              <span className="font-bold text-slate-900">{report.patientName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Documento:</span>
              <span className="font-semibold text-slate-800">{report.patientDocument}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Fecha de Emisión:</span>
              <span className="font-semibold text-slate-800">{formatDate(report.date)}</span>
            </div>
          </div>

          {/* Clinical sections */}
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1 mb-1.5">
                1. Resumen de Antecedentes Pertinentes
              </h3>
              <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                {report.backgroundSummary}
              </p>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1 mb-1.5">
                2. Hallazgos Clínicos y Procedimientos Realizados
              </h3>
              <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                {report.clinicalFindings}
              </p>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1 mb-1.5">
                3. Apreciación Diagnóstica
              </h3>
              <p className="text-slate-900 font-semibold leading-relaxed">
                {report.diagnosticAppraisal}
              </p>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1 mb-1.5">
                4. Intervenciones Terapéuticas y Enfoque
              </h3>
              <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                {report.therapeuticInterventions}
              </p>
            </div>

            {/* MANDATORY PHARMACOLOGICAL SECTION */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/80">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1.5 mb-2.5 flex items-center justify-between">
                <span>TRATAMIENTO FARMACOLÓGICO Y PRESCRIPCIÓN ASOCIADA</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Sección Normativa Obligatoria
                </span>
              </h3>

              {isPrescriptionValidated && prescription ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Fórmula Médica Psicofarmacológica Vigente y Validada ({prescription.id})
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Expedida: {formatDate(prescription.issueDate)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1">
                      <strong>Médico Psiquiatra Prescriptor:</strong> {prescription.psychiatristName} (
                      {prescription.psychiatristRegistration} - {prescription.psychiatristSpecialty})
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-700 uppercase">
                      Medicamentos Prescritos Validados:
                    </p>
                    {prescription.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1"
                      >
                        <div>
                          <strong className="text-slate-900">
                            {idx + 1}. {item.genericName}{' '}
                            {item.commercialName ? `(${item.commercialName})` : ''} — {item.concentration}
                          </strong>
                          <p className="text-slate-600 text-[11px]">
                            {item.dosage} cada {item.frequency} vía {item.route} por {item.duration}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            Cantidad: {item.totalQuantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 italic">
                    Referencia documental: Fórmula electrónica archivada bajo identificador {prescription.id} con constancia de entrega al paciente.
                  </p>
                </div>
              ) : (
                /* MANDATORY WARNING BANNER WHEN NO VALIDATED PRESCRIPTION EXISTS */
                <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>ADVERTENCIA OBLIGATORIA SOBRE TRATAMIENTO FARMACOLÓGICO</span>
                  </div>
                  <p className="text-xs font-semibold text-amber-900">
                    “Sin prescripción médica validada registrada en el expediente. Consulte con un médico autorizado para la valoración y eventual formulación.”
                  </p>
                  <p className="text-[10px] text-amber-800/80 mt-1">
                    Conforme al marco legal colombiano, los profesionales de Psicología o Consejería Pastoral no prescriben psicofármacos. Cualquier tratamiento medicamentoso debe ser indicado exclusivamente por un Médico Psiquiatra o General habilitado en ReTHUS.
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1 mb-1.5">
                5. Recomendaciones Terapéuticas y Plan de Continuidad
              </h3>
              <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line">
                {report.recommendations}
              </p>
            </div>

            {report.remissions && (
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1 mb-1.5">
                  6. Remisiones y Coordinación Interdisciplinaria
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {report.remissions}
                </p>
              </div>
            )}
          </div>

          {/* Signatures & Certification block */}
          <div className="mt-8 pt-6 border-t border-slate-300 flex justify-between items-end flex-wrap gap-4 text-xs">
            <div>
              <p className="text-[10px] text-slate-400">
                Identificador de Verificación del Documento:
              </p>
              <p className="text-[10px] font-mono text-slate-600">
                {report.signatureHash || 'CERT-HASH-PENDIENTE'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Ley 1581 de 2012 • Expediente Confidencial JAIRRESTAURA
              </p>
            </div>

            <div className="w-64 text-center">
              <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-2xs space-y-1">
                <p className="text-xs font-extrabold text-slate-900 leading-tight">
                  {report.professionalName}
                </p>
                <p className="text-[11px] text-slate-600">{report.professionalRole.toUpperCase()}</p>
                <p className="text-[10px] text-teal-900 font-mono font-bold">
                  {report.professionalRegistration}
                </p>
                <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-700 font-semibold pt-1 border-t border-slate-100">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Validado y Emitido</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                Firma del Profesional Responsable
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
