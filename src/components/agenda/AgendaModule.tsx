import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Search,
  Filter,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import { formatDate, formatCOP } from '../../utils/formatters';
import { AppointmentModal } from './AppointmentModal';

export const AgendaModule: React.FC = () => {
  const { appointments, updateAppointment } = useApp();

  const [filterView, setFilterView] = useState<'hoy' | 'proximas' | 'todas'>('hoy');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = '2026-10-25';

  const filteredAppointments = appointments.filter((apt) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      apt.patientName.toLowerCase().includes(term) ||
      apt.title.toLowerCase().includes(term) ||
      apt.professionalName.toLowerCase().includes(term);

    const matchesView =
      filterView === 'hoy'
        ? apt.date === todayStr
        : filterView === 'proximas'
        ? apt.date >= todayStr
        : true;

    return matchesSearch && matchesView;
  });

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    updateAppointment(id, { status: newStatus });
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Realizada':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Confirmada':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-700';
      case 'Programada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Cancelada':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-700';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Agenda de Consultas y Teleatención Digital
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gestión de citas virtuales y presenciales, links de videoconferencia y control de asistencia
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'hoy', label: 'Citas de Hoy (25 Oct)' },
            { id: 'proximas', label: 'Próximas Sesiones' },
            { id: 'todas', label: 'Historial Completo' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setFilterView(v.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterView === v.id
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por paciente o profesional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <CalendarDays className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No hay citas programadas para este filtro
            </h3>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase">
                    {formatDate(apt.date).slice(3, 6)}
                  </span>
                  <span className="text-base font-black leading-none">
                    {apt.date.slice(8, 10)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {apt.startTime}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {apt.title}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getStatusBadge(
                        apt.status
                      )}`}
                    >
                      {apt.status}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {apt.modality}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    Paciente: {apt.patientName} {apt.patientPhone && `(${apt.patientPhone})`}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span>Atiende: {apt.professionalName} ({apt.professionalRole})</span>
                    <span>•</span>
                    <span>Tarifa: {formatCOP(apt.cost)}</span>
                    <span>•</span>
                    <span
                      className={
                        apt.paymentStatus === 'Pagado'
                          ? 'text-emerald-600 font-semibold'
                          : 'text-amber-600 font-semibold'
                      }
                    >
                      Pago: {apt.paymentStatus}
                    </span>
                  </div>

                  {apt.notes && (
                    <p className="text-[11px] text-slate-400 mt-1 italic">"{apt.notes}"</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                {apt.modality === 'Virtual' && apt.meetingLink && (
                  <a
                    href={apt.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-2xs transition flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Teleconsulta</span>
                  </a>
                )}

                {apt.status !== 'Realizada' && (
                  <button
                    onClick={() => handleStatusChange(apt.id, 'Realizada')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
                  >
                    Asistió (Realizada)
                  </button>
                )}

                {apt.status !== 'Cancelada' && (
                  <button
                    onClick={() => handleStatusChange(apt.id, 'Cancelada')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && <AppointmentModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
