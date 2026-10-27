import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ContextualHelpButtonProps {
  sectionId: string;
  label?: string;
  variant?: 'button' | 'badge' | 'icon';
  className?: string;
}

export const ContextualHelpButton: React.FC<ContextualHelpButtonProps> = ({
  sectionId,
  label = 'Ayuda de este módulo',
  variant = 'button',
  className = '',
}) => {
  const { openContextualHelp } = useApp();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => openContextualHelp(sectionId)}
        className={`p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 transition ${className}`}
        title={label}
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={() => openContextualHelp(sectionId)}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 hover:bg-teal-100 transition shadow-2xs ${className}`}
      >
        <HelpCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openContextualHelp(sectionId)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 transition ${className}`}
    >
      <HelpCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
      <span>{label}</span>
    </button>
  );
};
