import React, { useState } from 'react';
import { Calendar, X, Video, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttentionModality, AppointmentStatus } from '../../types';

interface AppointmentModalProps {
  onClose: () => void;
  defaultPatientId?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  onClose,
  defaultPatientId,
}) => {
  const { patients, profiles, currentProfile, addAppointment } = useApp();

  const [patientId, setPatientId] = useState<string>(
    defaultPatientId || (patients[0]?.id || '')
  );

  const selectedPatient = patients.find((p) => p.id === patientId) || patients[0];

  const [professionalId, setProfessionalId] = useState<string>(currentProfile.id);
  const [title, setTitle] = useState('Consulta de Seguimiento Psicoterapéutico');
  const [date, setDate] = useState('2026-10-25');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('16:50');
  const [modality, setModality] = useState<AttentionModality>('Virtual');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/jair-restaura-teleconsulta');
  const [location, setLocation] = useState('Consultorio 502, Centro Médico Empresarial');
  const [cost, setCost] = useState(160000);
  const [notes, setNotes] = useState('Cita programada con recordatorio por WhatsApp sin datos clínicos sensibles.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const professional = profiles.find((p) => p.id === professionalId) || currentProfile;

    addAppointment({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      patientPhone: selectedPatient.phone,
      professionalId: professional.id,
      professionalName: professional.name,
      professionalRole: professional.role,
      title,
      date,
      startTime,
      endTime,
      modality,
      meetingLink: modality === 'Virtual' ? meetingLink : undefined,
      location: modality === 'Presencial' ? location : undefined,
      status: 'Confirmada',
      cost,
      paymentStatus: 'Pendiente',
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">Agendar Nueva Cita / Teleconsulta</h2>
              <p className="text-[11px] text-slate-400">
                Atención presencial o virtual con recordatorio seguro
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
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
                  {p.firstName} {p.lastName} — ({p.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Profesional que Atiende:
            </label>
            <select
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.title})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Motivo / Título de la Consulta:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hora Inicio:
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hora Fin:
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Modalidad:
              </label>
              <select
                value={modality}
                onChange={(e: any) => setModality(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="Virtual">Virtual (Teleconsulta)</option>
                <option value="Presencial">Presencial en Consultorio</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Valor de la Consulta (COP):
              </label>
              <input
                type="number"
                step="5000"
                required
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {modality === 'Virtual' ? (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enlace de Teleconsulta (Google Meet / Zoom):
              </label>
              <input
                type="url"
                required
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
          ) : (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ubicación Física del Consultorio:
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notas Administrativas / Recordatorio:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              Agendar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
