import React from 'react';
import {
  X,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Printer,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { USER_MANUAL_SECTIONS } from '../../data/userManualData';
import { downloadUserManualPDF } from '../../utils/manualPdfGenerator';

export const ContextualHelpDrawer: React.FC = () => {
  const {
    contextualDrawerOpen,
    closeContextualHelp,
    contextualHelpSectionId,
    navigateToHelp,
  } = useApp();

  if (!contextualDrawerOpen) return null;

  // Find the requested section by id or number or default to section 1
  const section =
    USER_MANUAL_SECTIONS.find((s) => s.id === contextualHelpSectionId) ||
    USER_MANUAL_SECTIONS.find(
      (s) =>
        s.number.toString() === contextualHelpSectionId ||
        s.relatedModuleId === contextualHelpSectionId
    ) ||
    USER_MANUAL_SECTIONS[0];

  const handleOpenFullManual = () => {
    closeContextualHelp();
    navigateToHelp(section.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity duration-300 pointer-events-auto"
        onClick={closeContextualHelp}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex pointer-events-auto">
        <div className="w-screen max-w-xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col h-full animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                  Ayuda Contextual • Sección {section.number}
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-1">{section.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenFullManual}
                title="Abrir en el Centro de Ayuda completo"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold flex items-center gap-1 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Manual Completo</span>
              </button>
              <button
                onClick={closeContextualHelp}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader banner */}
          <div className="px-5 py-2.5 bg-teal-50 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900/40 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200 shrink-0">
            <span className="font-semibold truncate">
              Categoría: <strong>{section.category}</strong>
            </span>
            <button
              onClick={downloadUserManualPDF}
              className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar PDF
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
            {/* Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                ¿Qué hace este módulo?
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {section.whatItDoes}
              </p>
            </div>

            {/* How to access */}
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                ¿Cómo acceder?
              </span>
              <p className="text-slate-600 dark:text-slate-400 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 font-mono text-[11px]">
                {section.howToAccess}
              </p>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-3">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Procedimiento Paso a Paso:
              </span>
              <div className="space-y-2">
                {section.steps.map((st) => (
                  <div
                    key={st.stepNumber}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {st.stepNumber}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {st.instruction}
                      </span>
                    </div>
                    {st.detail && (
                      <p className="text-slate-600 dark:text-slate-400 pl-7 text-[11px] leading-relaxed">
                        {st.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Required Data Checklist */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Datos Necesarios:
              </span>
              <ul className="space-y-1">
                {section.requiredData.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Success and Failure Verification */}
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verificación de éxito:
                </span>
                <p className="text-emerald-800 dark:text-emerald-300 text-[11px]">
                  {section.successVerification}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Si la función falla:
                </span>
                <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                  {section.troubleshooting}
                </p>
              </div>
            </div>

            {/* Legal and Security Warnings */}
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-1.5">
              <span className="font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Precaución Legal & Ley 1581 de 2012:
              </span>
              <p className="text-red-800 dark:text-red-300 text-[11px] leading-relaxed">
                {section.securityAndPrivacyPrecautions}
              </p>
            </div>

            {/* FAQs if present */}
            {section.faqs && section.faqs.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Preguntas Frecuentes:
                </span>
                {section.faqs.map((faq, idx) => (
                  <div key={idx} className="space-y-1 text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                      • {faq.question}
                    </span>
                    <p className="text-slate-500 pl-3 italic">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with return and full manual buttons */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <button
              onClick={closeContextualHelp}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Cerrar Ayuda
            </button>
            <button
              onClick={handleOpenFullManual}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
            >
              <span>Ver en Manual Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
