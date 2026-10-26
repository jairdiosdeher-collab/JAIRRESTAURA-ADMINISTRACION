import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  Database,
  Calendar,
  UserPlus,
  Stethoscope,
  BookOpen,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';

interface NavbarProps {
  onOpenAiAssistant: () => void;
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewProfessional?: () => void;
  toggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiAssistant,
  onOpenNewPatient,
  onOpenNewAppointment,
  onOpenNewProfessional,
  toggleMobileMenu,
}) => {
  const {
    currentProfile,
    profiles,
    setCurrentProfile,
    isDarkMode,
    toggleDarkMode,
    exportDataBackup,
    setActiveTab,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'psiquiatra':
        return {
          label: 'Médico Psiquiatra',
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
          icon: Stethoscope,
        };
      case 'psicologo':
        return {
          label: 'Psicología Clínica',
          bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700',
          icon: UserCheck,
        };
      case 'orientador':
        return {
          label: 'Orientación Pastoral',
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700',
          icon: BookOpen,
        };
      default:
        return {
          label: 'Administración & Finanzas',
          bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-700',
          icon: Lock,
        };
    }
  };

  const badge = getRoleBadge(currentProfile.role);
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                  JAIRRESTAURA
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Consultorio Digital
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block leading-tight">
                Clinical & Administrative Enterprise • Colombia
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right: Actions & Active Profile Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action: New Patient */}
          <button
            onClick={onOpenNewPatient}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Registrar nuevo paciente"
          >
            <UserPlus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Nuevo Paciente</span>
          </button>

          {/* Quick Action: New Appointment */}
          <button
            onClick={onOpenNewAppointment}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Agendar nueva cita médica o psicológica"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Agendar Cita</span>
          </button>

          {/* AI Clinical Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition shadow-xs"
            title="Asistente para estructuración SOAP y resumen de antecedentes"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
            <span className="hidden sm:inline">Asistente IA Clínico</span>
            <span className="sm:hidden">IA</span>
          </button>

          {/* Selector de Modo Claro / Oscuro */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-xs font-semibold shadow-2xs"
            title={isDarkMode ? 'Modo Oscuro activo (Clic para cambiar a Claro)' : 'Modo Claro activo (Clic para cambiar a Oscuro)'}
            aria-label={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Oscuro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="hidden sm:inline">Claro</span>
              </>
            )}
          </button>

          {/* Backup Button */}
          <button
            onClick={exportDataBackup}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Descargar copia de seguridad completa (JSON cifrado)"
            aria-label="Descargar copia de seguridad"
          >
            <Database className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Profile Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {currentProfile.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight flex items-center gap-1.5">
                  {currentProfile.name}
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
                  {currentProfile.registrationNumber}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Cambiar Profesional en Sesión
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Simula la interacción colaborativa según el rol y habilitación legal:
                  </p>
                </div>

                <div className="p-1 space-y-1">
                  {profiles.map((profile: UserProfile) => {
                    const isSelected = profile.id === currentProfile.id;
                    const rBadge = getRoleBadge(profile.role);
                    const Icon = rBadge.icon;
                    return (
                      <button
                        key={profile.id}
                        onClick={() => setCurrentProfile(profile)}
                        className={`w-full text-left p-2.5 rounded-lg transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {profile.name}
                            </p>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${rBadge.bg}`}>
                              {rBadge.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {profile.title}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-mono">
                            {profile.registrationNumber}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Actions: Register New Doctor / View Directory */}
                <div className="p-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                      if (onOpenNewProfessional) onOpenNewProfessional();
                    }}
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Registrar Nuevo Médico / Especialista</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                      setActiveTab('professionals');
                    }}
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition border border-slate-200 dark:border-slate-600"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Ver Directorio de Profesionales</span>
                  </button>
                </div>

                <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Marco Legal: Ley 1581 / Dec 780</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">ReTHUS Verificado</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
