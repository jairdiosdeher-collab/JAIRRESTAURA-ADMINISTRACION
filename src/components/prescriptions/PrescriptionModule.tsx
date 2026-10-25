import React, { useState } from 'react';
import {
  Pill,
  Plus,
  ShieldCheck,
  CheckCircle,
  FileText,
  Printer,
  History,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  Lock,
  ExternalLink,
  ChevronRight,
  Eye,
  FileSignature,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PsychiatricPrescription, PrescriptionStatus } from '../../types';
import { formatDate, formatDateTime, generateHash } from '../../utils/formatters';
import { downloadPrescriptionPDF } from '../../utils/pdfGenerator';
import { PrescriptionPrintView } from './PrescriptionPrintView';
import { PrescriptionModal } from './PrescriptionModal';
import { PatientReceiptModal } from './PatientReceiptModal';

export const PrescriptionModule: React.FC = () => {
  const {
    prescriptions,
    currentProfile,
    approveAndSignPrescription,
    updatePrescription,
    registerPatientReceipt,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Modals state
  const [selectedForPrint, setSelectedForPrint] = useState<PsychiatricPrescription | null>(null);
  const [selectedForReceipt, setSelectedForReceipt] = useState<PsychiatricPrescription | null>(null);
  const [selectedForEdit, setSelectedForEdit] = useState<PsychiatricPrescription | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [signingPrescription, setSigningPrescription] = useState<PsychiatricPrescription | null>(null);
  const [viewHistoryPrescription, setViewHistoryPrescription] = useState<PsychiatricPrescription | null>(null);

  // Signature dialog input
  const [doctorNotes, setDoctorNotes] = useState('');
  const [permissionDeniedMessage, setPermissionDeniedMessage] = useState<string | null>(null);

  const isPsychiatrist = currentProfile.role === 'psiquiatra';

  // Filtered list
  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosisLinked.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.items.some((i) => i.genericName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'todos'
        ? true
        : statusFilter === 'pendientes'
        ? rx.status === 'Pendiente de Revisión Psiquiatra' || rx.status === 'Borrador'
        : statusFilter === 'firmadas'
        ? rx.status === 'Aprobada y Firmada por Psiquiatra'
        : statusFilter === 'emitidas'
        ? rx.status === 'Emitida al Paciente'
        : rx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleInitiateSign = (rx: PsychiatricPrescription) => {
    if (!isPsychiatrist) {
      setPermissionDeniedMessage(
        `Operación Denegada: Su sesión actual corresponde a "${currentProfile.title}". Conforme a la legislación colombiana (Ley 1098 de 2006, Ley 1164 de 2007 y Decreto 780 de 2016), solo el Médico Especialista en Psiquiatría (Dr. Jair Morales Restrepo) está legalmente autorizado para aprobar y firmar prescripciones psicofarmacológicas. Puede cambiar al perfil del Dr. Jair en el selector superior para firmar esta fórmula.`
      );
      return;
    }
    setDoctorNotes('');
    setSigningPrescription(rx);
  };

  const handleConfirmSignature = () => {
    if (!signingPrescription) return;
    const generatedSig = generateHash(
      `${signingPrescription.id}-${signingPrescription.patientDocumentNumber}-${currentProfile.registrationNumber}-${Date.now()}`
    );
    const result = approveAndSignPrescription(
      signingPrescription.id,
      generatedSig,
      doctorNotes
    );
    if (!result.success) {
      alert(result.error);
    } else {
      setSigningPrescription(null);
    }
  };

  const getStatusBadge = (status: PrescriptionStatus) => {
    switch (status) {
      case 'Aprobada y Firmada por Psiquiatra':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Emitida al Paciente':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-700';
      case 'Pendiente de Revisión Psiquiatra':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Observada / Devuelta':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'Suspendida / Finalizada':
        return 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Context Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Pill className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Prescripción Psicofarmacológica — Psiquiatría Médica
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control estricto de fórmulas médicas, trazabilidad de versiones, firma digital ReTHUS y constancias de entrega
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Fórmula Médica</span>
            </button>
          </div>
        </div>

        {/* Regulatory Banner */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <div className="text-slate-700 dark:text-slate-300 leading-snug">
              <span className="font-bold block text-slate-900 dark:text-white">
                Médico Psiquiatra Responsable: Dr. Jair Morales Restrepo (ReTHUS 1032489-COL)
              </span>
              <span>
                Resolución 1403 de 2007 • Se prohíbe la prescripción automática o simulada por IA • Validez de fórmulas: 30 días.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] border ${
                isPsychiatrist
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {isPsychiatrist ? '✓ Habilitado para firmar fórmulas' : '⚠ Sesión con permiso de solo consulta/propuesta'}
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por paciente, medicamento (ej. Sertralina), CIE-10 o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'todos', label: 'Todas' },
            { id: 'pendientes', label: 'Pendientes Psiquiatra' },
            { id: 'firmadas', label: 'Firmadas' },
            { id: 'emitidas', label: 'Entregadas a Paciente' },
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

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <Pill className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No se encontraron fórmulas con estos criterios
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pruebe cambiando los filtros de búsqueda o registre una nueva prescripción.
            </p>
          </div>
        ) : (
          filteredPrescriptions.map((rx) => {
            const isSigned =
              rx.status === 'Aprobada y Firmada por Psiquiatra' ||
              rx.status === 'Emitida al Paciente';
            const isPending =
              rx.status === 'Pendiente de Revisión Psiquiatra' || rx.status === 'Borrador';

            return (
              <div
                key={rx.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
                      RX
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                          {rx.id}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          Versión {rx.version}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getStatusBadge(
                            rx.status
                          )}`}
                        >
                          {rx.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        Paciente: {rx.patientName} ({rx.patientDocumentType} {rx.patientDocumentNumber})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
                    {/* Action: Sign (Only enabled for Psychiatrist) */}
                    {isPending && (
                      <button
                        onClick={() => handleInitiateSign(rx)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition flex items-center gap-1.5"
                        title={
                          isPsychiatrist
                            ? 'Aprobar y firmar digitalmente con registro ReTHUS'
                            : 'Requiere sesión de Médico Psiquiatra'
                        }
                      >
                        <FileSignature className="w-3.5 h-3.5" />
                        <span>Aprobar y Firmar</span>
                      </button>
                    )}

                    {/* Action: Patient Receipt */}
                    {isSigned && !rx.patientReceipt && (
                      <button
                        onClick={() => setSelectedForReceipt(rx)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Constancia Paciente</span>
                      </button>
                    )}

                    {/* Action: Direct Download PDF */}
                    <button
                      onClick={() => downloadPrescriptionPDF(rx)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition flex items-center gap-1.5"
                      title="Descargar archivo .pdf directamente a su equipo"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar PDF</span>
                    </button>

                    {/* Action: Print / PDF Modal */}
                    <button
                      onClick={() => setSelectedForPrint(rx)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                      title="Ver vista previa oficial e imprimir"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-600" />
                      <span>Vista Previa</span>
                    </button>

                    {/* Action: History of modifications */}
                    <button
                      onClick={() => setViewHistoryPrescription(rx)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                      title="Ver historial de cambios y versiones"
                    >
                      <History className="w-4 h-4" />
                    </button>

                    {/* Action: Edit (Generates new controlled version) */}
                    <button
                      onClick={() => setSelectedForEdit(rx)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                      title="Modificar (Crea nueva versión)"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Items Detail Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {rx.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {idx + 1}. {item.genericName} {item.commercialName ? `(${item.commercialName})` : ''}
                        </span>
                        <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                          {item.concentration} • {item.pharmaceuticalForm}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>Posología:</strong> {item.dosage} cada {item.frequency} por {item.duration}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        <strong>Total:</strong> {item.totalQuantity} | <strong>Vía:</strong> {item.route}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer metadata & Digital Signature info */}
                <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span>
                      <strong>Expedición:</strong> {formatDate(rx.issueDate)}
                    </span>
                    <span>•</span>
                    <span>
                      <strong>Vigencia:</strong> {formatDate(rx.expiryDate)}
                    </span>
                    <span>•</span>
                    <span>
                      <strong>Dx:</strong> {rx.diagnosisLinked}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSigned ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Firmado por: {rx.psychiatristName} ({rx.psychiatristRegistration})
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        ⚠ Pendiente de firma y validación médica
                      </span>
                    )}

                    {rx.patientReceipt && (
                      <span className="ml-2 text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Constancia de entrega registrada
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Signature Modal (Only active for Psychiatrist) */}
      {signingPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">Aprobación y Firma Digital de Prescripción</h3>
                  <p className="text-[11px] text-slate-400">
                    Fórmula {signingPrescription.id} • {signingPrescription.patientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSigningPrescription(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1.5 text-teal-950 dark:text-teal-200">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Certificación Profesional ReTHUS</span>
                </div>
                <p>
                  <strong>Médico Especialista:</strong> {currentProfile.name}
                </p>
                <p>
                  <strong>Registro Profesional:</strong> {currentProfile.registrationNumber}
                </p>
                <p>
                  <strong>Especialidad:</strong> {currentProfile.title}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observaciones Clínicas o Indicaciones del Psiquiatra:
                </label>
                <textarea
                  rows={3}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Se verifica indicación terapéutica, tolerancia previa y compatibilidad farmacológica conforme al Decreto 780 de 2016..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-[11px] text-slate-600 dark:text-slate-300">
                Al confirmar, se estampará un sello criptográfico SHA-256 inmutable asociado a su número de registro ReTHUS. La fórmula pasará al estado "Aprobada y Firmada" y podrá ser emitida al paciente.
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSigningPrescription(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSignature}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition"
                >
                  Confirmar Firma Médica Digital
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Denied Modal */}
      {permissionDeniedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full border border-red-200 dark:border-red-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Restricción de Habilitación Legal
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {permissionDeniedMessage}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPermissionDeniedMessage(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Comprendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History of Changes Drawer/Modal */}
      {viewHistoryPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 dark:border-slate-700 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Historial de Cambios y Versiones: {viewHistoryPrescription.id}
                </h3>
              </div>
              <button
                onClick={() => setViewHistoryPrescription(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto text-xs">
              {(viewHistoryPrescription.historyOfChanges || []).map((h, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-teal-700 dark:text-teal-400">
                      {h.action}
                    </span>
                    <span>{formatDateTime(h.timestamp)}</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{h.author}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">{h.details}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewHistoryPrescription(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Sheet View */}
      {selectedForPrint && (
        <PrescriptionPrintView
          prescription={selectedForPrint}
          onClose={() => setSelectedForPrint(null)}
        />
      )}

      {/* Patient Receipt Record Modal */}
      {selectedForReceipt && (
        <PatientReceiptModal
          prescription={selectedForReceipt}
          onClose={() => setSelectedForReceipt(null)}
          onSaveReceipt={registerPatientReceipt}
        />
      )}

      {/* Creation / Edition Modal */}
      {(isNewModalOpen || selectedForEdit) && (
        <PrescriptionModal
          existingPrescription={selectedForEdit || undefined}
          onClose={() => {
            setIsNewModalOpen(false);
            setSelectedForEdit(null);
          }}
        />
      )}
    </div>
  );
};
