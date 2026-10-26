import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Target,
  Pill,
  FileCheck2,
  CalendarDays,
  DollarSign,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    patients,
    profiles,
    prescriptions,
    appointments,
    currentProfile,
  } = useApp();

  // Pending prescriptions to review/sign by psychiatrist
  const pendingRxCount = prescriptions.filter(
    (p) => p.status === 'Pendiente de Revisión Psiquiatra' || p.status === 'Borrador'
  ).length;

  const todayStr = '2026-10-25';
  const todayAptCount = appointments.filter((a) => a.date === todayStr).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'patients',
      label: 'Ficha de Pacientes',
      icon: Users,
      badge: patients.length,
    },
    {
      id: 'clinical',
      label: 'Historia Clínica SOAP',
      icon: FileText,
      badge: null,
    },
    {
      id: 'diagnostics',
      label: 'Diagnósticos CIE-10/11',
      icon: Activity,
      badge: null,
    },
    {
      id: 'treatments',
      label: 'Planes Terapéuticos',
      icon: Target,
      badge: null,
    },
    {
      id: 'prescriptions',
      label: 'Prescripción Psiquiátrica',
      icon: Pill,
      badge: pendingRxCount > 0 ? `${pendingRxCount} por firmar` : null,
      highlight: true,
      description: 'Gestión Psicofarmacológica',
    },
    {
      id: 'reports',
      label: 'Informes Clínicos',
      icon: FileCheck2,
      badge: null,
    },
    {
      id: 'agenda',
      label: 'Agenda & Teleconsulta',
      icon: CalendarDays,
      badge: todayAptCount > 0 ? `${todayAptCount} hoy` : null,
    },
    {
      id: 'finance',
      label: 'Administración & Finanzas',
      icon: DollarSign,
      badge: null,
    },
    {
      id: 'documents',
      label: 'Auditoría & Ley 1581',
      icon: ShieldAlert,
      badge: 'Seguridad',
    },
    {
      id: 'professionals',
      label: 'Equipo Médico & Clínico',
      icon: Stethoscope,
      badge: `${profiles.length}`,
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Módulos del Consultorio
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20 dark:bg-teal-600'
                    : item.highlight
                    ? 'text-teal-900 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200/80 dark:border-teal-800/80'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.highlight
                        ? 'bg-teal-600 text-white dark:bg-teal-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="truncate block font-semibold">{item.label}</span>
                    {item.description && !isActive && (
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal block truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.highlight
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom context box: Medical & Legal scope guarantee */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Seguridad Jurídica
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                Ley 1581
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
              Expedientes disociados. Fórmulas sujetas a firma exclusiva de Médico Psiquiatra con ReTHUS activo.
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-500">
              <span>Sesión: {currentProfile.role.toUpperCase()}</span>
              <span className="text-emerald-600 font-semibold">En línea</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
