import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Edit,
  Power,
  UserCheck,
  BookOpen,
  Lock,
  Mail,
  Phone,
  FileCheck,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole } from '../../types';
import { ProfessionalModal } from './ProfessionalModal';

export const ProfessionalsModule: React.FC = () => {
  const {
    profiles,
    currentProfile,
    setCurrentProfile,
    toggleProfileStatus,
    patients,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredProfiles = profiles.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.registrationNumber.toLowerCase().includes(term) ||
      p.specialty.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term);

    const matchesRole = roleFilter === 'todos' ? true : p.role === roleFilter;
    const matchesStatus = statusFilter === 'todos' ? true : (p.status || 'Activo') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalDoctors = profiles.filter((p) => p.role === 'psiquiatra').length;
  const totalPsychologists = profiles.filter((p) => p.role === 'psicologo').length;
  const totalActive = profiles.filter((p) => (p.status || 'Activo') === 'Activo').length;

  const handleToggleStatus = (p: UserProfile) => {
    setStatusAlert(null);
    const res = toggleProfileStatus(p.id);
    if (!res.success) {
      setStatusAlert({ message: res.error || 'No se pudo cambiar el estado.', type: 'error' });
    } else {
      setStatusAlert({
        message: `El estado del profesional ${p.name} se actualizó correctamente a ${
          (p.status || 'Activo') === 'Activo' ? 'Inactivo' : 'Activo'
        }.`,
        type: 'success',
      });
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'psiquiatra':
        return {
          label: 'Médico Psiquiatra',
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
          icon: Stethoscope,
        };
      case 'psicologo':
        return {
          label: 'Psicología Clínica',
          bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700',
          icon: UserCheck,
        };
      case 'orientador':
        return {
          label: 'Orientación Pastoral',
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700',
          icon: BookOpen,
        };
      default:
        return {
          label: 'Administración & Auditoría',
          bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-700',
          icon: Lock,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Directorio de Médicos & Profesionales de la Salud
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gestión del talento humano clínico, validación de habilitación ReTHUS y control de facultades de prescripción
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Nuevo Médico / Especialista</span>
          </button>
        </div>

        {/* Legal Regulatory Card */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <div className="text-slate-700 dark:text-slate-300 leading-snug">
              <span className="font-bold block text-slate-900 dark:text-white">
                Habilitación Médica en Salud Mental — Ley 1164 de 2007 & Resolución 1403 de 2007
              </span>
              <span>
                El registro en el sistema valida la idoneidad profesional. La facultad de aprobar y firmar fórmulas médicas psicofarmacológicas está jurídicamente restringida a los Médicos Especialistas en Psiquiatría acreditados.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Total Profesionales</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">{profiles.length}</span>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 mt-0.5 block">{totalActive} en servicio activo</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Médicos Psiquiatras</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{totalDoctors}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Habilitados para Prescripción ReTHUS</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Psicólogos Clínicos</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 block">{totalPsychologists}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Psicoterapia y Evaluación SOAP</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Sesión Activa</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 truncate block">{currentProfile.name}</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
            {currentProfile.role.toUpperCase()}
          </span>
        </div>
      </div>

      {statusAlert && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            statusAlert.type === 'error'
              ? 'bg-red-50 text-red-900 border-red-300 dark:bg-red-950/50 dark:text-red-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusAlert.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{statusAlert.message}</span>
          </div>
          <button onClick={() => setStatusAlert(null)} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad, ReTHUS o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'psiquiatra', label: 'Psiquiatras' },
            { id: 'psicologo', label: 'Psicólogos' },
            { id: 'orientador', label: 'Orientadores' },
            { id: 'administrador', label: 'Administración' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                roleFilter === f.id
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profiles Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProfiles.map((profile) => {
          const badge = getRoleBadge(profile.role);
          const BadgeIcon = badge.icon;
          const isCurrent = profile.id === currentProfile.id;
          const isActive = (profile.status || 'Activo') === 'Activo';
          const assignedPatientsCount = patients.filter((p) => p.responsibleProfessionalId === profile.id).length;

          return (
            <div
              key={profile.id}
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-2xs transition space-y-4 ${
                isCurrent
                  ? 'border-teal-500 ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
                    <BadgeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {profile.name}
                      </h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white shadow-2xs">
                          Sesión Actual
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300'
                        }`}
                      >
                        {isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {profile.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setEditingProfile(profile)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Editar datos del profesional"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleStatus(profile)}
                    disabled={isCurrent}
                    className={`p-1.5 rounded-lg transition ${
                      isCurrent
                        ? 'text-slate-300 cursor-not-allowed'
                        : isActive
                        ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                        : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    }`}
                    title={
                      isCurrent
                        ? 'No se puede inactivar la sesión activa'
                        : isActive
                        ? 'Inactivar profesional'
                        : 'Reactivar profesional'
                    }
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Badges and Details */}
              <div className="space-y-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {profile.registrationNumber}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-xs">
                  <strong>Especialidad:</strong> {profile.specialty}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                {/* Signing capability verification chip */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {profile.role === 'psiquiatra' ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <FileCheck className="w-3.5 h-3.5" />
                        Facultado para Firma Médica ReTHUS
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        Colaborador Clínico Multidisciplinario
                      </span>
                    )}
                  </div>

                  <span className="text-slate-400">
                    {assignedPatientsCount} paciente(s) asignado(s)
                  </span>
                </div>
              </div>

              {/* Quick switch button if not current */}
              {!isCurrent && (
                <div className="pt-1">
                  <button
                    onClick={() => setCurrentProfile(profile)}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 transition"
                  >
                    Iniciar Sesión en el Sistema como {profile.name.split(' ')[0]} {profile.name.split(' ')[1]}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Creation / Edition Modal */}
      {(isNewModalOpen || editingProfile) && (
        <ProfessionalModal
          existingProfile={editingProfile || undefined}
          onClose={() => {
            setIsNewModalOpen(false);
            setEditingProfile(null);
          }}
        />
      )}
    </div>
  );
};
