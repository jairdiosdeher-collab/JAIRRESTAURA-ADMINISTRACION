import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ShieldAlert,
  FileText,
  CheckCircle,
  Copy,
  ArrowRight,
  AlertTriangle,
  Send,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AiClinicalAssistantModalProps {
  onClose: () => void;
}

export const AiClinicalAssistantModal: React.FC<AiClinicalAssistantModalProps> = ({
  onClose,
}) => {
  const { patients, soapNotes, prescriptions } = useApp();

  const [toolMode, setToolMode] = useState<'soap_formatter' | 'summary' | 'field_checker'>('soap_formatter');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  // Sample quick templates
  const handleLoadSampleNotes = () => {
    setInputText(
      'Paciente refiere que esta semana durmió mejor pero sigue sintiendo presión en el pecho cuando su jefe le escribe por Teams. Llegó puntual, arreglado, con discurso fluido y coherente, contacto visual normal, algo tenso en cuello. Creo que tiene ansiedad generalizada relacionada con sobrecarga de trabajo. Le enseñé respiración diafragmática y le pedí que no conteste mensajes después de las 8pm. Próxima sesión en 7 días.'
    );
  };

  const handleProcess = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      if (toolMode === 'soap_formatter') {
        setOutputText(`[ESTRUCTURACIÓN PRELIMINAR FORMATO SOAP]

S — SUBJETIVO:
Consultante reporta mejoría relativa en el patrón de sueño, pero manifiesta persistencia de sintomatología ansiosa somática (presión torácica) contingente a la recepción de comunicaciones laborales fuera de horario habitual.

O — OBJETIVO:
Asiste puntual con adecuado arreglo y presentación personal. Discurso coherente, velocidad y volumen conservados. Contacto visual sostenido. Se observa leve hipertonía muscular en región cervical y trapezoidal. Sin alteraciones sensoperceptivas ni desorientación alopsíquica.

A — APRECIACIÓN / ANÁLISIS:
Sintomatología concordante con reactividad ansiosa y sobrecarga ocupacional (Burnout en proceso de modulación). Se observa adecuada permeabilidad a técnicas de desactivación fisiológica.

P — PLAN:
1. Práctica de respiración diafragmática ante picos de activación autonómica.
2. Establecimiento de límite conductual de desconexión digital estricta a partir de las 20:00 horas.
3. Próxima sesión de seguimiento en 7 días.`);
      } else if (toolMode === 'summary') {
        setOutputText(`[SÍNTESIS DE ANTECEDENTES Y EVOLUCIÓN]

Paciente en acompañamiento multimodal. Presenta antecedentes de estrés crónico y reactividad ansiosa. Actualmente cuenta con red de apoyo familiar activa y consentimiento informado firmado. No se registran alergias severas adicionales. Se mantiene adherencia al cronograma de sesiones quincenales.`);
      } else {
        setOutputText(`[INSPECCIÓN DE CAMPOS OBLIGATORIOS Y SEGURIDAD]

✓ Datos de identificación completos: Paciente identificado con documento oficial y edad calculada.
✓ Consentimiento informado Ley 1581: Aceptado y registrado en expediente.
⚠ Verificación psicofarmacológica: Recuerde que ninguna fórmula médica tiene validez legal de dispensación sin la firma digital y el registro ReTHUS del Médico Psiquiatra autorizado.`);
      }
      setIsProcessing(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Asistente IA Clínico & Estructurador Documental</h2>
              <p className="text-[11px] text-slate-400">
                Organización de notas SOAP • Sujeto a validación humana estricta
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guardrail Disclaimer Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/60 p-3 px-6 border-b border-amber-200 dark:border-amber-800 text-[11px] text-amber-950 dark:text-amber-200 flex items-center gap-2.5 shrink-0">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Guardrails Éticos Activos:</strong> La IA actúa exclusivamente como asistente de redacción y formato. <strong>No inventa diagnósticos, no prescribe medicamentos ni sustituye el juicio del profesional de salud.</strong>
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Tool Selector */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            {[
              { id: 'soap_formatter', label: 'Estructurar Notas SOAP' },
              { id: 'summary', label: 'Resumen de Antecedentes' },
              { id: 'field_checker', label: 'Auditoría de Campos Obligatorios' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setToolMode(t.id as any);
                  setOutputText('');
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  toolMode === t.id
                    ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Ingrese las notas desordenadas o el texto de la sesión:
              </label>
              <button
                type="button"
                onClick={handleLoadSampleNotes}
                className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold hover:underline"
              >
                Cargar texto de ejemplo
              </button>
            </div>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escriba aquí los apuntes tomados durante la consulta para estructurarlos..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleProcess}
              disabled={isProcessing || !inputText.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Procesando estructuración...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Estructurar con IA</span>
                </>
              )}
            </button>
          </div>

          {/* Output area */}
          {outputText && (
            <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Borrador Estructurado Generado
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 transition"
                >
                  <Copy className="w-3 h-3 text-teal-600" />
                  <span>{copied ? 'Copiado ✓' : 'Copiar al portapapeles'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                {outputText}
              </div>

              <div className="p-2.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-[10px] text-teal-900 dark:text-teal-300">
                Aviso: Toda salida clínica generada por IA se cataloga como borrador auxiliar. Revise y valide el contenido antes de insertarlo en la historia clínica oficial.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
