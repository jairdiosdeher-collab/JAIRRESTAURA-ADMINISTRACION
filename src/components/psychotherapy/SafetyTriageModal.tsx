import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  PhoneCall,
  AlertTriangle,
  Heart,
  CheckCircle2,
  Lock,
  UserCheck,
  Save,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafetyRiskLevel, SafetyPlanData } from '../../types';

interface SafetyTriageModalProps {
  defaultPatientId?: string | null;
  onClose: () => void;
}

export const SafetyTriageModal: React.FC<SafetyTriageModalProps> = ({
  defaultPatientId,
  onClose,
}) => {
  const { patients, currentProfile, addSafetyTriage } = useApp();

  const [patientId, setPatientId] = useState(defaultPatientId || (patients[0]?.id || ''));
  const selectedPatient = patients.find((p) => p.id === patientId);

  const [riskLevel, setRiskLevel] = useState<SafetyRiskLevel>('Amarillo');
  const [ideationLevel, setIdeationLevel] = useState<
    | 'Ninguna'
    | 'Pasiva sin plan ni intención'
    | 'Activa con ideación difusa'
    | 'Activa estructurada con plan o intención inminente'
  >('Pasiva sin plan ni intención');

  const [riskFactors, setRiskFactors] = useState<string[]>([
    'Estrés psicosocial agudo',
    'Sensación de desesperanza transitoria',
  ]);
  const [customRiskFactor, setCustomRiskFactor] = useState('');

  const [protectiveFactors, setProtectiveFactors] = useState<string[]>([
    'Búsqueda activa de atención psicológica',
    'Vínculos afectivos significativos con familiares',
  ]);
  const [customProtectiveFactor, setCustomProtectiveFactor] = useState('');

  const [contactInformed, setContactInformed] = useState(true);
  const [emergencyContactName, setEmergencyContactName] = useState(
    selectedPatient?.emergencyContact?.name || ''
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    selectedPatient?.emergencyContact?.phone || ''
  );

  const [referredToEmergencyLine, setReferredToEmergencyLine] = useState(false);
  const [safetyPlanAgreed, setSafetyPlanAgreed] = useState(true);

  // Safety plan items
  const [warningSigns, setWarningSigns] = useState(
    'Aislamiento prolongado en habitación; pensar "no hay salida"; abandono del aseo personal.'
  );
  const [internalCoping, setInternalCoping] = useState(
    'TIPP (hielo en rostro durante 30 segundos); respiración 4-7-8; caminar o escuchar música instrumental.'
  );
  const [makingEnvironmentSafe, setMakingEnvironmentSafe] = useState(
    'Retiro y custodia de medicamentos o elementos cortantes por parte del contacto de apoyo familiar.'
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    'Se realiza contención emocional en encuadre seguro. Paciente firma compromiso de vida y acepta el plan de seguridad acordado.'
  );

  const [submitted, setSubmitted] = useState(false);

  const handleAddRiskFactor = () => {
    if (customRiskFactor.trim() && !riskFactors.includes(customRiskFactor.trim())) {
      setRiskFactors([...riskFactors, customRiskFactor.trim()]);
      setCustomRiskFactor('');
    }
  };

  const handleRemoveRiskFactor = (idx: number) => {
    setRiskFactors(riskFactors.filter((_, i) => i !== idx));
  };

  const handleAddProtectiveFactor = () => {
    if (customProtectiveFactor.trim() && !protectiveFactors.includes(customProtectiveFactor.trim())) {
      setProtectiveFactors([...protectiveFactors, customProtectiveFactor.trim()]);
      setCustomProtectiveFactor('');
    }
  };

  const handleRemoveProtectiveFactor = (idx: number) => {
    setProtectiveFactors(protectiveFactors.filter((_, i) => i !== idx));
  };

  const handleSaveTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const planData: SafetyPlanData = {
      warningSigns: warningSigns.split(';').map((s) => s.trim()).filter(Boolean),
      internalCoping: internalCoping.split(';').map((s) => s.trim()).filter(Boolean),
      supportPeople: [
        {
          name: emergencyContactName || selectedPatient.emergencyContact?.name || 'Contacto de apoyo familiar',
          phone: emergencyContactPhone || selectedPatient.emergencyContact?.phone || 'Sin número registrado',
        },
      ],
      professionalHelp: [
        'JAIRRESTAURA Consultorio Digital: +57 310 892 4110',
        'Línea 106 "El poder de ser escuchado" (Nacional)',
        'Línea 192 MinSalud Salud Mental',
        'Línea 123 Emergencias Médicas Colombia',
      ],
      makingEnvironmentSafe: makingEnvironmentSafe.split(';').map((s) => s.trim()).filter(Boolean),
    };

    addSafetyTriage({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      assessedAt: new Date().toISOString(),
      professionalId: currentProfile.id,
      professionalName: currentProfile.name,
      riskLevel,
      riskFactorsPresent: riskFactors,
      protectiveFactorsPresent: protectiveFactors,
      suicidalIdeationLevel: ideationLevel,
      immediateContainmentSteps: [
        `Estratificación de riesgo asignada: ${riskLevel}`,
        `Plan de seguridad acordado: ${safetyPlanAgreed ? 'Sí' : 'No'}`,
        `Contacto de apoyo informado: ${contactInformed ? emergencyContactName : 'No notificado'}`,
      ],
      emergencyContactInformed: contactInformed,
      emergencyContactName,
      emergencyContactPhone,
      referredToEmergencyLine,
      safetyPlanAgreed,
      safetyPlanDetails: planData,
      notes: clinicalNotes,
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Risk indicator */}
        <div
          className={`px-6 py-4 flex items-center justify-between text-white shrink-0 ${
            riskLevel === 'Rojo'
              ? 'bg-red-700'
              : riskLevel === 'Naranja'
              ? 'bg-amber-700'
              : riskLevel === 'Amarillo'
              ? 'bg-yellow-700'
              : 'bg-emerald-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Protocolo Clínico de Triaje de Riesgo & Seguridad</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 uppercase tracking-wide">
                  Nivel {riskLevel}
                </span>
              </div>
              <p className="text-xs text-white/80">
                Estratificación estandarizada • Prevención del suicidio y contingencia clínica
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Colombian Emergency Lines Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 p-4 shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold block text-sm">
                  Líneas de Asistencia y Crisis en Salud Mental (Colombia)
                </span>
                Este aplicativo es un sistema clínico de consulta ambulatoria. Ante riesgo vital o intento activo inminente, active la ruta de urgencias médica y hospitalaria.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:106"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Línea 106 (Escucha)
              </a>
              <a
                href="tel:192"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Línea 192 (MinSalud)
              </a>
              <a
                href="tel:123"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                123 (Emergencias)
              </a>
            </div>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSaveTriage} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Patient Selector & Assessor info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paciente Evaluado *
              </label>
              <select
                value={patientId}
                onChange={(e) => {
                  setPatientId(e.target.value);
                  const p = patients.find((pat) => pat.id === e.target.value);
                  if (p?.emergencyContact) {
                    setEmergencyContactName(p.emergencyContact.name);
                    setEmergencyContactPhone(p.emergencyContact.phone);
                  }
                }}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.documentType} {p.documentNumber}) - {p.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Profesional Responsable del Triaje
              </label>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{currentProfile.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-semibold uppercase">
                  {currentProfile.role}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Level Matrix Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Nivel de Riesgo Clínico Determinado *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setRiskLevel('Verde')}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  riskLevel === 'Verde'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">Verde (Bajo)</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] opacity-80">
                  Sin ideación autolítica ni planes. Factores protectores sólidos.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRiskLevel('Amarillo')}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  riskLevel === 'Amarillo'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-900 dark:text-yellow-200'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">Amarillo (Moderado)</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500" />
                </div>
                <p className="text-[11px] opacity-80">
                  Ideación pasiva transitoria sin plan estructurado ni intención inmediata.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRiskLevel('Naranja')}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  riskLevel === 'Naranja'
                    ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">Naranja (Alto)</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                </div>
                <p className="text-[11px] opacity-80">
                  Ideación activa con método concebido. Requiere acompañamiento continuo de familiar.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRiskLevel('Rojo')}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  riskLevel === 'Rojo'
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">Rojo (Crítico)</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-red-600" />
                </div>
                <p className="text-[11px] opacity-80">
                  Intento inminente, acceso letal o conducta en curso. Remisión urgente hospitalaria.
                </p>
              </button>
            </div>
          </div>

          {/* Ideation Degree */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Graduación de la Ideación Autolítica *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'Ninguna', label: 'Ninguna: Deseo de vivir pleno sin pensamientos de muerte.' },
                { key: 'Pasiva sin plan ni intención', label: 'Pasiva: "Ojalá no despertara", sin método ni voluntad de actuar.' },
                { key: 'Activa con ideación difusa', label: 'Activa difusa: Piensa en métodos pero con ambivalencia y frenos.' },
                { key: 'Activa estructurada con plan o intención inminente', label: 'Activa estructurada: Plan concreto con intención, tiempo y lugar.' },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer ${
                    ideationLevel === item.key
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/30 text-teal-950 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="ideationDegree"
                    checked={ideationLevel === item.key}
                    onChange={() => setIdeationLevel(item.key as any)}
                    className="mt-0.5 text-teal-600 focus:ring-teal-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Risk Factors and Protective Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk factors */}
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
              <h3 className="text-xs font-bold text-red-900 dark:text-red-300 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Factores de Riesgo Clínico Presentes
              </h3>
              <div className="space-y-1.5 mb-3">
                {riskFactors.map((rf, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 text-slate-800 dark:text-slate-200"
                  >
                    <span>{rf}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRiskFactor(idx)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Agregar factor de riesgo..."
                  value={customRiskFactor}
                  onChange={(e) => setCustomRiskFactor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRiskFactor();
                    }
                  }}
                  className="flex-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddRiskFactor}
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Protective factors */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20">
              <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-600" />
                Factores Protectores & Anclas de Vida
              </h3>
              <div className="space-y-1.5 mb-3">
                {protectiveFactors.map((pf, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200"
                  >
                    <span>{pf}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProtectiveFactor(idx)}
                      className="text-emerald-600 hover:text-emerald-800 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Agregar factor protector..."
                  value={customProtectiveFactor}
                  onChange={(e) => setCustomProtectiveFactor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddProtectiveFactor();
                    }
                  }}
                  className="flex-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddProtectiveFactor}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Safety Plan (Stanley-Brown Protocol) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-600" />
                Plan de Seguridad y Contrato Terapéutico de Cuidado
              </h3>
              <label className="flex items-center gap-2 text-xs text-teal-700 dark:text-teal-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyPlanAgreed}
                  onChange={(e) => setSafetyPlanAgreed(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                Plan Acordado y Firmado con Consultante
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  1. Señales de advertencia tempranas de crisis
                </label>
                <textarea
                  rows={2}
                  value={warningSigns}
                  onChange={(e) => setWarningSigns(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  2. Estrategias internas de afrontamiento (sin contacto social)
                </label>
                <textarea
                  rows={2}
                  value={internalCoping}
                  onChange={(e) => setInternalCoping(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  3. Restricción letal y aseguramiento del entorno
                </label>
                <textarea
                  rows={2}
                  value={makingEnvironmentSafe}
                  onChange={(e) => setMakingEnvironmentSafe(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Support Person Notification & Emergency Line Referral */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contactInformed}
                  onChange={(e) => setContactInformed(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                Contacto de Emergencia Familiar Notificado
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Nombre de contacto..."
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  disabled={!contactInformed}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 p-1.5 bg-white dark:bg-slate-800 disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="Teléfono..."
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  disabled={!contactInformed}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 p-1.5 bg-white dark:bg-slate-800 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referredToEmergencyLine}
                  onChange={(e) => setReferredToEmergencyLine(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                Activación de Línea 106 / 123 o Traslado a Urgencias Hospitalarias
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Marque esta casilla si el caso exigió derivación activa o coordinación con red de ambulancia/hospital EPS.
              </p>
            </div>
          </div>

          {/* Clinical notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observaciones Clínicas del Triaje y Decisión Profesional *
            </label>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          {/* Submission and Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitted}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all ${
                riskLevel === 'Rojo'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  Triaje Registrado en Historia Clínica...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Evaluación de Triaje & Plan de Seguridad
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
