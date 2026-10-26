import React, { useState } from 'react';
import {
  BookOpen,
  X,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
  Heart,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pastor, DocumentType } from '../../types';

interface PastorModalProps {
  onClose: () => void;
  pastorToEdit?: Pastor | null;
}

const COMMON_FOCUS_AREAS = [
  'Duelo y Pérdida',
  'Familia y Matrimonio',
  'Crisis de Fe y Sentido',
  'Adicciones y Restauración',
  'Acompañamiento a Jóvenes',
  'Cuidado del Adulto Mayor',
  'Reconciliación y Perdón',
  'Capellanía Hospitalaria',
];

const MINISTERIAL_ROLES = [
  'Pastor Principal',
  'Pastor Asociado',
  'Pastor de Familia y Parejas',
  'Consejero Pastoral Certificado',
  'Capellán Institucional',
  'Pastor de Jóvenes y Universitarios',
  'Ministro de Cuidado y Restauración',
];

export const PastorModal: React.FC<PastorModalProps> = ({ onClose, pastorToEdit }) => {
  const { addPastor, updatePastor, profiles } = useApp();
  const isEditing = Boolean(pastorToEdit);

  // Form State
  const [fullName, setFullName] = useState(pastorToEdit?.fullName || '');
  const [documentType, setDocumentType] = useState<DocumentType>(pastorToEdit?.documentType || 'CC');
  const [documentNumber, setDocumentNumber] = useState(pastorToEdit?.documentNumber || '');
  const [churchName, setChurchName] = useState(pastorToEdit?.churchName || '');
  const [ministerialRole, setMinisterialRole] = useState(pastorToEdit?.ministerialRole || MINISTERIAL_ROLES[1]);
  const [customRole, setCustomRole] = useState('');
  const [denomination, setDenomination] = useState(pastorToEdit?.denomination || '');
  const [phone, setPhone] = useState(pastorToEdit?.phone || '');
  const [email, setEmail] = useState(pastorToEdit?.email || '');
  const [city, setCity] = useState(pastorToEdit?.city || 'Bogotá D.C.');
  const [department, setDepartment] = useState(pastorToEdit?.department || 'Cundinamarca');
  const [address, setAddress] = useState(pastorToEdit?.address || '');
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>(pastorToEdit?.status || 'Activo');
  const [pastoralFocus, setPastoralFocus] = useState<string[]>(pastorToEdit?.pastoralFocus || ['Familia y Matrimonio', 'Acompañamiento Espiritual']);
  const [customFocus, setCustomFocus] = useState('');
  const [notes, setNotes] = useState(pastorToEdit?.notes || '');
  const [linkedUserId, setLinkedUserId] = useState<string>(pastorToEdit?.linkedUserId || '');

  // UI feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleFocusArea = (area: string) => {
    if (pastoralFocus.includes(area)) {
      setPastoralFocus(pastoralFocus.filter((a) => a !== area));
    } else {
      setPastoralFocus([...pastoralFocus, area]);
    }
  };

  const addCustomFocusArea = () => {
    const trimmed = customFocus.trim();
    if (trimmed && !pastoralFocus.includes(trimmed)) {
      setPastoralFocus([...pastoralFocus, trimmed]);
      setCustomFocus('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const finalRole = ministerialRole === 'Otro' ? customRole.trim() : ministerialRole;

    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Por favor ingrese el nombre completo del pastor/ministro (mínimo 3 caracteres).');
      return;
    }
    if (!documentNumber.trim() || documentNumber.trim().length < 5) {
      setErrorMessage('El número de documento de identificación debe tener al menos 5 dígitos.');
      return;
    }
    if (!churchName.trim() || churchName.trim().length < 3) {
      setErrorMessage('Por favor especifique la iglesia, congregación o comunidad pastoral.');
      return;
    }
    if (!finalRole) {
      setErrorMessage('Por favor seleccione o especifique el cargo ministerial.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMessage('El teléfono o celular de contacto es obligatorio (mínimo 7 caracteres).');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Por favor ingrese una dirección de correo electrónico válida.');
      return;
    }

    if (isEditing && pastorToEdit) {
      const result = updatePastor(pastorToEdit.id, {
        fullName: fullName.trim(),
        documentType,
        documentNumber: documentNumber.trim(),
        churchName: churchName.trim(),
        ministerialRole: finalRole,
        denomination: denomination.trim() || undefined,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        city: city.trim(),
        department: department.trim() || undefined,
        address: address.trim() || undefined,
        status,
        pastoralFocus,
        notes: notes.trim() || undefined,
        linkedUserId: linkedUserId || undefined,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Error al actualizar el registro.');
        return;
      }

      setSuccessMessage('Ficha pastoral actualizada exitosamente.');
      setTimeout(() => onClose(), 800);
    } else {
      const result = addPastor({
        fullName: fullName.trim(),
        documentType,
        documentNumber: documentNumber.trim(),
        churchName: churchName.trim(),
        ministerialRole: finalRole,
        denomination: denomination.trim() || undefined,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        city: city.trim(),
        department: department.trim() || undefined,
        address: address.trim() || undefined,
        status,
        pastoralFocus,
        notes: notes.trim() || undefined,
        linkedUserId: linkedUserId || undefined,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Error al registrar el nuevo pastor.');
        return;
      }

      setSuccessMessage(`Pastor registrado exitosamente con código ${result.pastor?.id}.`);
      setTimeout(() => onClose(), 800);
    }
  };

  // Orientador profiles available for optional linking
  const orientadorProfiles = profiles.filter((p) => p.role === 'orientador');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-700/60 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isEditing ? 'Editar Ficha de Pastor / Ministro' : 'Registrar Nuevo Pastor en Directorio'}</span>
                {isEditing && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-200 border border-amber-700/50 font-mono">
                    {pastorToEdit?.id}
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-amber-200/80">
                Directorio Ministerial y Consejería Pastoral • JAIRRESTAURA Consultorio Digital
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ethical / Legal Boundary Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 px-6 py-3 border-b border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[11px] uppercase tracking-wide text-amber-800 dark:text-amber-300">
              Marco Legal y Segregación de Competencias (Ley 133 de 1994 y Ley 1090 de 2006)
            </span>
            <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/90">
              El registro pastoral faculta exclusivamente para la orientación espiritual, el acompañamiento en crisis vitales y la consejería bíblica. <strong>No otorga registro profesional médico ni registro ReTHUS</strong>, ni autoriza para diagnosticar trastornos psiquiátricos, cambiar o formular tratamientos farmacológicos.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-2.5 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Validación de Registro:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Section 1: Personal and Identification */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <span>1. Identificación del Ministro o Pastor</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombres y Apellidos Completos *:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pr. Carlos Eduardo Méndez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estado del Registro *:
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  <option value="Activo">Activo en Directorio</option>
                  <option value="Inactivo">Inactivo / En Pausa</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Documento *:
                </label>
                <select
                  value={documentType}
                  onChange={(e: any) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Documento de Identificación *:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 79432890"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  El sistema previene registros duplicados con el mismo número de cédula o identificación.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Church and Ministerial Role */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>2. Congregación, Iglesia y Función Ministerial</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Iglesia o Congregación *:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Comunidad Cristiana Restauración y Vida"
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Denominación o Cobertura (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej. Alianza Cristiana, Asambleas de Dios, Bautista, etc."
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cargo / Función Ministerial *:
                </label>
                <select
                  value={ministerialRole}
                  onChange={(e) => setMinisterialRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  {MINISTERIAL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="Otro">Otro cargo personalizado...</option>
                </select>
              </div>

              {ministerialRole === 'Otro' ? (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Especifique el cargo ministerial *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Coordinador de Capellanía Penitenciaria"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ciudad de Ejercicio *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Bogotá D.C., Chía, Soacha"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Contact and Location */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>3. Contacto Institucional y Pastoral</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Teléfono / WhatsApp de Contacto *:
                </label>
                <input
                  type="text"
                  required
                  placeholder="+57 315 780 1290"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico Institucional o Personal *:
                </label>
                <input
                  type="email"
                  required
                  placeholder="pastor.carlos@iglesia.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Departamento / Región:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Cundinamarca, Antioquia, Valle"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dirección o Sede Pastoral:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Calle 127 # 19-45, Sede Norte"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Pastoral Focus / Areas of Accompaniment */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Heart className="w-3.5 h-3.5 text-amber-600" />
              <span>4. Áreas de Enfoque y Acompañamiento Ministerial</span>
            </h3>

            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                Seleccione las áreas en las que el pastor presta consejería pastoral no clínica:
              </p>
              <div className="flex flex-wrap gap-2">
                {COMMON_FOCUS_AREAS.map((area) => {
                  const isSelected = pastoralFocus.includes(area);
                  return (
                    <button
                      type="button"
                      key={area}
                      onClick={() => toggleFocusArea(area)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {area}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Agregar otra área personalizada (ej. Capellanía deportiva)..."
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomFocusArea();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={addCustomFocusArea}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Notes and System Link */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>5. Notas y Vinculación con Usuario del Sistema</span>
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vinculación de Acceso al Sistema (Opcional):
              </label>
              <select
                value={linkedUserId}
                onChange={(e) => setLinkedUserId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="">(Sin usuario de sesión asignado - Solo ficha en directorio)</option>
                {orientadorProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Perfil de Orientador Pastoral ({p.email})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                La vinculación permite registrar notas de orientación pastoral con su usuario. No confiere permisos de médico, psicólogo ni administrador.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Observaciones o Trayectoria Ministerial:
              </label>
              <textarea
                rows={3}
                placeholder="Antecedentes de servicio, formación teológica, convenios con el consultorio, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios del Pastor' : 'Registrar Nuevo Pastor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
