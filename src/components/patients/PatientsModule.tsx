import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Eye,
  Edit,
  Archive,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Patient, PatientStatus } from '../../types';
import { formatDate, calculateAge } from '../../utils/formatters';
import { PatientModal } from './PatientModal';
import { PatientDetailDrawer } from './PatientDetailDrawer';

interface PatientsModuleProps {
  onOpenNewSoapModal: (patientId: string) => void;
  onOpenNewPrescriptionModal: (patientId: string) => void;
}

export const PatientsModule: React.FC<PatientsModuleProps> = ({
  onOpenNewSoapModal,
  onOpenNewPrescriptionModal,
}) => {
  const { patients, archivePatient, selectedPatientId, setSelectedPatientId } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const selectedPatient = selectedPatientId
    ? patients.find((p) => p.id === selectedPatientId)
    : null;

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.documentNumber.includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'todos' ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'Activo':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'En Pausa':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Egresado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700';
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
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Ficha Integral de Pacientes
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registro sociodemográfico, legal, consentimientos y enlaces a expedientes clínicos
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Ingresar Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula (CC), código PAC o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'Activo', label: 'Activos' },
            { id: 'En Pausa', label: 'En Pausa' },
            { id: 'Egresado', label: 'Egresados' },
            { id: 'Archivado', label: 'Archivados' },
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

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map((patient) => {
          const age = calculateAge(patient.birthDate);
          return (
            <div
              key={patient.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:border-teal-500 dark:hover:border-teal-500 transition space-y-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      {patient.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getStatusBadge(
                        patient.status
                      )}`}
                    >
                      {patient.status}
                    </span>
                  </div>
                  <h3
                    onClick={() => setSelectedPatientId(patient.id)}
                    className="text-base font-bold text-slate-900 dark:text-white mt-1 cursor-pointer hover:text-teal-600 transition"
                  >
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {patient.documentType} {patient.documentNumber} • {age} años • {patient.city}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedPatientId(patient.id)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-600 dark:text-slate-300 hover:text-teal-700 transition"
                    title="Ver expediente completo"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingPatient(patient)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    title="Editar ficha"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {patient.status !== 'Archivado' && (
                    <button
                      onClick={() => archivePatient(patient.id)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-600 transition"
                      title="Archivar paciente"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Contact info badges */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{patient.phone}</span>
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </span>
              </div>

              {/* Alerts or notes snippet */}
              {patient.allergies.length > 0 && patient.allergies[0] !== 'Ninguna conocida' && (
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">
                    <strong>Alergias:</strong> {patient.allergies.join(', ')}
                  </span>
                </div>
              )}

              {/* Bottom footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Atiende: {patient.responsibleProfessionalName}</span>
                <button
                  onClick={() => setSelectedPatientId(patient.id)}
                  className="text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-0.5 hover:underline"
                >
                  <span>Abrir Expediente</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {(isNewModalOpen || editingPatient) && (
        <PatientModal
          existingPatient={editingPatient || undefined}
          onClose={() => {
            setIsNewModalOpen(false);
            setEditingPatient(null);
          }}
        />
      )}

      {selectedPatient && (
        <PatientDetailDrawer
          patient={selectedPatient}
          onClose={() => setSelectedPatientId(null)}
          onEdit={() => setEditingPatient(selectedPatient)}
          onOpenNewSoap={() => onOpenNewSoapModal(selectedPatient.id)}
          onOpenNewPrescription={() => onOpenNewPrescriptionModal(selectedPatient.id)}
        />
      )}
    </div>
  );
};
