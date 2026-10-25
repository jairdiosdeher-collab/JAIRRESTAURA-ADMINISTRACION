import React, { useState } from 'react';
import { UserPlus, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Patient, DocumentType, PatientStatus } from '../../types';
import { calculateAge } from '../../utils/formatters';

interface PatientModalProps {
  onClose: () => void;
  existingPatient?: Patient;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  onClose,
  existingPatient,
}) => {
  const { addPatient, updatePatient, profiles } = useApp();

  const [firstName, setFirstName] = useState(existingPatient?.firstName || '');
  const [lastName, setLastName] = useState(existingPatient?.lastName || '');
  const [documentType, setDocumentType] = useState<DocumentType>(
    existingPatient?.documentType || 'CC'
  );
  const [documentNumber, setDocumentNumber] = useState(
    existingPatient?.documentNumber || ''
  );
  const [birthDate, setBirthDate] = useState(
    existingPatient?.birthDate || '1995-05-15'
  );
  const [gender, setGender] = useState<'Femenino' | 'Masculino' | 'Otro' | 'Prefiero no reportar'>(
    existingPatient?.gender || 'Femenino'
  );
  const [phone, setPhone] = useState(existingPatient?.phone || '+57 ');
  const [whatsapp, setWhatsapp] = useState(existingPatient?.whatsapp || '+57 ');
  const [email, setEmail] = useState(existingPatient?.email || '');
  const [city, setCity] = useState(existingPatient?.city || 'Bogotá D.C.');
  const [department, setDepartment] = useState(
    existingPatient?.department || 'Cundinamarca'
  );
  const [address, setAddress] = useState(existingPatient?.address || '');
  const [occupation, setOccupation] = useState(existingPatient?.occupation || '');
  const [civilStatus, setCivilStatus] = useState<any>(
    existingPatient?.civilStatus || 'Soltero/a'
  );

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState(
    existingPatient?.emergencyContact.name || ''
  );
  const [emergencyRel, setEmergencyRel] = useState(
    existingPatient?.emergencyContact.relationship || 'Familiar'
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    existingPatient?.emergencyContact.phone || '+57 '
  );

  // Legal Guardian (if minor)
  const isMinor = calculateAge(birthDate) < 18;
  const [guardianName, setGuardianName] = useState(
    existingPatient?.legalGuardian?.name || ''
  );
  const [guardianDoc, setGuardianDoc] = useState(
    existingPatient?.legalGuardian?.documentNumber || ''
  );

  // Professional & Clinical alerts
  const [status, setStatus] = useState<PatientStatus>(
    existingPatient?.status || 'Activo'
  );
  const [responsibleId, setResponsibleId] = useState(
    existingPatient?.responsibleProfessionalId || profiles[0].id
  );
  const [hasSignedConsent, setHasSignedConsent] = useState(
    existingPatient?.hasSignedConsent ?? true
  );
  const [allergiesText, setAllergiesText] = useState(
    existingPatient?.allergies.join(', ') || 'Ninguna conocida'
  );
  const [medicalAlertsText, setMedicalAlertsText] = useState(
    existingPatient?.medicalAlerts.join(', ') || ''
  );
  const [generalNotes, setGeneralNotes] = useState(
    existingPatient?.generalNotes || ''
  );

  const calculatedAge = calculateAge(birthDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const responsible = profiles.find((p) => p.id === responsibleId) || profiles[0];

    const patientPayload = {
      firstName,
      lastName,
      documentType,
      documentNumber,
      birthDate,
      gender,
      phone,
      whatsapp,
      email,
      city,
      department,
      address,
      occupation,
      civilStatus,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRel,
        phone: emergencyPhone,
      },
      legalGuardian: isMinor
        ? {
            name: guardianName,
            documentType: 'CC' as DocumentType,
            documentNumber: guardianDoc,
            relationship: 'Padre / Madre / Tutor',
            phone: emergencyPhone,
          }
        : undefined,
      admissionDate: existingPatient?.admissionDate || '2026-10-25',
      status,
      hasSignedConsent,
      consentSignedDate: hasSignedConsent ? '2026-10-25' : undefined,
      consentMethod: hasSignedConsent ? ('Firma Digital' as const) : undefined,
      responsibleProfessionalId: responsible.id,
      responsibleProfessionalName: responsible.name,
      allergies: allergiesText
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      medicalAlerts: medicalAlertsText
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      generalNotes,
    };

    if (existingPatient) {
      updatePatient(existingPatient.id, patientPayload);
    } else {
      addPatient(patientPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">
                {existingPatient ? `Editar Paciente: ${existingPatient.firstName} ${existingPatient.lastName}` : 'Ingreso de Nuevo Paciente'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Ficha clínica individual • Cumplimiento Ley 1581 de 2012
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Identificación personal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombres*:
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Apellidos*:
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tipo de Documento*:
              </label>
              <select
                value={documentType}
                onChange={(e: any) => setDocumentType(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="RC">Registro Civil (RC)</option>
                <option value="PEP">Permiso Especial (PEP)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número de Documento*:
              </label>
              <input
                type="text"
                required
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Nacimiento*:
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5 block">
                Edad calculada: {calculatedAge} años {isMinor ? '(Menor de edad)' : ''}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Género:
              </label>
              <select
                value={gender}
                onChange={(e: any) => setGender(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no reportar">Prefiero no reportar</option>
              </select>
            </div>
          </div>

          {/* Contacto & Localización */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teléfono Celular*:
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp:
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Correo Electrónico*:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ciudad*:
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Departamento*:
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ocupación / Profesión:
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider block">
              Contacto de Emergencia (Obligatorio en Salud):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Nombre completo"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Parentesco (Madre, Cónyuge, etc.)"
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <input
                  type="tel"
                  required
                  placeholder="Teléfono"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Menor de edad: Representante legal */}
          {isMinor && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 space-y-2 text-amber-950 dark:text-amber-200">
              <span className="font-bold text-[11px] uppercase tracking-wider block">
                Datos del Representante Legal (Requerido para Menores de Edad):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nombre del Padre / Madre / Tutor"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Cédula de Ciudadanía del Representante"
                  value={guardianDoc}
                  onChange={(e) => setGuardianDoc(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Asignación profesional & Alertas clínicas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Profesional Responsable Asignado:
              </label>
              <select
                value={responsibleId}
                onChange={(e) => setResponsibleId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
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
                Estado del Paciente:
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
              >
                <option value="Activo">Activo</option>
                <option value="En Pausa">En Pausa</option>
                <option value="Egresado">Egresado</option>
                <option value="Archivado">Archivado Administrativamente</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alergias Conocidas (separadas por comas):
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="Ej. Penicilina, Sulfas, AINEs"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alertas Médicas o Factores de Riesgo:
              </label>
              <input
                type="text"
                value={medicalAlertsText}
                onChange={(e) => setMedicalAlertsText(e.target.value)}
                placeholder="Ej. Hipertensión controlada, Ideación previa contenida"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notas Generales de Admisión:
            </label>
            <textarea
              rows={2}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={hasSignedConsent}
              onChange={(e) => setHasSignedConsent(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Cuenta con Consentimiento Informado y Autorización de Tratamiento de Datos (Ley 1581 de 2012)
            </span>
          </label>

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
              {existingPatient ? 'Guardar Cambios' : 'Registrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
