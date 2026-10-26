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
  AlertCircle,
  ClipboardCheck,
  Ban,
  Send,
  MessageSquare,
  Check,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PsychiatricPrescription, PrescriptionStatus } from '../../types';
import { formatDate, formatDateTime, generateHash } from '../../utils/formatters';
import { downloadPrescriptionPDF } from '../../utils/pdfGenerator';
import {
  validatePrescriptionConsistency,
  PrescriptionValidationResult,
} from '../../utils/consistencyValidator';
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
  const [auditingPrescription, setAuditingPrescription] = useState<PsychiatricPrescription | null>(null);

  // Observation / Return dialog
  const [observingPrescription, setObservingPrescription] = useState<PsychiatricPrescription | null>(null);
  const [observationText, setObservationText] = useState('');

  // Annulment dialog
  const [annullingPrescription, setAnnullingPrescription] = useState<PsychiatricPrescription | null>(null);
  const [annulmentReason, setAnnulmentReason] = useState('');

  // Signature dialog input
  const [doctorNotes, setDoctorNotes] = useState('');
  const [permissionDeniedMessage, setPermissionDeniedMessage] = useState<string | null>(null);

  const isPsychiatrist = currentProfile.role === 'psiquiatra';

  // Helper to map and check workflow states
  const normalizeStatus = (status: PrescriptionStatus): string => {
    switch (status) {
      case 'Borrador':
        return 'borrador';
      case 'Pendiente de revisión clínica':
      case 'Pendiente de Revisión Psiquiatra':
        return 'revision';
      case 'Observado o requiere corrección':
      case 'Observada / Devuelta':
        return 'observado';
      case 'Aprobado por el profesional':
        return 'aprobado';
      case 'Firmado':
      case 'Aprobada y Firmada por Psiquiatra':
        return 'firmado';
      case 'Emitido':
      case 'Emitida al Paciente':
        return 'emitido';
      case 'Anulado':
        return 'anulado';
      default:
        return 'otro';
    }
  };

  // Filtered list
  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosisLinked.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.items.some((i) => i.genericName.toLowerCase().includes(searchTerm.toLowerCase()));

    const norm = normalizeStatus(rx.status);
    const matchesStatus =
      statusFilter === 'todos'
        ? true
        : statusFilter === 'borradores'
        ? norm === 'borrador'
        : statusFilter === 'pendientes'
        ? norm === 'revision'
        : statusFilter === 'observados'
        ? norm === 'observado'
        : statusFilter === 'aprobados'
        ? norm === 'aprobado'
        : statusFilter === 'firmados'
        ? norm === 'firmado'
        : statusFilter === 'emitidos'
        ? norm === 'emitido'
        : statusFilter === 'anulados'
        ? norm === 'anulado'
        : true;

    return matchesSearch && matchesStatus;
  });

  // State Transition Handlers
  const handleSendToReview = (rx: PsychiatricPrescription) => {
    const now = new Date().toISOString();
    updatePrescription(rx.id, {
      status: 'Pendiente de revisión clínica',
      historyOfChanges: [
        ...(rx.historyOfChanges || []),
        {
          timestamp: now,
          author: `${currentProfile.name} (${currentProfile.title})`,
          action: 'Envío a Revisión Clínica',
          details: 'Prescripción enviada a bandeja de validación médica especializada.',
        },
      ],
    });
  };

  const handleOpenObserveDialog = (rx: PsychiatricPrescription) => {
    setObservingPrescription(rx);
    setObservationText('');
  };

  const handleConfirmObservation = () => {
    if (!observingPrescription || !observationText.trim()) {
      alert('Debe ingresar el motivo u observaciones de corrección clínica.');
      return;
    }
    const now = new Date().toISOString();
    updatePrescription(observingPrescription.id, {
      status: 'Observado o requiere corrección',
      observationNotes: observationText.trim(),
      historyOfChanges: [
        ...(observingPrescription.historyOfChanges || []),
        {
          timestamp: now,
          author: `${currentProfile.name} (${currentProfile.title})`,
          action: 'Fórmula Devuelta con Observaciones',
          details: observationText.trim(),
        },
      ],
    });
    setObservingPrescription(null);
  };

  const handleDirectApprove = (rx: PsychiatricPrescription) => {
    if (!isPsychiatrist || !currentProfile.canSignPrescriptions) {
      setPermissionDeniedMessage(
        `Operación Denegada: Su sesión actual corresponde a "${currentProfile.title}" (${currentProfile.name}). Conforme a la legislación colombiana (Ley 1164 de 2007 y Decreto 780 de 2016), solo los Médicos Especialistas en Psiquiatría acreditados en ReTHUS están legalmente facultados para aprobar tratamientos psicofarmacológicos.`
      );
      return;
    }
    const now = new Date().toISOString();
    updatePrescription(rx.id, {
      status: 'Aprobado por el profesional',
      historyOfChanges: [
        ...(rx.historyOfChanges || []),
        {
          timestamp: now,
          author: `${currentProfile.name} (Psiquiatra ReTHUS ${currentProfile.registrationNumber})`,
          action: 'Aprobación Clínica Especializada',
          details: 'Fórmula validada y aprobada para posterior firma digital y emisión.',
        },
      ],
    });
  };

  const handleInitiateSign = (rx: PsychiatricPrescription) => {
    if (!isPsychiatrist || !currentProfile.canSignPrescriptions) {
      setPermissionDeniedMessage(
        `Operación Denegada: Su sesión actual corresponde a "${currentProfile.title}" (${currentProfile.name}). Conforme a la legislación colombiana (Ley 1164 de 2007, Resolución 1403 de 2007 y Decreto 780 de 2016), el registro de un médico o profesional por sí solo no otorga facultades para prescribir psicofármacos: solo el Médico Especialista en Psiquiatría acreditado en ReTHUS está autorizado para firmar prescripciones psicotrópicas.`
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

  const handleEmitToPatient = (rx: PsychiatricPrescription) => {
    const isSignedOrApproved =
      rx.status === 'Firmado' ||
      rx.status === 'Aprobada y Firmada por Psiquiatra' ||
      rx.status === 'Aprobado por el profesional';

    if (!isSignedOrApproved) {
      alert('Una prescripción no puede emitirse formalmente sin antes haber sido revisada y aprobada/firmada por el Médico Psiquiatra.');
      return;
    }

    const now = new Date().toISOString();
    updatePrescription(rx.id, {
      status: 'Emitido',
      historyOfChanges: [
        ...(rx.historyOfChanges || []),
        {
          timestamp: now,
          author: `${currentProfile.name} (${currentProfile.title})`,
          action: 'Emisión Oficial al Paciente',
          details: 'Documento expedido y entregado formalmente al paciente o acudiente.',
        },
      ],
    });
    // Open receipt modal directly to facilitate record
    setSelectedForReceipt({ ...rx, status: 'Emitido' });
  };

  const handleOpenAnnulDialog = (rx: PsychiatricPrescription) => {
    setAnnullingPrescription(rx);
    setAnnulmentReason('');
  };

  const handleConfirmAnnulment = () => {
    if (!annullingPrescription || !annulmentReason.trim()) {
      alert('Debe documentar la causal clínica o administrativa de anulación.');
      return;
    }
    const now = new Date().toISOString();
    updatePrescription(annullingPrescription.id, {
      status: 'Anulado',
      cancellationReason: annulmentReason.trim(),
      cancelledAt: now,
      cancelledBy: `${currentProfile.name} (${currentProfile.title})`,
      historyOfChanges: [
        ...(annullingPrescription.historyOfChanges || []),
        {
          timestamp: now,
          author: `${currentProfile.name} (${currentProfile.title})`,
          action: 'Anulación de Fórmula Médica',
          details: `Motivo: ${annulmentReason.trim()}`,
        },
      ],
    });
    setAnnullingPrescription(null);
  };

  const getStatusBadge = (status: PrescriptionStatus) => {
    switch (status) {
      case 'Aprobada y Firmada por Psiquiatra':
      case 'Firmado':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Emitida al Paciente':
      case 'Emitido':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300 dark:border-teal-700';
      case 'Aprobado por el profesional':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Pendiente de Revisión Psiquiatra':
      case 'Pendiente de revisión clínica':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Observada / Devuelta':
      case 'Observado o requiere corrección':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'Anulado':
        return 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-700 line-through';
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
                  Motor de Fórmulas Médicas & Prescripción Psicofarmacológica
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control institucional por Secciones A-D, auditoría posológica, 7 estados de ciclo de vida y firma ReTHUS
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
                Médico Psiquiatra Prescriptor Responsable: Dr. Jair Morales Restrepo (ReTHUS 1032489-COL)
              </span>
              <span>
                Resolución 1403 de 2007 • Decreto 780 de 2016 • Secciones A, B, C, D normalizadas • Validez legal de 30 días.
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
              {isPsychiatrist ? '✓ Perfil Habilitado para Aprobar y Firmar' : '⚠ Perfil Colaborativo (Requiere firma de Dr. Jair)'}
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'todos', label: 'Todas' },
            { id: 'borradores', label: 'Borradores' },
            { id: 'pendientes', label: 'Pendientes Revisión' },
            { id: 'observados', label: 'Observadas' },
            { id: 'aprobados', label: 'Aprobadas' },
            { id: 'firmados', label: 'Firmadas' },
            { id: 'emitidos', label: 'Emitidas' },
            { id: 'anulados', label: 'Anuladas' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                statusFilter === f.id
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs font-semibold'
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
              No se encontraron fórmulas médicas con estos criterios
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pruebe cambiando los filtros de estado o registre una nueva prescripción.
            </p>
          </div>
        ) : (
          filteredPrescriptions.map((rx) => {
            const norm = normalizeStatus(rx.status);
            const isSigned = norm === 'firmado' || norm === 'emitido';
            const isApproved = norm === 'aprobado' || isSigned;
            const isDraft = norm === 'borrador';
            const isPendingReview = norm === 'revision';
            const isObserved = norm === 'observado';
            const isAnnulled = norm === 'anulado';
            const isEmitted = norm === 'emitido';

            // Run consistency check on the fly for badge indicator
            const valResult = validatePrescriptionConsistency(rx);

            return (
              <div
                key={rx.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-2xs transition space-y-4 ${
                  isAnnulled
                    ? 'border-red-200 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isAnnulled
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : isSigned
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : isObserved
                          ? 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                          : 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                      }`}
                    >
                      {isAnnulled ? '✕' : 'RX'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                          {rx.id}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold">
                          v{rx.version}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getStatusBadge(
                            rx.status
                          )}`}
                        >
                          {rx.status}
                        </span>

                        {/* Consistency state chip */}
                        {valResult.isValid ? (
                          <span
                            onClick={() => setAuditingPrescription(rx)}
                            className="cursor-pointer text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 font-medium hover:bg-emerald-100"
                            title="Auditoría de consistencia y posología verificada"
                          >
                            <ClipboardCheck className="w-3 h-3 text-emerald-600" />
                            <span>Consistencia OK</span>
                          </span>
                        ) : (
                          <span
                            onClick={() => setAuditingPrescription(rx)}
                            className="cursor-pointer text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 font-medium hover:bg-amber-100"
                            title="Haga clic para ver observaciones de posología o datos faltantes"
                          >
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Observaciones ({valResult.issues.length})</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        Paciente: {rx.patientName} ({rx.patientDocumentType} {rx.patientDocumentNumber})
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-center">
                    {/* Workflow: Send to Review */}
                    {(isDraft || isObserved) && (
                      <button
                        onClick={() => handleSendToReview(rx)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition flex items-center gap-1"
                        title="Enviar borrador a revisión por parte del Médico Psiquiatra"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar a Revisión</span>
                      </button>
                    )}

                    {/* Workflow: Observe / Return */}
                    {isPendingReview && (
                      <button
                        onClick={() => handleOpenObserveDialog(rx)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-300 dark:border-orange-800 transition flex items-center gap-1"
                        title="Devolver con observaciones para corrección"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                        <span>Observar</span>
                      </button>
                    )}

                    {/* Workflow: Direct Approve (Psychiatrist only) */}
                    {isPendingReview && (
                      <button
                        onClick={() => handleDirectApprove(rx)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-2xs transition flex items-center gap-1"
                        title="Aprobar clínicamente (solo Médico Psiquiatra)"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprobar</span>
                      </button>
                    )}

                    {/* Workflow: Sign (Psychiatrist only) */}
                    {(isPendingReview || norm === 'aprobado') && (
                      <button
                        onClick={() => handleInitiateSign(rx)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition flex items-center gap-1"
                        title="Firmar digitalmente con registro ReTHUS"
                      >
                        <FileSignature className="w-3.5 h-3.5" />
                        <span>Firmar ReTHUS</span>
                      </button>
                    )}

                    {/* Workflow: Emit to patient */}
                    {isSigned && !isEmitted && (
                      <button
                        onClick={() => handleEmitToPatient(rx)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-2xs transition flex items-center gap-1"
                        title="Emitir fórmula oficialmente al paciente"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Emitir al Paciente</span>
                      </button>
                    )}

                    {/* Action: Patient Receipt Modal */}
                    {isSigned && (
                      <button
                        onClick={() => setSelectedForReceipt(rx)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 border ${
                          rx.patientReceipt
                            ? 'bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                        title="Gestionar constancia formal de entrega y firma del receptor"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>{rx.patientReceipt ? 'Constancia OK' : 'Constancia'}</span>
                      </button>
                    )}

                    {/* Action: Direct Download PDF */}
                    <button
                      onClick={() => downloadPrescriptionPDF(rx)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white shadow-2xs transition flex items-center gap-1"
                      title="Descargar archivo .pdf vectorizado A4 oficial"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>

                    {/* Action: Print / PDF Sheet View */}
                    <button
                      onClick={() => setSelectedForPrint(rx)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                      title="Ver vista previa oficial e imprimir"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-600" />
                      <span>Vista Previa</span>
                    </button>

                    {/* Action: Pre-emission consistency audit modal */}
                    <button
                      onClick={() => setAuditingPrescription(rx)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Auditar consistencia clínica y posológica"
                    >
                      <ClipboardCheck className="w-4 h-4 text-teal-600" />
                    </button>

                    {/* Action: History of modifications */}
                    <button
                      onClick={() => setViewHistoryPrescription(rx)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Ver historial de cambios y versiones"
                    >
                      <History className="w-4 h-4" />
                    </button>

                    {/* Action: Edit (Generates new controlled version) */}
                    {!isAnnulled && (
                      <button
                        onClick={() => setSelectedForEdit(rx)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Modificar (Crea nueva versión controlada)"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* Action: Annul prescription */}
                    {!isAnnulled && (
                      <button
                        onClick={() => handleOpenAnnulDialog(rx)}
                        className="p-1.5 text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Anular prescripción médica"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Annulment banner if applicable */}
                {isAnnulled && (
                  <div className="p-3 rounded-lg bg-red-100/70 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-xs text-red-900 dark:text-red-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>FÓRMULA MÉDICA ANULADA — SIN VALIDEZ DISPENSATORIA</span>
                    </div>
                    <p className="text-[11px]">
                      <strong>Motivo de anulación:</strong> {rx.cancellationReason || 'Anulada administrativamente'}
                    </p>
                    <p className="text-[10px] text-red-700 dark:text-red-400">
                      Anulada por: {rx.cancelledBy || 'Profesional responsable'} el {rx.cancelledAt ? formatDateTime(rx.cancelledAt) : 'Fecha no registrada'}.
                    </p>
                  </div>
                )}

                {/* Observation Notes if applicable */}
                {rx.observationNotes && isObserved && (
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs text-orange-900 dark:text-orange-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <MessageSquare className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>Observaciones para corrección clínica:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{rx.observationNotes}</p>
                  </div>
                )}

                {/* Section B: Items Detail Grid */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Sección B — Medicamentos Prescritos ({rx.items.length})</span>
                    <span className="text-[10px] font-normal lowercase text-slate-400">
                      Resolución 1403 de 2007
                    </span>
                  </div>
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
                        {item.particularInstructions && (
                          <p className="text-slate-600 dark:text-slate-400 text-[11px] italic">
                            «{item.particularInstructions}»
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer metadata & Digital Signature info */}
                <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 flex-wrap">
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

                  <div className="flex items-center gap-2 flex-wrap">
                    {isSigned ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Autorización Verificada: {rx.psychiatristName} ({rx.psychiatristRegistration})
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Pendiente de firma médica ReTHUS
                      </span>
                    )}

                    {rx.patientReceipt && (
                      <span className="ml-2 text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Constancia de recepción registrada
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Consistency & Posological Audit Modal */}
      {auditingPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <ClipboardCheck className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    Auditoría de Consistencia y Reglas de Prescripción
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Fórmula {auditingPrescription.id} (v{auditingPrescription.version}) • {auditingPrescription.patientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAuditingPrescription(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {(() => {
                const res = validatePrescriptionConsistency(auditingPrescription);
                const errors = res.issues.filter((i) => i.type === 'error');
                const warnings = res.issues.filter((i) => i.type === 'warning');
                const infos = res.issues.filter((i) => i.type === 'info');

                return (
                  <>
                    {/* Status Diagnostic Card */}
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3 ${
                        res.isValid
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                          : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
                      }`}
                    >
                      {res.isValid ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-bold text-sm">
                          {res.isValid
                            ? 'Fórmula Apta para Emisión y Dispensación'
                            : 'Fórmula con Inconsistencias o Requisitos Pendientes'}
                        </h4>
                        <p className="text-[11px] mt-0.5 opacity-90">
                          {res.isValid
                            ? 'Cumple con los requisitos esenciales de la Resolución 1403 de 2007 y Decreto 780 de 2016.'
                            : 'Corrija los campos señalados antes de proceder a la firma oficial o emisión al paciente.'}
                        </p>
                      </div>
                    </div>

                    {/* Section-by-Section Inspection */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                        Verificación por Secciones Institucionales:
                      </h4>

                      {/* Section A */}
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-900 dark:text-white">
                            Sección A — Identificación del Paciente & Diagnóstico
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400">✓ Conforme</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          Paciente: {auditingPrescription.patientName} • {auditingPrescription.patientDocumentType} {auditingPrescription.patientDocumentNumber} • Diagnóstico: {auditingPrescription.diagnosisLinked}
                        </p>
                      </div>

                      {/* Section B */}
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-900 dark:text-white">
                            Sección B — Medicamentos & Coherencia Posológica
                          </span>
                          <span className={warnings.length > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                            {warnings.length > 0 ? '⚠ Posología Observada' : '✓ Conforme'}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          {auditingPrescription.items.length} medicamento(s) prescrito(s) en Denominación Común Internacional (DCI).
                        </p>
                      </div>

                      {/* Section C */}
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-900 dark:text-white">
                            Sección C — Prescriptor Acreditado ReTHUS
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400">✓ Conforme</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          {auditingPrescription.psychiatristName} ({auditingPrescription.psychiatristRegistration})
                        </p>
                      </div>

                      {/* Section D */}
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-900 dark:text-white">
                            Sección D — Vigencia & Validez de Firma
                          </span>
                          <span className={auditingPrescription.psychiatristSignatureHash ? 'text-emerald-600' : 'text-amber-600'}>
                            {auditingPrescription.psychiatristSignatureHash ? '✓ Verificada' : '⏳ Pendiente'}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          Expedición: {formatDate(auditingPrescription.issueDate)} • Vencimiento: {formatDate(auditingPrescription.expiryDate)}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Issues List */}
                    {res.issues.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                          Observaciones Detalladas del Validador:
                        </h4>
                        <div className="space-y-1.5">
                          {res.issues.map((iss, i) => (
                            <div
                              key={i}
                              className={`p-2.5 rounded-lg border text-[11px] flex items-start gap-2 ${
                                iss.type === 'error'
                                  ? 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-200'
                                  : iss.type === 'warning'
                                  ? 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200'
                                  : 'bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {iss.type === 'error' ? (
                                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              ) : iss.type === 'warning' ? (
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              ) : (
                                <ClipboardCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span className="font-semibold uppercase text-[10px] tracking-wider block">
                                  {iss.field}:
                                </span>
                                <span>{iss.message}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedForPrint(auditingPrescription);
                  setAuditingPrescription(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-teal-600" />
                <span>Ver Hoja A4</span>
              </button>

              <button
                type="button"
                onClick={() => setAuditingPrescription(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Cerrar Auditoría
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Observation Dialog */}
      {observingPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full border border-orange-200 dark:border-orange-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <MessageSquare className="w-5 h-5" />
              <h3 className="text-sm font-bold">Observar o Requerir Corrección</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Indique las razones clínicas o inconsistencias para devolver la fórmula {observingPrescription.id} al profesional creador.
            </p>
            <textarea
              rows={4}
              required
              value={observationText}
              onChange={(e) => setObservationText(e.target.value)}
              placeholder="Ej. Revisar la posología de Sertralina: se indica 30 días pero la cantidad total solo contempla 15 tabletas. Verificar también diagnóstico CIE-10."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500"
            />
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setObservingPrescription(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmObservation}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-xs transition"
              >
                Confirmar Observación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Annulment Dialog */}
      {annullingPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full border border-red-200 dark:border-red-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Ban className="w-5 h-5" />
              <h3 className="text-sm font-bold">Anulación de Prescripción Médica</h3>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-[11px] text-red-900 dark:text-red-300 leading-snug">
              Conforme a la normativa colombiana de Historia Clínica (Resolución 1995/1999 y Ley 2015/2020), ningún documento clínico es eliminado físicamente. La fórmula permanecerá en el expediente con estado inmutable «ANULADO» y marca de agua disuasoria.
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                Motivo Clínico o Administrativo de Anulación*:
              </label>
              <textarea
                rows={3}
                required
                value={annulmentReason}
                onChange={(e) => setAnnulmentReason(e.target.value)}
                placeholder="Ej. Cambio de esquema terapéutico por reacción adversa reportada por el paciente; prescripción sustituida por nueva orden."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setAnnullingPrescription(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmAnnulment}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-xs transition"
              >
                Proceder a Anular
              </button>
            </div>
          </div>
        </div>
      )}

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
                Al confirmar, se estampará un sello criptográfico SHA-256 inmutable asociado a su número de registro ReTHUS. La fórmula pasará al estado "Firmado" y podrá ser emitida al paciente.
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
