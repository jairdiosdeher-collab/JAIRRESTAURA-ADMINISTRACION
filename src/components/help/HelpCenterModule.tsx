import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Printer,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  Play,
  PhoneCall,
  Check,
  Share2,
  Bookmark,
  FileText,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { USER_MANUAL_SECTIONS } from '../../data/userManualData';
import { UserManualSection } from '../../types';
import { downloadUserManualPDF } from '../../utils/manualPdfGenerator';

export const HelpCenterModule: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    previousTab,
    returnFromHelp,
    helpSectionTarget,
    setHelpSectionTarget,
  } = useApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeSectionId, setActiveSectionId] = useState<string>(
    helpSectionTarget || USER_MANUAL_SECTIONS[0].id
  );

  // Completed steps tracker for interactive checklists
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Surprise: Interactive Clinical Flow Simulator
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulatorStep, setSimulatorStep] = useState(1);

  // Sync section target if set from outside
  useEffect(() => {
    if (helpSectionTarget) {
      const match = USER_MANUAL_SECTIONS.find(
        (s) => s.id === helpSectionTarget || s.relatedModuleId === helpSectionTarget
      );
      if (match) {
        setActiveSectionId(match.id);
      }
    }
  }, [helpSectionTarget]);

  // Categories
  const categories = [
    'todos',
    'Introducción',
    'Gestión Clínica',
    'Psicoterapia & Psiquiatría',
    'Administración & Soporte',
    'Seguridad & Auditoría',
  ];

  // Filtered sections
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return USER_MANUAL_SECTIONS.filter((sec) => {
      const matchesCategory =
        selectedCategory === 'todos' || sec.category === selectedCategory;
      const matchesSearch =
        !q ||
        sec.title.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.whatItDoes.toLowerCase().includes(q) ||
        sec.keywords.some((k) => k.toLowerCase().includes(q)) ||
        sec.steps.some((st) => st.instruction.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeSection =
    USER_MANUAL_SECTIONS.find((s) => s.id === activeSectionId) ||
    filteredSections[0] ||
    USER_MANUAL_SECTIONS[0];

  const activeIndex = USER_MANUAL_SECTIONS.findIndex(
    (s) => s.id === activeSection.id
  );
  const prevSection =
    activeIndex > 0 ? USER_MANUAL_SECTIONS[activeIndex - 1] : null;
  const nextSection =
    activeIndex < USER_MANUAL_SECTIONS.length - 1
      ? USER_MANUAL_SECTIONS[activeIndex + 1]
      : null;

  const toggleStepCheckbox = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNavigateToLiveModule = (moduleId?: string) => {
    if (!moduleId) return;
    setActiveTab(moduleId);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold backdrop-blur-xs border border-teal-500/30">
                <BookOpen className="w-3.5 h-3.5" />
                Centro de Ayuda & Manual del Usuario • 27 Secciones
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[11px] font-medium">
                Versión 2026.10 Enterprise
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manual de Procedimientos & Seguridad Clínica
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Guía técnica, asistencial y legal de JAIRRESTAURA Consultorio Digital. Procedimientos paso a paso, validación de datos requeridos, protocolos de psicoterapia basada en evidencia, fórmulas médicas con ReTHUS y cumplimiento de la Ley 1581 de 2012.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {previousTab && previousTab !== 'help' && (
              <button
                onClick={returnFromHelp}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al módulo anterior</span>
              </button>
            )}

            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/30 text-xs font-bold transition shadow-xs"
              title="Simulador guiado de los flujos clínicos asistenciales"
            >
              <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
              <span>Simulador de Flujos</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              title="Imprimir sección o exportar vista"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={downloadUserManualPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-extrabold shadow-lg hover:shadow-teal-500/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Manual PDF (A4)</span>
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar procedimientos, términos legales (Ley 1581, ReTHUS, SOAP, CIE-10, TCC, fórmulas)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 shrink-0">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>
              {filteredSections.length} de {USER_MANUAL_SECTIONS.length} secciones
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {cat === 'todos' ? 'Todos los Temas (27)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Index + Right Article Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Navigation Index (4 of 12 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-20 max-h-[calc(100vh-6rem)] flex flex-col">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-600" />
              Índice de Secciones
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
              {filteredSections.length}
            </span>
          </div>

          <div className="p-2 overflow-y-auto space-y-1 flex-1">
            {filteredSections.map((sec) => {
              const isActive = sec.id === activeSection.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    setHelpSectionTarget(sec.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/80 text-teal-950 dark:text-teal-200 font-semibold shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {sec.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs block line-clamp-1">{sec.title}</span>
                    <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">
                      {sec.category}
                    </span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-1" />}
                </button>
              );
            })}

            {filteredSections.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500">
                No se encontraron secciones para "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Main Article Reader (8 of 12 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
          {/* Article Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold">
                  Sección {activeSection.number.toString().padStart(2, '0')}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                  {activeSection.category}
                </span>
              </div>

              {activeSection.relatedModuleId && (
                <button
                  onClick={() => handleNavigateToLiveModule(activeSection.relatedModuleId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 text-xs font-semibold hover:bg-teal-100 transition"
                  title="Abrir este módulo en la aplicación"
                >
                  <span>Ir al módulo en vivo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {activeSection.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
              {activeSection.summary}
            </p>
          </div>

          {/* 1. ¿Qué hace este módulo? */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              1. ¿Qué hace este módulo?
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeSection.whatItDoes}
            </p>
          </div>

          {/* 2. ¿Cómo acceder? */}
          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 space-y-2">
            <h3 className="text-xs font-bold text-teal-950 dark:text-teal-200 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              2. ¿Cómo acceder?
            </h3>
            <p className="text-xs text-teal-900 dark:text-teal-300 font-medium">
              {activeSection.howToAccess}
            </p>
          </div>

          {/* 3. Procedimiento numerado paso a paso con checklists interactivos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                3. Procedimiento numerado paso a paso
              </h3>
              <span className="text-[11px] text-slate-400">
                Marque cada paso a medida que lo ejecute
              </span>
            </div>

            <div className="space-y-2.5">
              {activeSection.steps.map((st) => {
                const stepKey = `${activeSection.id}-step-${st.stepNumber}`;
                const isChecked = !!completedSteps[stepKey];

                return (
                  <div
                    key={st.stepNumber}
                    onClick={() => toggleStepCheckbox(stepKey)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    <div className="flex-1">
                      <span
                        className={`text-xs font-bold block ${
                          isChecked
                            ? 'line-through text-emerald-900 dark:text-emerald-300'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        Paso {st.stepNumber}: {st.instruction}
                      </span>
                      {st.detail && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {st.detail}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Datos requeridos */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              4. Datos requeridos para la operación
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeSection.requiredData.map((d, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Verificación de éxito & 6. Si falla */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
              <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                5. Verificación de Éxito
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {activeSection.successVerification}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-1.5">
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                6. Qué hacer si la función falla
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {activeSection.troubleshooting}
              </p>
            </div>
          </div>

          {/* 7. Precauciones de Privacidad & Seguridad (Ley 1581) */}
          <div className="p-5 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2">
            <h3 className="text-xs font-bold text-red-900 dark:text-red-200 flex items-center gap-2 uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              7. Precauciones de Privacidad, Seguridad & Ley 1581 de 2012
            </h3>
            <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
              {activeSection.securityAndPrivacyPrecautions}
            </p>
          </div>

          {/* FAQs del módulo si están disponibles */}
          {activeSection.faqs && activeSection.faqs.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                Preguntas Frecuentes de esta Sección
              </h3>
              <div className="space-y-3">
                {activeSection.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1"
                  >
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      • {faq.question}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 pl-3 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Prev / Next Navigators */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            {prevSection ? (
              <button
                onClick={() => {
                  setActiveSectionId(prevSection.id);
                  setHelpSectionTarget(prevSection.id);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>
                  Anterior: {prevSection.number}. {prevSection.title}
                </span>
              </button>
            ) : <div />}

            {nextSection && (
              <button
                onClick={() => {
                  setActiveSectionId(nextSection.id);
                  setHelpSectionTarget(nextSection.id);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition"
              >
                <span>
                  Siguiente: {nextSection.number}. {nextSection.title}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SURPRISE FEATURE: SIMULADOR DE FLUJOS CLÍNICOS ASISTENCIALES */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Simulador Interactivo de Flujos Asistenciales</h3>
                  <p className="text-xs text-slate-400">
                    Aprenda en 4 pasos guiados cómo opera JAIRRESTAURA en una atención real
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Stepper bar */}
            <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              {[
                { num: 1, label: 'Admisión' },
                { num: 2, label: 'Formulación TCC' },
                { num: 3, label: 'Sesión & SUDS' },
                { num: 4, label: 'Prescripción ReTHUS' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      simulatorStep === s.num
                        ? 'bg-teal-600 text-white'
                        : simulatorStep > s.num
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span className="hidden sm:inline text-xs font-semibold">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="p-6 space-y-4">
              {simulatorStep === 1 && (
                <div className="space-y-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                    Paso 1: Admisión & Consentimiento Ley 1581
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    El consultante ingresa por primera vez. Se valida que su cédula no exista previamente en el sistema para evitar expedientes duplicados, y se registra la aceptación explícita del consentimiento de salud.
                  </p>
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-950 dark:text-teal-200">
                    <strong>Comprobación clínica:</strong> Se genera código PAC-2026-XXX y la persona queda disponible de inmediato para agendamiento y formulación.
                  </div>
                </div>
              )}

              {simulatorStep === 2 && (
                <div className="space-y-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                    Paso 2: Formulación Funcional de Caso (4 P's) & Metas SMART
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    El psicólogo mapea los factores Predisponentes, Precipitantes, Mantenedores y Protectores. Se apoya en la IA clínica para formular la hipótesis explicativa y define metas SMART cuantificables.
                  </p>
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-950 dark:text-teal-200">
                    <strong>Comprobación clínica:</strong> La hipótesis queda firmada por el profesional colegiado y las metas presentan barras de avance porcentual.
                  </div>
                </div>
              )}

              {simulatorStep === 3 && (
                <div className="space-y-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                    Paso 3: Conducción de Sesión Guiada (SUDS Pre/Post y Pausa Grounding)
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    Durante la consulta, el terapeuta aplica la técnica elegida midiendo el malestar (ej: SUDS 8/10 antes de la técnica). Si surge desregulación, pulsa «Pausa por Desregulación» para aplicar Grounding 5-4-3-2-1 hasta retornar a la ventana de tolerancia.
                  </p>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200">
                    <strong>Comprobación clínica:</strong> La sesión registra la variación terapéutica (ej: 8/10 → 3/10) y acuerda tareas voluntarias.
                  </div>
                </div>
              )}

              {simulatorStep === 4 && (
                <div className="space-y-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                    Paso 4: Prescripción Médica Psiquiátrica & Validación ReTHUS
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    Si el cuadro amerita psicofármacos, el Médico Psiquiatra elabora la receta con Denominación Común Internacional (DCI), concentración y cantidad en letras. Aplica su firma digital ReTHUS y descarga el PDF A4 oficial.
                  </p>
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-purple-950 dark:text-purple-200">
                    <strong>Comprobación clínica:</strong> La fórmula cumple con el Decreto 780 de 2016 y la constancia de entrega queda sellada en la historia clínica.
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                disabled={simulatorStep === 1}
                onClick={() => setSimulatorStep((s) => s - 1)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold disabled:opacity-30"
              >
                Anterior
              </button>

              <span className="text-xs text-slate-500 font-medium">
                Paso {simulatorStep} de 4
              </span>

              {simulatorStep < 4 ? (
                <button
                  onClick={() => setSimulatorStep((s) => s + 1)}
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={() => setIsSimulatorOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  ¡Entendido! Cerrar Simulador
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
