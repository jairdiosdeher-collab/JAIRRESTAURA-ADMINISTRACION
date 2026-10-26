import React, { useState } from 'react';
import {
  UserCheck,
  X,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  BookOpen,
  Lock,
  FileCheck,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole } from '../../types';

interface ProfessionalModalProps {
  onClose: () => void;
  existingProfile?: UserProfile;
}

export const ProfessionalModal: React.FC<ProfessionalModalProps> = ({
  onClose,
  existingProfile,
}) => {
  const { addProfile, updateProfile } = useApp();

  const [name, setName] = useState(existingProfile?.name || '');
  const [role, setRole] = useState<UserRole>(existingProfile?.role || 'psiquiatra');
  const [title, setTitle] = useState(
    existingProfile?.title ||
      (role === 'psiquiatra'
        ? 'Médico Especialista en Psiquiatría'
        : role === 'psicologo'
        ? 'Psicólogo/a Clínico/a'
        : role === 'orientador'
        ? 'Orientador/a Pastoral'
        : 'Administrador/a de Consultorio')
  );
  const [registrationNumber, setRegistrationNumber] = useState(
    existingProfile?.registrationNumber || ''
  );
  const [specialty, setSpecialty] = useState(
    existingProfile?.specialty ||
      (role === 'psiquiatra'
        ? 'Psiquiatría General y Enlace'
        : role === 'psicologo'
        ? 'Psicoterapia Cognitivo-Conductual'
        : role === 'orientador'
        ? 'Consejería y Familia'
        : 'Gestión en Salud')
  );
  const [email, setEmail] = useState(existingProfile?.email || '');
  const [phone, setPhone] = useState(existingProfile?.phone || '+57 ');
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>(
    existingProfile?.status || 'Activo'
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Automatically update suggested title and specialty when role changes (if user hasn't typed custom)
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (!existingProfile) {
      if (newRole === 'psiquiatra') {
        setTitle('Médico Especialista en Psiquiatría');
        setSpecialty('Psiquiatría de Enlace y Salud Mental');
      } else if (newRole === 'psicologo') {
        setTitle('Psicólogo/a Clínico/a y de la Salud');
        setSpecialty('Psicoterapia y Evaluación Clínica');
      } else if (newRole === 'orientador') {
        setTitle('Orientador/a Pastoral y Espiritual');
        setSpecialty('Cuidado Pastoral y Acompañamiento en Duelo');
      } else {
        setTitle('Administrador/a en Salud');
        setSpecialty('Administración y Facturación Médica');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (name.trim().length < 3) {
      setErrorMessage('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }
    if (registrationNumber.trim().length < 4) {
      setErrorMessage('El número de registro médico, tarjeta profesional o ReTHUS es obligatorio.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Por favor ingrese una dirección de correo electrónico válida.');
      return;
    }

    const payload = {
      name: name.trim(),
      role,
      title: title.trim(),
      registrationNumber: registrationNumber.trim(),
      specialty: specialty.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      status,
    };

    if (existingProfile) {
      const res = updateProfile(existingProfile.id, payload);
      if (!res.success) {
        setErrorMessage(res.error || 'Error al actualizar profesional.');
        return;
      }
    } else {
      const res = addProfile(payload);
      if (!res.success) {
        setErrorMessage(res.error || 'Error al registrar profesional.');
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">
                {existingProfile
                  ? `Editar Profesional: ${existingProfile.name}`
                  : 'Registrar Nuevo Médico / Profesional Clínico'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Directorio institucional • Habilitación profesional ReTHUS y Resolución 1403 de 2007
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-xs">Error de Validación:</span>
                <span className="text-[11px] leading-relaxed">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Regulatory Segregation Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Seguridad Jurídica y Autorización de Prescripción Farmacológica:</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Conforme a la legislación colombiana (Decreto 780 de 2016 y Ley 1164 de 2007), el rol asignado determina estrictamente las facultades del profesional. Solo los profesionales registrados con rol de <strong>Médico Psiquiatra</strong> y registro ReTHUS verificado podrán emitir o firmar fórmulas médicas psicofarmacológicas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre Completo (con título honorífico)*:
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Dr. Carlos Arturo Restrepo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rol en el Consultorio*:
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-teal-500"
              >
                <option value="psiquiatra">Médico Psiquiatra (Habilitado para Prescripción)</option>
                <option value="psicologo">Psicólogo Clínico (Psicoterapia & Evaluación)</option>
                <option value="orientador">Orientador Pastoral (Acompañamiento Integral)</option>
                <option value="administrador">Administración & Auditoría Clínica</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Título Oficial / Denominación*:
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Médico Especialista en Psiquiatría"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registro Profesional / ReTHUS*:
              </label>
              <input
                type="text"
                required
                placeholder="Ej. ReTHUS 1045920-COL / RM 92040-BOG"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Especialidad o Enfoque Clínico*:
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Psiquiatría del Adulto y Farmacoterapia"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Correo Electrónico Institucional*:
              </label>
              <input
                type="email"
                required
                placeholder="profesional@jairrestaura.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teléfono de Contacto Profesional:
              </label>
              <input
                type="tel"
                placeholder="+57 300 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estado del Profesional:
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
              >
                <option value="Activo">Activo (Habilitado para atención)</option>
                <option value="Inactivo">Inactivo / En receso</option>
              </select>
            </div>
          </div>

          {/* Live Signing Rights Status Alert */}
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              role === 'psiquiatra'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 shrink-0 text-teal-600" />
              <span>
                <strong>Facultad de Prescripción: </strong>
                {role === 'psiquiatra'
                  ? 'Facultado para firma de fórmulas médicas psicotrópicas (ReTHUS Requerido)'
                  : 'Atención clínica y psicoterapia (Sin facultades para prescripción psicofarmacológica)'}
              </span>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition"
            >
              {existingProfile ? 'Guardar Cambios del Profesional' : 'Registrar Profesional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
