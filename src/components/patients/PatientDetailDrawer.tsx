import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Activity,
  Target,
  Pill,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  Clock,
  Plus,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import { formatDate, calculateAge, formatCOP } from '../../utils/formatters';

interface PatientDetailDrawerProps {
  patient: Patient;
  onClose: () => void;
  onEdit: () => void;
  onOpenNewSoap: () => void;
  onOpenNewPrescription: () => void;
}

export const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({
  patient,
  onClose,
  onEdit,
  onOpenNewSoap,
  onOpenNewPrescription,
}) => {
  const {
    soapNotes,
    diagnostics,
    treatmentPlans,
    prescriptions,
    appointments,
    transactions,
    setActiveTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'resumen' | 'historia' | 'diagnosticos' | 'prescripciones' | 'planes' | 'citas' | 'pagos'
  >('resumen');

  const patientNotes = soapNotes.filter((n) => n.patientId === patient.id);
  const patientDx = diagnostics.filter((d) => d.patientId === patient.id);
  const patientTreatments = treatmentPlans.filter((t) => t.patientId === patient.id);
  const patientRx = prescriptions.filter((p) => p.patientId === patient.id);
  const patientApts = appointments.filter((a) => a.patientId === patient.id);
  const patientTrx = transactions.filter((t) => t.patientId === patient.id);

  const calculatedAge = calculateAge(patient.birthDate);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-800 text-teal-200 border border-teal-700">
                {patient.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                {patient.status}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-xs text-slate-300">
              {patient.documentType} {patient.documentNumber} • {calculatedAge} años • {patient.city}, {patient.department}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs font-medium flex items-center gap-1"
              title="Editar ficha del paciente"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Editar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-tabs navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto bg-slate-50 dark:bg-slate-900/70 shrink-0 text-xs py-2">
          {[
            { id: 'resumen', label: 'Ficha General' },
            { id: 'historia', label: `Historia SOAP (${patientNotes.length})` },
            { id: 'diagnosticos', label: `Diagnósticos (${patientDx.length})` },
            { id: 'prescripciones', label: `Fórmulas Psiquiatría (${patientRx.length})` },
            { id: 'planes', label: `Planes (${patientTreatments.length})` },
            { id: 'citas', label: `Citas (${patientApts.length})` },
            { id: 'pagos', label: `Finanzas (${patientTrx.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                activeSubTab === tab.id
                  ? 'bg-teal-700 text-white shadow-2xs dark:bg-teal-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* TAB 1: RESUMEN / FICHA GENERAL */}
          {activeSubTab === 'resumen' && (
            <div className="space-y-5">
              {/* Clinical Alerts Box */}
              {(patient.allergies.length > 0 || patient.medicalAlerts.length > 0) && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 text-amber-950 dark:text-amber-200">
                  <div className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Alertas Clínicas y Alergias Registradas</span>
                  </div>
                  {patient.allergies.length > 0 && (
                    <p>
                      <strong>Alergias:</strong> {patient.allergies.join(', ')}
                    </p>
                  )}
                  {patient.medicalAlerts.length > 0 && (
                    <p>
                      <strong>Factores de Riesgo / Antecedentes de Alerta:</strong>{' '}
                      {patient.medicalAlerts.join('; ')}
                    </p>
                  )}
                </div>
              )}

              {/* Demographics & Contact Grid */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Información Sociodemográfica y de Contacto
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Teléfono:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-teal-600" />
                      {patient.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Correo Electrónico:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-teal-600" />
                      {patient.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Ubicación:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      {patient.city}, {patient.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Fecha de Nacimiento:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDate(patient.birthDate)} ({calculatedAge} años)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Fecha de Ingreso:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDate(patient.admissionDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Profesional Responsable:</span>
                    <span className="font-semibold text-teal-800 dark:text-teal-300">
                      {patient.responsibleProfessionalName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Contacto de Emergencia
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <p><strong>Nombre:</strong> {patient.emergencyContact.name}</p>
                  <p><strong>Parentesco:</strong> {patient.emergencyContact.relationship}</p>
                  <p><strong>Teléfono:</strong> {patient.emergencyContact.phone}</p>
                </div>
              </div>

              {/* Legal Guardian (if present) */}
              {patient.legalGuardian && (
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800 space-y-1">
                  <h3 className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider text-[11px]">
                    Representante Legal / Tutor
                  </h3>
                  <p>
                    <strong>Nombre:</strong> {patient.legalGuardian.name} ({patient.legalGuardian.documentType} {patient.legalGuardian.documentNumber})
                  </p>
                  <p>
                    <strong>Parentesco:</strong> {patient.legalGuardian.relationship} | <strong>Contacto:</strong> {patient.legalGuardian.phone}
                  </p>
                </div>
              )}

              {/* Legal Consent & Habeas Data Banner */}
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    Consentimiento Informado y Ley 1581 de 2012
                  </span>
                  <p className="text-[11px] text-teal-800/80 dark:text-teal-300 mt-0.5">
                    Estado: {patient.hasSignedConsent ? 'Firmado y Aceptado' : 'Pendiente de Firma'} • Método: {patient.consentMethod || 'Aceptación Electrónica'}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>

              {/* General Notes */}
              {patient.generalNotes && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] block mb-1">
                    Notas Generales de Admisión:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{patient.generalNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HISTORIA CLÍNICA SOAP */}
          {activeSubTab === 'historia' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Notas de Evolución y Consulta SOAP
                </h3>
                <button
                  onClick={onOpenNewSoap}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva Nota SOAP</span>
                </button>
              </div>

              {patientNotes.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-xs">
                  Sin notas registradas aún para este paciente.
                </p>
              ) : (
                patientNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{note.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                          {note.type}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{formatDate(note.date)}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p>
                        <strong className="text-slate-800 dark:text-slate-200">S (Subjetivo):</strong>{' '}
                        {note.subjective}
                      </p>
                      <p>
                        <strong className="text-slate-800 dark:text-slate-200">O (Objetivo):</strong>{' '}
                        {note.objective}
                      </p>
                      <p>
                        <strong className="text-slate-800 dark:text-slate-200">A (Apreciación / Análisis):</strong>{' '}
                        {note.assessment}
                      </p>
                      <p>
                        <strong className="text-slate-800 dark:text-slate-200">P (Plan):</strong>{' '}
                        {note.plan}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Autor: {note.authorName} ({note.authorRole})</span>
                      <span className="font-mono text-[9px]">{note.hashIntegrity.slice(0, 20)}...</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: DIAGNÓSTICOS CIE */}
          {activeSubTab === 'diagnosticos' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Diagnósticos Registrados (CIE-10 / CIE-11)
              </h3>
              {patientDx.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-xs">
                  Sin diagnósticos asignados.
                </p>
              ) : (
                patientDx.map((dx) => (
                  <div
                    key={dx.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200">
                          {dx.codeCIE10}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {dx.description}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {dx.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Evidencia Documentada:</strong> {dx.clinicalEvidence}
                    </p>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Identificado: {formatDate(dx.dateIdentified)} por {dx.professionalName}</span>
                      <span>Tipo: {dx.type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PRESCRIPCIONES PSIQUIÁTRICAS */}
          {activeSubTab === 'prescripciones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Fórmulas Médicas Psicofarmacológicas
                </h3>
                <button
                  onClick={onOpenNewPrescription}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva Prescripción</span>
                </button>
              </div>

              {patientRx.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200">
                  <p className="font-semibold text-xs">
                    Sin prescripción médica validada registrada en el expediente.
                  </p>
                  <p className="text-[11px] mt-0.5">
                    Consulte con el médico psiquiatra autorizado para la valoración y eventual formulación.
                  </p>
                </div>
              ) : (
                patientRx.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {rx.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {rx.status}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        Vence: {formatDate(rx.expiryDate)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {rx.items.map((it) => (
                        <div key={it.id} className="p-2 rounded bg-slate-50 dark:bg-slate-700/50 text-xs">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {it.genericName} ({it.concentration}) — {it.totalQuantity}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                            {it.dosage} cada {it.frequency} vía {it.route} por {it.duration}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Psiquiatra: {rx.psychiatristName} ({rx.psychiatristRegistration})</span>
                      <span>Firma: {rx.psychiatristSignatureHash ? 'Verificada' : 'Pendiente'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: PLANES TERAPÉUTICOS */}
          {activeSubTab === 'planes' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Planes de Tratamiento Psicológico
              </h3>
              {patientTreatments.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-xs">
                  Sin planes terapéuticos activos para este paciente.
                </p>
              ) : (
                patientTreatments.map((tp) => (
                  <div
                    key={tp.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                        {tp.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {tp.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">
                      <strong>Enfoque:</strong> {tp.approach} | <strong>Frecuencia:</strong> {tp.frequency} ({tp.modality})
                    </p>

                    <div className="space-y-2">
                      <span className="font-bold text-[10px] text-slate-500 uppercase block">
                        Objetivos y Progreso:
                      </span>
                      {tp.goals.map((g) => (
                        <div key={g.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-slate-800 dark:text-slate-200">{g.description}</span>
                            <span className="font-bold text-teal-700 dark:text-teal-400">{g.currentProgressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-teal-600 h-1.5 rounded-full"
                              style={{ width: `${g.currentProgressPercent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: CITAS Y CONSULTAS */}
          {activeSubTab === 'citas' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Historial de Citas y Sesiones
              </h3>
              {patientApts.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{apt.title}</span>
                    <p className="text-slate-500 text-[11px]">
                      {formatDate(apt.date)} • {apt.startTime} - {apt.endTime} ({apt.modality})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {apt.status}
                    </span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{formatCOP(apt.cost)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: FINANZAS */}
          {activeSubTab === 'pagos' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Movimientos Contables y Pagos
              </h3>
              {patientTrx.map((trx) => (
                <div
                  key={trx.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{trx.concept}</span>
                    <p className="text-slate-500 text-[11px]">
                      {formatDate(trx.date)} • {trx.paymentMethod} • Comprobante: {trx.voucherNumber || 'S/N'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                      {formatCOP(trx.paidAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400">{trx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
