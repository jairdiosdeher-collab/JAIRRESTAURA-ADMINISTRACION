import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit,
  Power,
  Heart,
  FileText,
  UserCheck,
  Eye,
  X,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pastor } from '../../types';
import { PastorModal } from './PastorModal';
import { formatDate } from '../../utils/formatters';

interface PastorsModuleProps {
  onOpenNewSoapModal?: (patientId?: string, defaultType?: string) => void;
}

export const PastorsModule: React.FC<PastorsModuleProps> = ({ onOpenNewSoapModal }) => {
  const {
    pastors,
    togglePastorStatus,
    soapNotes,
    currentProfile,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingPastor, setEditingPastor] = useState<Pastor | null>(null);
  const [viewingPastor, setViewingPastor] = useState<Pastor | null>(null);
  const [statusAlert, setStatusAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredPastors = pastors.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.fullName.toLowerCase().includes(term) ||
      p.documentNumber.toLowerCase().includes(term) ||
      p.churchName.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      p.ministerialRole.toLowerCase().includes(term) ||
      (p.pastoralFocus && p.pastoralFocus.some((f) => f.toLowerCase().includes(term)));

    const matchesRole = roleFilter === 'todos' ? true : p.ministerialRole.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === 'todos' ? true : p.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalActive = pastors.filter((p) => p.status === 'Activo').length;
  const uniqueChurches = Array.from(new Set(pastors.map((p) => p.churchName.trim()))).length;
  const pastoralNotesCount = soapNotes.filter((n) => n.type === 'orientacion_pastoral').length;

  const handleToggleStatus = (p: Pastor) => {
    setStatusAlert(null);
    const result = togglePastorStatus(p.id);
    if (result.success) {
      const nextStatus = p.status === 'Activo' ? 'Inactivo' : 'Activo';
      setStatusAlert({
        type: 'success',
        message: `Estado del pastor ${p.fullName} actualizado a: ${nextStatus}.`,
      });
      setTimeout(() => setStatusAlert(null), 3500);
    } else {
      setStatusAlert({
        type: 'error',
        message: result.error || 'No fue posible cambiar el estado del pastor.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Directorio Ministerial & Consejería Pastoral
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                  Cuidado Espiritual
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Padrón institucional de pastores, capellanes y ministros para acompañamiento ético y consejería familiar
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Pastor / Ministro</span>
          </button>
        </div>

        {/* Ethical / Legal Boundary Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <span className="font-bold text-[11px] uppercase tracking-wider block text-amber-800 dark:text-amber-300">
              Principio Institucional de Segregación de Roles (Ley 133/1994 y Ley 1090/2006)
            </span>
            <span>
              Los pastores y ministros registrados acompañan procesos de restauración de la fe, duelo y orientación de pareja. <strong>No están facultados para prescribir medicamentos, alterar dosis psicofarmacológicas ni emitir diagnósticos psiquiátricos</strong>, funciones privativas de los médicos psiquiatras habilitados en ReTHUS.
            </span>
          </div>
        </div>

        {/* Status Feedback Alert */}
        {statusAlert && (
          <div
            className={`mt-4 p-3 rounded-xl border flex items-center justify-between text-xs ${
              statusAlert.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusAlert.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusAlert.message}</span>
            </div>
            <button onClick={() => setStatusAlert(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Pastores
            </span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {pastors.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">registrados</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pastores Activos
            </span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalActive}
            </span>
            <span className="text-xs text-slate-400 font-medium">en directorio</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Iglesias Vinculadas
            </span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">
              {uniqueChurches}
            </span>
            <span className="text-xs text-slate-400 font-medium">comunidades</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Consejerías SOAP
            </span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {pastoralNotesCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">notas formales</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por pastor, cédula, congregación, enfoque o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role selector */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="todos">Todos los Roles Ministeriales</option>
            <option value="principal">Pastores Principales</option>
            <option value="asociado">Pastores Asociados</option>
            <option value="consejero">Consejeros Pastorales</option>
            <option value="capellán">Capellanes</option>
            <option value="familia">Familia & Parejas</option>
          </select>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="todos">Todos los Estados</option>
            <option value="Activo">Solo Activos</option>
            <option value="Inactivo">Solo Inactivos</option>
          </select>
        </div>
      </div>

      {/* Pastors Grid */}
      {filteredPastors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No se encontraron pastores con los criterios de búsqueda
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Ajuste el texto de búsqueda o registre un nuevo pastor en el directorio.
          </p>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition"
          >
            + Registrar Nuevo Pastor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPastors.map((pastor) => {
            const isActive = pastor.status === 'Activo';
            const initials = pastor.fullName
              .split(' ')
              .map((n) => n[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={pastor.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-2xs flex flex-col justify-between transition-all hover:border-amber-400/60 dark:hover:border-amber-600/60 ${
                  isActive
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'border-slate-200 dark:border-slate-800 opacity-70 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {pastor.fullName}
                          </h3>
                        </div>
                        <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 truncate">
                          {pastor.ministerialRole}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {pastor.id} • {pastor.documentType} {pastor.documentNumber}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  {/* Church & Location Info */}
                  <div className="py-3 space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-semibold block truncate">{pastor.churchName}</span>
                        {pastor.denomination && (
                          <span className="text-[10px] text-slate-400 block">{pastor.denomination}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {pastor.city}{pastor.department ? `, ${pastor.department}` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${pastor.phone}`} className="hover:text-amber-600 underline-offset-2 hover:underline">
                        {pastor.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${pastor.email}`} className="truncate hover:text-amber-600 underline-offset-2 hover:underline">
                        {pastor.email}
                      </a>
                    </div>

                    {/* Focus Area Tags */}
                    {pastor.pastoralFocus && pastor.pastoralFocus.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                          Enfoque de Consejería:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {pastor.pastoralFocus.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                            >
                              {f}
                            </span>
                          ))}
                          {pastor.pastoralFocus.length > 3 && (
                            <span className="text-[10px] px-1 py-0.5 text-slate-400 font-mono">
                              +{pastor.pastoralFocus.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingPastor(pastor)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Ver ficha pastoral completa"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    <button
                      onClick={() => setEditingPastor(pastor)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Editar datos del pastor"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-600" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(pastor)}
                      className={`p-1.5 rounded-lg transition ${
                        isActive
                          ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                      title={isActive ? 'Inactivar pastor' : 'Activar pastor'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {onOpenNewSoapModal && (
                    <button
                      onClick={() => onOpenNewSoapModal(undefined, 'orientacion_pastoral')}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 transition flex items-center gap-1"
                      title="Registrar sesión de consejería pastoral con estructura formal"
                    >
                      <FileText className="w-3 h-3 text-amber-600" />
                      <span>Registrar Sesión</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating New Pastor */}
      {isNewModalOpen && (
        <PastorModal onClose={() => setIsNewModalOpen(false)} />
      )}

      {/* Modal for Editing Pastor */}
      {editingPastor && (
        <PastorModal
          pastorToEdit={editingPastor}
          onClose={() => setEditingPastor(null)}
        />
      )}

      {/* Modal for Viewing Full Pastor Dossier */}
      {viewingPastor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-900 to-amber-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <div>
                  <h2 className="text-sm font-bold">{viewingPastor.fullName}</h2>
                  <p className="text-[11px] text-amber-200/80">
                    Ficha Ministerial • Código: {viewingPastor.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingPastor(null)}
                className="text-amber-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Profile Card Header */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {viewingPastor.fullName}
                  </span>
                  <p className="text-amber-800 dark:text-amber-300 font-semibold mt-0.5">
                    {viewingPastor.ministerialRole}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Documento: {viewingPastor.documentType} {viewingPastor.documentNumber}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                    viewingPastor.status === 'Activo'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {viewingPastor.status}
                </span>
              </div>

              {/* Congregation and Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Iglesia / Congregación:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingPastor.churchName}</span>
                  {viewingPastor.denomination && (
                    <span className="text-[11px] text-slate-500 block">({viewingPastor.denomination})</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sede y Ciudad:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    {viewingPastor.city}{viewingPastor.department ? `, ${viewingPastor.department}` : ''}
                  </span>
                  {viewingPastor.address && (
                    <span className="text-[11px] text-slate-500 block">{viewingPastor.address}</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Teléfono / WhatsApp:</span>
                  <a href={`tel:${viewingPastor.phone}`} className="text-amber-700 dark:text-amber-400 font-semibold hover:underline">
                    {viewingPastor.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Correo Electrónico:</span>
                  <a href={`mailto:${viewingPastor.email}`} className="text-amber-700 dark:text-amber-400 font-mono hover:underline">
                    {viewingPastor.email}
                  </a>
                </div>
              </div>

              {/* Focus Areas */}
              <div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1.5 uppercase tracking-wide">
                  Áreas de Consejería y Acompañamiento:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingPastor.pastoralFocus && viewingPastor.pastoralFocus.length > 0 ? (
                    viewingPastor.pastoralFocus.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                      >
                        {f}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">Sin áreas especificadas</span>
                  )}
                </div>
              </div>

              {/* Notes */}
              {viewingPastor.notes && (
                <div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1 uppercase tracking-wide">
                    Trayectoria y Observaciones:
                  </span>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs leading-relaxed border border-slate-200 dark:border-slate-700">
                    {viewingPastor.notes}
                  </div>
                </div>
              )}

              {/* System Link info */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[11px] flex items-center justify-between">
                <span>Fecha de registro en consultorio: {formatDate(viewingPastor.createdAt)}</span>
                <span className="font-mono text-[10px]">Actualizado: {formatDate(viewingPastor.updatedAt)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={() => {
                  setEditingPastor(viewingPastor);
                  setViewingPastor(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Editar Ficha</span>
              </button>

              <button
                onClick={() => setViewingPastor(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
