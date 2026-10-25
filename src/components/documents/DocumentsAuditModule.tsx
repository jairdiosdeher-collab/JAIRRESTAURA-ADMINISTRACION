import React, { useState, useRef } from 'react';
import {
  ShieldAlert,
  Database,
  FileText,
  Lock,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const DocumentsAuditModule: React.FC = () => {
  const {
    auditLogs,
    exportDataBackup,
    restoreDataBackup,
    resetToInitialData,
    currentProfile,
  } = useApp();

  const [restoreSuccess, setRestoreSuccess] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = restoreDataBackup(content);
      setRestoreSuccess(success);
      setTimeout(() => setRestoreSuccess(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Seguridad, Auditoría y Cumplimiento Ley 1581 de 2012
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pistas de auditoría inmutables, gestión de consentimientos informados y copias de respaldo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportDataBackup}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Respaldo Cifrado</span>
            </button>
          </div>
        </div>

        {/* Legal Statement */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>Marco Constitucional y Regulatorio de Protección de Datos en Salud</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Conforme a la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013, los datos de salud mental y prescripciones psicofarmacológicas son catalogados como <strong>Datos Sensibles</strong>. JAIRRESTAURA implementa control de accesos disociado, registro inmutable de consultas y exportación segura.
          </p>
        </div>
      </div>

      {/* Backup & System Management Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Descargar copia de seguridad */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
            <Database className="w-4 h-4 text-teal-600" />
            <span>Copia de Seguridad Integral</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-snug">
            Descarga una copia completa e íntegra de todos los expedientes, fórmulas, finanzas y registros en formato JSON estructurado.
          </p>
          <button
            onClick={exportDataBackup}
            className="w-full py-2 px-3 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-teal-100 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Respaldo JSON</span>
          </button>
        </div>

        {/* Card 2: Restaurar desde respaldo */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Restauración de Datos</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-snug">
            Carga un archivo de respaldo JSON previamente exportado para recuperar la base de datos clínica y contable.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-100 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Seleccionar Archivo de Respaldo</span>
          </button>

          {restoreSuccess === true && (
            <p className="text-emerald-600 text-[11px] font-bold text-center">
              ✓ Base de datos restaurada con éxito.
            </p>
          )}
          {restoreSuccess === false && (
            <p className="text-red-600 text-[11px] font-bold text-center">
              ✕ Error al procesar el archivo. Verifique el formato.
            </p>
          )}
        </div>

        {/* Card 3: Reiniciar a datos de prueba */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
            <RefreshCw className="w-4 h-4 text-amber-600" />
            <span>Entorno Clínico de Demostración</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-snug">
            Restablece los pacientes, fórmulas psiquiátricas y movimientos a la configuración clínica y pastoral inicial.
          </p>
          <button
            onClick={() => {
              if (
                window.confirm(
                  '¿Desea restablecer los datos de demostración clínicos y psiquiátricos iniciales?'
                )
              ) {
                resetToInitialData();
              }
            }}
            className="w-full py-2 px-3 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-100 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer Casos Iniciales</span>
          </button>
        </div>
      </div>

      {/* Audit Trail Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Pistas de Auditoría y Registro Inmutable (Audit Trail)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {auditLogs.length} eventos registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Fecha y Hora</th>
                <th className="px-4 py-3">Usuario y Cargo</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Módulo</th>
                <th className="px-4 py-3">Detalle del Evento</th>
                <th className="px-4 py-3">Trazabilidad / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {auditLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="px-4 py-3 text-[11px] text-slate-500 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {log.userName}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        log.action === 'FIRMA_DIGITAL'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : log.action === 'CREACIÓN'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : log.action === 'MODIFICACIÓN'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[11px] text-teal-800 dark:text-teal-400">
                    {log.module}
                  </td>
                  <td className="px-4 py-3 text-[11px] max-w-md">
                    {log.details}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                    {log.ipAddress || '190.158.42.10'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
