import React, { useState } from 'react';
import {
  Users,
  CalendarCheck2,
  FileClock,
  Pill,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Database,
  ExternalLink,
  Plus,
  Video,
  Brain,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCOP, formatDate } from '../../utils/formatters';

interface DashboardProps {
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenPrescriptionModule: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenNewPatient,
  onOpenNewAppointment,
  onOpenPrescriptionModule,
}) => {
  const {
    patients,
    appointments,
    prescriptions,
    treatmentPlans,
    transactions,
    soapNotes,
    caseFormulations,
    setActiveTab,
    setSelectedPatientId,
    currentProfile,
  } = useApp();


  const [dateRangeFilter, setDateRangeFilter] = useState<'mes_actual' | 'anual' | 'todo'>('mes_actual');

  // Metrics calculation
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status === 'Activo').length;

  const todayStr = '2026-10-25';
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const upcomingAppointments = appointments.filter((a) => a.date > todayStr);
  const canceledAppointments = appointments.filter((a) => a.status === 'Cancelada');

  const pendingPrescriptions = prescriptions.filter(
    (p) => p.status === 'Pendiente de Revisión Psiquiatra' || p.status === 'Borrador'
  );
  const approvedPrescriptions = prescriptions.filter(
    (p) => p.status === 'Aprobada y Firmada por Psiquiatra' || p.status === 'Emitida al Paciente'
  );

  const activeTreatmentPlans = treatmentPlans.filter((tp) => tp.status === 'Activo').length;

  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'Ingreso' && t.status !== 'Anulado')
    .reduce((sum, t) => sum + t.paidAmount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Gasto' && t.status !== 'Anulado')
    .reduce((sum, t) => sum + t.paidAmount, 0);

  const totalReceivables = transactions
    .filter((t) => t.isReceivable && t.status === 'Abonado')
    .reduce((sum, t) => sum + (t.amount - t.paidAmount), 0);

  const netBalance = totalIncome - totalExpense;

  const navigateToPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patients');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Greeting, Security status & Quick Actions */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-teal-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sesión Activa: {currentProfile.title}
              </span>
              <span className="text-xs text-slate-400">Bogotá D.C., Colombia</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-1 text-white tracking-tight">
              Bienvenido, {currentProfile.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Sistema integral de orientación psicológica, psiquiatría y acompañamiento pastoral.
              Protección de datos bajo la Ley 1581 de 2012 y normativas de salud colombianas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('psychotherapy')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm flex items-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5" />
              Motor Psicoterapéutico ({caseFormulations.length})
            </button>
            <button
              onClick={onOpenNewAppointment}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Cita
            </button>
            <button
              onClick={onOpenNewPatient}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition border border-white/15 flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Ingresar Paciente
            </button>
          </div>
        </div>


        {/* Security & Sync Status Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Bases de datos cifradas y operativas
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Copias de seguridad automáticas activas
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Norma ReTHUS & Secreto Profesional Garantizado
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pacientes */}
        <div
          onClick={() => setActiveTab('patients')}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4.5 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pacientes en Seguimiento</span>
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{activePatients}</span>
            <span className="text-xs text-slate-400">activos de {totalPatients} totales</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% con consentimiento</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Citas de Hoy */}
        <div
          onClick={() => setActiveTab('agenda')}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4.5 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Atenciones de Hoy</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{todayAppointments.length}</span>
            <span className="text-xs text-slate-400">citas programadas</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {upcomingAppointments.length} en próximos días
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Prescripciones Psiquiátricas por Firmar */}
        <div
          onClick={onOpenPrescriptionModule}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4.5 border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Fórmulas por Validar</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingPrescriptions.length}</span>
            <span className="text-xs text-slate-400">pendientes psiquiatra</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">
              {approvedPrescriptions.length} emitidas y firmadas
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Recaudo Efectivo & Cuentas por Cobrar */}
        <div
          onClick={() => setActiveTab('finance')}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4.5 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ingresos Recaudados</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCOP(totalIncome)}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Por cobrar: {formatCOP(totalReceivables)}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid: Citas de Hoy & Prescripciones Críticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Schedule & Recent SOAP Evolution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Citas de Hoy */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarCheck2 className="w-4 h-4 text-teal-600" />
                  Agenda y Consultas del Día (25 de Octubre de 2026)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pacientes citados para control médico, sesión psicológica o consejería
                </p>
              </div>
              <button
                onClick={() => setActiveTab('agenda')}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                Ver calendario completo
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No hay consultas registradas para el día de hoy.
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/50 dark:hover:bg-slate-700/40 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 flex flex-col items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold mt-0.5">{apt.startTime}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => navigateToPatient(apt.patientId)}
                            className="font-bold text-xs text-slate-900 dark:text-white hover:text-teal-600 transition"
                          >
                            {apt.patientName}
                          </button>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                            {apt.modality}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {apt.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Atiende: {apt.professionalName} ({apt.professionalRole})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {apt.meetingLink && (
                        <a
                          href={apt.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-600 text-white hover:bg-teal-700 transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Entrar a Consulta</span>
                        </a>
                      )}
                      <button
                        onClick={() => navigateToPatient(apt.patientId)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                        title="Ver ficha clínica del paciente"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Últimas Notas Clínicas SOAP & Evolución */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileClock className="w-4 h-4 text-teal-600" />
                  Evolución Clínica y Notas SOAP Recientes
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Diferenciación estricta entre notas psiquiátricas, psicológicas y pastorales
                </p>
              </div>
              <button
                onClick={() => setActiveTab('clinical')}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                Ver todas las notas
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {soapNotes.slice(0, 3).map((note) => {
                const isPsyc = note.type === 'psicologia_soap';
                const isPast = note.type === 'orientacion_pastoral';
                const isMed = note.type === 'psiquiatria_interconsulta';

                return (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {note.patientName}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            isMed
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                              : isPsyc
                              ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {isMed
                            ? 'Nota Médica Psiquiátrica'
                            : isPsyc
                            ? 'Nota Psicológica SOAP'
                            : 'Orientación Pastoral'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(note.date)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 line-clamp-2">
                      <span className="font-semibold text-slate-900 dark:text-white mr-1.5">
                        Apreciación / Plan:
                      </span>
                      {note.assessment} — {note.plan}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Autor: {note.authorName} ({note.authorRegistration})</span>
                      <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400">
                        {note.hashIntegrity.slice(0, 16)}...
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Psychiatric Prescription Action Center & Alerts */}
        <div className="space-y-6">
          {/* Action Center: Prescripción Psicofarmacológica */}
          <div className="bg-gradient-to-br from-amber-500/10 via-white dark:via-slate-800 to-white dark:to-slate-800 rounded-xl border border-amber-300 dark:border-amber-700/60 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
                <div className="p-2 rounded-lg bg-amber-500 text-white shadow-xs">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Prescripción Psicofarmacológica</h3>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                    Control estricto con Psiquiatra
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              En cumplimiento del Decreto 780 de 2016 y la Resolución 1403 de 2007, toda fórmula psicofarmacológica debe ser revisada, aprobada y firmada digitalmente por el <strong>Médico Psiquiatra autorizado</strong>.
            </p>

            <div className="space-y-3 mb-4">
              {prescriptions.map((rx) => {
                const isPending =
                  rx.status === 'Pendiente de Revisión Psiquiatra' || rx.status === 'Borrador';
                const isSigned = rx.status === 'Aprobada y Firmada por Psiquiatra';

                return (
                  <div
                    key={rx.id}
                    onClick={onOpenPrescriptionModule}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                      isPending
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700'
                        : isSigned
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900 dark:text-white">{rx.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isPending
                            ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                            : 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                        }`}
                      >
                        {rx.status}
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold mt-1">
                      {rx.patientName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {rx.items.map((i) => `${i.genericName} (${i.concentration})`).join(' • ')}
                    </p>
                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Vence: {formatDate(rx.expiryDate)}</span>
                      <span className="font-medium text-teal-700 dark:text-teal-400">Ver fórmula →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onOpenPrescriptionModule}
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Abrir Módulo de Prescripciones</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clinical & Administrative Alerts */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-teal-600" />
              Alertas y Cumplimiento Regulatorio
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200">
                <p className="font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Consentimientos Informados (Ley 1581)
                </p>
                <p className="text-[11px] text-teal-800/90 dark:text-teal-300 mt-0.5">
                  Los 4 pacientes activos cuentan con consentimiento de telepsicología y habeas data verificado.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200">
                <p className="font-bold text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Planes de Tratamiento SMART
                </p>
                <p className="text-[11px] text-blue-800/90 dark:text-blue-300 mt-0.5">
                  {activeTreatmentPlans} planes terapéuticos activos con indicadores de progreso del 75% promedio.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <p className="font-bold text-[11px] flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-slate-600" />
                  Copia de Seguridad
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Última exportación auditada: Hoy a las 15:40 con integridad SHA-256 comprobada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
