import React, { useState } from 'react';
import {
  Printer,
  ShieldCheck,
  CheckCircle,
  FileText,
  AlertTriangle,
  QrCode,
  X,
  Download,
  Check,
} from 'lucide-react';
import { PsychiatricPrescription } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { downloadPrescriptionPDF } from '../../utils/pdfGenerator';

interface PrescriptionPrintViewProps {
  prescription: PsychiatricPrescription;
  onClose: () => void;
}

export const PrescriptionPrintView: React.FC<PrescriptionPrintViewProps> = ({
  prescription,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = () => {
    try {
      setDownloading(true);
      downloadPrescriptionPDF(prescription);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Hubo un error al generar el archivo PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isSigned =
    prescription.status === 'Aprobada y Firmada por Psiquiatra' ||
    prescription.status === 'Emitida al Paciente';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:rounded-none flex flex-col max-h-[96vh] print:max-h-none">
        {/* Screen Header Controls (Hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-600 text-white">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold">Fórmula Médica Psicofarmacológica Oficial</h2>
              <p className="text-xs text-slate-400">
                {prescription.id} • Versión {prescription.version} • {prescription.patientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary Action: Direct Download PDF File */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition disabled:opacity-50"
              title="Descarga el documento en formato .pdf a su dispositivo"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>¡PDF Descargado con Éxito!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Generando PDF...' : 'Descargar Archivo PDF (.pdf)'}</span>
                </>
              )}
            </button>

            {/* Secondary Action: Print */}
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

        {/* Printable Document Sheet */}
        <div className="p-8 sm:p-10 overflow-y-auto print:p-6 print:overflow-visible space-y-6 text-slate-800 font-sans leading-normal">
          {/* Official Colombian Medical Prescription Header */}
          <div className="border-b-2 border-teal-800 pb-5">
            <div className="flex justify-between items-start">
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
                      Servicio de Salud Mental, Psiquiatría y Orientación Integral
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Habilitación en Salud: Decreto 780 de 2016 • Resolución 1403 de 2007 • Bogotá D.C., Colombia
                </p>
              </div>

              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded-md bg-slate-100 border border-slate-300 text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Fórmula Médica No.
                  </div>
                  <div className="text-base font-black text-teal-900 font-mono tracking-wider">
                    {prescription.id}
                  </div>
                  <div className="text-[9px] text-slate-500">v{prescription.version}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status Warning if not signed or annulled */}
          {prescription.status === 'Anulado' ? (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-300 text-red-900 flex items-center gap-2.5 text-xs">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <strong className="font-bold">DOCUMENTO ANULADO ADMINISTRATIVAMENTE</strong>
                <p className="text-[11px]">
                  Esta fórmula ha sido anulada y carece de validez clínica o farmacéutica. Motivo: {prescription.cancellationReason || 'Anulada por el profesional responsable'}.
                </p>
              </div>
            </div>
          ) : !isSigned ? (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-2.5 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="font-bold">DOCUMENTO EN ESTADO: {prescription.status.toUpperCase()}</strong>
                <p className="text-[11px]">
                  Este borrador no tiene validez legal de dispensación farmacéutica hasta que sea debidamente aprobado y firmado por el Médico Psiquiatra autorizado.
                </p>
              </div>
            </div>
          ) : null}

          {/* SECCIÓN A: Identificación del Paciente */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1.5 mb-2.5">
              SECCIÓN A — IDENTIFICACIÓN DEL PACIENTE
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Nombre Completo:</span>
                <span className="font-bold text-slate-900">{prescription.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Documento de Identidad:</span>
                <span className="font-semibold text-slate-800">
                  {prescription.patientDocumentType} {prescription.patientDocumentNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Fecha de Expedición:</span>
                <span className="font-semibold text-slate-800">{formatDate(prescription.issueDate)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Fecha de Vencimiento:</span>
                <span className="font-semibold text-slate-800">{formatDate(prescription.expiryDate)}</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase">Diagnóstico Clínico Asociado:</span>
                <p className="font-semibold text-slate-900">{prescription.diagnosisLinked}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase">Justificación Terapéutica:</span>
                <p className="text-slate-700 italic">{prescription.clinicalJustification}</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN B: Prescripción Médica */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-slate-200 pb-1.5 mb-3 flex items-center justify-between">
              <span>SECCIÓN B — PRESCRIPCIÓN MÉDICA (Detalle de Medicamentos)</span>
              <span className="text-[10px] text-slate-500 font-normal">
                Dispensación estrictamente sujeta a prescripción médica
              </span>
            </h3>

            <div className="space-y-4">
              {prescription.items.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-slate-300 rounded-xl p-4 bg-white shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          {item.genericName}
                          {item.commercialName && (
                            <span className="text-slate-500 text-xs font-medium ml-1.5">
                              ({item.commercialName})
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 mt-1">
                        <span><strong>Concentración:</strong> {item.concentration}</span>
                        <span>•</span>
                        <span><strong>Forma Farmacéutica:</strong> {item.pharmaceuticalForm}</span>
                        <span>•</span>
                        <span><strong>Vía:</strong> {item.route}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">Cantidad Total:</span>
                      <span className="text-xs font-black text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {item.totalQuantity}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong className="text-slate-800 block text-[10px] uppercase font-bold text-teal-900">
                        Posología e Indicaciones de Uso:
                      </strong>
                      <p className="text-slate-900 font-semibold mt-0.5">
                        Dosis: {item.dosage} — Frecuencia: {item.frequency}
                      </p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Duración del tratamiento: {item.duration}
                      </p>
                      {item.particularInstructions && (
                        <p className="text-slate-600 text-[11px] mt-1 border-t border-slate-200 pt-1">
                          <em>Instrucción especial:</em> {item.particularInstructions}
                        </p>
                      )}
                    </div>

                    <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200 text-amber-950">
                      <strong className="block text-[10px] uppercase font-bold text-amber-900">
                        Precauciones y Advertencias Clave:
                      </strong>
                      <p className="text-slate-700 text-[11px] mt-0.5">
                        {item.relevantPrecautions ||
                          'No suspender bruscamente sin indicación médica. Evitar el consumo concomitante de alcohol.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {prescription.observations && (
              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <strong className="text-slate-700 font-bold block text-[10px] uppercase">
                  Observaciones Generales del Médico Psiquiatra:
                </strong>
                <p className="text-slate-700 mt-0.5">{prescription.observations}</p>
              </div>
            )}
          </div>

          {/* SECCIÓN C: Identificación y Autorización del Prescriptor */}
          <div className="border border-teal-800/40 rounded-xl p-4 bg-teal-50/30">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal-900 border-b border-teal-200 pb-1.5 mb-3 flex items-center justify-between">
              <span>SECCIÓN C — IDENTIFICACIÓN Y AUTORIZACIÓN DEL PRESCRIPTOR</span>
              <span className="text-[10px] text-teal-800 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Habilitación Médica Certificada
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p>
                  <strong className="text-slate-600">Nombre completo del profesional:</strong>{' '}
                  <span className="font-bold text-slate-900">{prescription.psychiatristName}</span>
                </p>
                <p>
                  <strong className="text-slate-600">Especialidad:</strong>{' '}
                  <span>{prescription.psychiatristSpecialty}</span>
                </p>
                <p>
                  <strong className="text-slate-600">Registro profesional / ReTHUS:</strong>{' '}
                  <span className="font-mono font-bold text-teal-900">
                    {prescription.psychiatristRegistration}
                  </span>
                </p>
                <p>
                  <strong className="text-slate-600">Institución o consultorio:</strong>{' '}
                  <span>{prescription.psychiatristInstitution}</span>
                </p>
                <p>
                  <strong className="text-slate-600">Fecha y hora de aprobación:</strong>{' '}
                  <span>{prescription.signedAt ? formatDateTime(prescription.signedAt) : 'Pendiente de aprobación médica'}</span>
                </p>
              </div>

              {/* Signature Box */}
              <div className="flex flex-col justify-end items-center sm:items-end border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                <div className="w-64 text-center">
                  {isSigned ? (
                    <div className="p-3 rounded-lg bg-white border border-teal-300 shadow-2xs space-y-1 text-center">
                      <div className="flex items-center justify-center gap-1 text-teal-800 font-bold text-xs">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                        <span>AUTORIZACIÓN MÉDICA VERIFICADA</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">
                        {prescription.psychiatristName}
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono">
                        {prescription.psychiatristRegistration}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {formatDateTime(prescription.signedAt || prescription.issueDate)}
                      </p>
                    </div>
                  ) : (
                    <div className="h-20 border-b-2 border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-400 text-xs">
                      [Espacio reservado para firma del prescriptor]
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">
                    Firma del Médico Psiquiatra Autorizado
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN D: Constancia de Entrega */}
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 mb-2.5 flex items-center justify-between">
              <span>SECCIÓN D — CONSTANCIA DE ENTREGA</span>
              <span className="text-[10px] text-slate-500 font-normal">
                Recepción informada • No reemplaza la autorización del prescriptor
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p>
                  <strong className="text-slate-600">Nombre del paciente o representante:</strong>{' '}
                  <span className="font-semibold text-slate-900">
                    {prescription.patientReceipt?.patientOrGuardianName || prescription.patientName}
                  </span>
                </p>
                <p>
                  <strong className="text-slate-600">Documento de identidad:</strong>{' '}
                  <span className="font-semibold text-slate-900">
                    {prescription.patientReceipt?.documentNumber ||
                      `${prescription.patientDocumentType} ${prescription.patientDocumentNumber}`}
                  </span>
                </p>
                <p>
                  <strong className="text-slate-600">Documento entregado:</strong>{' '}
                  <span>Fórmula Médica {prescription.id} (Versión {prescription.version})</span>
                </p>
                <p>
                  <strong className="text-slate-600">Fecha de entrega:</strong>{' '}
                  <span>
                    {prescription.patientReceipt
                      ? formatDateTime(prescription.patientReceipt.receivedDate)
                      : 'Pendiente de entrega'}
                  </span>
                </p>
                <p>
                  <strong className="text-slate-600">Método de entrega:</strong>{' '}
                  <span>{prescription.patientReceipt?.signatureMethod || 'Físico / Digital'}</span>
                </p>
              </div>

              <div className="flex flex-col justify-end items-center sm:items-end">
                <div className="w-64 text-center">
                  {prescription.patientReceipt ? (
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] font-bold text-emerald-700 block">
                        RECEPCIÓN CONFIRMADA
                      </span>
                      <p className="text-[11px] font-bold text-slate-900">
                        {prescription.patientReceipt.patientOrGuardianName}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        Método: {prescription.patientReceipt.signatureMethod}
                      </p>
                    </div>
                  ) : (
                    <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-400 text-xs">
                      [Firma de constancia de recepción]
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">
                    Firma del Paciente o Representante Legal
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-2.5 italic leading-tight">
              Nota: La firma del paciente acredita exclusivamente la recepción de las instrucciones médicas y la fórmula correspondiente. No sustituye la firma del médico psiquiatra prescriptor.
            </p>
          </div>

          {/* Legal Footer */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[10px] text-slate-400 gap-2">
            <span>JAIRRESTAURA Consultorio Digital • Tel: (+57) 312 459 8812 • Bogotá D.C.</span>
            <span>Documento generado con trazabilidad criptográfica y auditoría Ley 1581</span>
          </div>
        </div>
      </div>
    </div>
  );
};
