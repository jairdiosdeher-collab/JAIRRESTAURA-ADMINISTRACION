import React, { useState } from 'react';
import {
  FileText,
  X,
  ShieldCheck,
  Brain,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NoteType } from '../../types';

interface SoapNoteModalProps {
  onClose: () => void;
  defaultPatientId?: string;
}

export const SoapNoteModal: React.FC<SoapNoteModalProps> = ({
  onClose,
  defaultPatientId,
}) => {
  const { patients, currentProfile, addSoapNote } = useApp();

  const [patientId, setPatientId] = useState<string>(
    defaultPatientId || (patients[0]?.id || '')
  );

  const selectedPatient = patients.find((p) => p.id === patientId) || patients[0];

  // Auto-select note type according to current user profile role
  const defaultNoteType: NoteType =
    currentProfile.role === 'psiquiatra'
      ? 'psiquiatria_interconsulta'
      : currentProfile.role === 'orientador'
      ? 'orientacion_pastoral'
      : 'psicologia_soap';

  const [type, setType] = useState<NoteType>(defaultNoteType);

  // SOAP Fields
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  // Mental Status Exam (Examen Mental)
  const [showMentalExam, setShowMentalExam] = useState(
    currentProfile.role === 'psiquiatra' || currentProfile.role === 'psicologo'
  );
  const [porte, setPorte] = useState('Adecuado arreglo y presentación, actitud colaboradora.');
  const [conciencia, setConciencia] = useState('Lúcido/a, alerta, sin fluctuaciones.');
  const [orientacion, setOrientacion] = useState('Orientado/a en tiempo, espacio y persona.');
  const [pensamiento, setPensamiento] = useState('Lógico, coherente, velocidad normal, sin ideas delirantes ni autolíticas.');
  const [afecto, setAfecto] = useState('Modulado, reactivo a estímulos.');
  const [insight, setInsight] = useState('Adecuado reconocimiento de sintomatología.');

  // Factors & Remissions
  const [riskFactors, setRiskFactors] = useState('');
  const [protectiveFactors, setProtectiveFactors] = useState('');
  const [remissions, setRemissions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addSoapNote({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      date: new Date().toISOString(),
      type,
      authorId: currentProfile.id,
      authorName: currentProfile.name,
      authorRole: currentProfile.role,
      authorRegistration: currentProfile.registrationNumber,
      subjective,
      objective,
      assessment,
      plan,
      mentalExam: showMentalExam
        ? {
            porteYActitud: porte,
            conciencia,
            orientacion,
            pensamiento,
            afecto,
            insight,
          }
        : undefined,
      riskFactors: riskFactors
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
      protectiveFactors: protectiveFactors
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      remissions: remissions || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">Registro de Sesión y Evolución Clínica / Pastoral</h2>
              <p className="text-[11px] text-slate-400">
                Estructura formal SOAP • Registro inmutable con trazabilidad
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Author identification box */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                Autor: {currentProfile.name}
              </span>
              <p className="text-[11px] text-slate-500">
                {currentProfile.title} • {currentProfile.registrationNumber}
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Sesión Certificada
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paciente:
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} — ({p.documentType} {p.documentNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoría del Registro:
              </label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-teal-500"
              >
                <option value="psicologia_soap">Nota Clínica Psicológica (SOAP)</option>
                <option value="psiquiatria_interconsulta">Control / Interconsulta Médica Psiquiátrica</option>
                <option value="orientacion_pastoral">Nota de Orientación y Acompañamiento Pastoral</option>
                <option value="evolucion_general">Nota de Evolución General</option>
              </select>
            </div>
          </div>

          {/* S - Subjetivo */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
              <span>S — Subjetivo (Motivo de consulta y relato expresado por el paciente)*:</span>
              <span className="text-[10px] text-slate-400 font-normal">Citas textuales o declaradas</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="El consultante refiere: 'Durante esta semana sentí mejoría en los episodios de angustia, sin embargo...'"
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* O - Objetivo */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
              <span>O — Objetivo (Observaciones conductuales, signos clínicos y examen)*:</span>
              <span className="text-[10px] text-slate-400 font-normal">Evidencia objetivable</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Paciente puntual, con adecuada higiene personal. Afecto modulado, contacto visual sostenido, sin signos de agitación motora..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Optional Mental Status Exam toggler */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 uppercase flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-teal-600" />
                Examen del Estado Mental Estructurado
              </span>
              <button
                type="button"
                onClick={() => setShowMentalExam(!showMentalExam)}
                className="text-xs text-teal-700 dark:text-teal-400 font-semibold hover:underline"
              >
                {showMentalExam ? 'Ocultar campos' : 'Desplegar campos'}
              </button>
            </div>

            {showMentalExam && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Porte y Actitud:
                  </label>
                  <input
                    type="text"
                    value={porte}
                    onChange={(e) => setPorte(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Conciencia y Orientación:
                  </label>
                  <input
                    type="text"
                    value={orientacion}
                    onChange={(e) => setOrientacion(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Pensamiento (Curso y Contenido):
                  </label>
                  <input
                    type="text"
                    value={pensamiento}
                    onChange={(e) => setPensamiento(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                    Afecto y Juicio / Insight:
                  </label>
                  <input
                    type="text"
                    value={afecto}
                    onChange={(e) => setAfecto(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* A - Análisis / Apreciación */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
              <span>A — Apreciación / Análisis Clínico o Reflexión Pastoral*:</span>
              <span className="text-[10px] text-slate-400 font-normal">Hipótesis profesional fundada</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Evolución favorable hacia las metas conductuales. Se observa reducción de conductas evitativas..."
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* P - Plan */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
              <span>P — Plan de Acción, Tareas Terapéuticas y Seguimiento*:</span>
              <span className="text-[10px] text-slate-400 font-normal">Próxima sesión y acuerdos</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="1. Ejercicio de registro conductual ABC. 2. Mantener horario de sueño. 3. Próxima consulta en 8 días."
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Risk & Protective factors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Factores Protectores:
              </label>
              <input
                type="text"
                placeholder="Ej. Red familiar cercana, adhesión terapéutica"
                value={protectiveFactors}
                onChange={(e) => setProtectiveFactors(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Factores de Riesgo / Alertas:
              </label>
              <input
                type="text"
                placeholder="Ej. Sobrecarga laboral, aislamiento social"
                value={riskFactors}
                onChange={(e) => setRiskFactors(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Remisiones a Otras Especialidades (Psiquiatría, Nutrición, Medicina General):
            </label>
            <input
              type="text"
              placeholder="Opcional: Describir si se remite a Psiquiatría o médico tratante..."
              value={remissions}
              onChange={(e) => setRemissions(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
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
              Guardar Nota Inmutable
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
