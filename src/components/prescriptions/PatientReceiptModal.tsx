import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, X, FileCheck } from 'lucide-react';
import { PsychiatricPrescription } from '../../types';

interface PatientReceiptModalProps {
  prescription: PsychiatricPrescription;
  onClose: () => void;
  onSaveReceipt: (id: string, receiptData: any) => void;
}

export const PatientReceiptModal: React.FC<PatientReceiptModalProps> = ({
  prescription,
  onClose,
  onSaveReceipt,
}) => {
  const [patientOrGuardianName, setPatientOrGuardianName] = useState(
    prescription.patientName
  );
  const [documentNumber, setDocumentNumber] = useState(
    `${prescription.patientDocumentType} ${prescription.patientDocumentNumber}`
  );
  const [signatureMethod, setSignatureMethod] = useState<'Digital' | 'Manuscrita en Físico' | 'Código de Verificación OTP'>('Digital');
  const [notes, setNotes] = useState('Recepción conforme de fórmula psicofarmacológica con explicación de posología y precauciones.');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    onSaveReceipt(prescription.id, {
      patientOrGuardianName,
      documentNumber,
      receivedDate: new Date().toISOString(),
      signatureMethod,
      notes,
      integrityConfirmed: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-sm font-bold">Registrar Constancia del Paciente</h3>
              <p className="text-[11px] text-slate-400">
                Fórmula: {prescription.id} • {prescription.patientName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px]">
            <strong>Alcance Legal de la Constancia:</strong>
            <p className="mt-0.5">
              La firma del paciente o representante acredita la recepción de la fórmula y las instrucciones de posología. <strong>No autoriza ni sustituye la prescripción del Médico Psiquiatra.</strong>
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombre de quien recibe (Paciente o Representante):
            </label>
            <input
              type="text"
              required
              value={patientOrGuardianName}
              onChange={(e) => setPatientOrGuardianName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Documento de Identidad:
            </label>
            <input
              type="text"
              required
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Método de Constancia:
            </label>
            <select
              value={signatureMethod}
              onChange={(e: any) => setSignatureMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            >
              <option value="Digital">Firma Digital / Aceptación en Portal Paciente</option>
              <option value="Código de Verificación OTP">Código de Verificación Seguro (SMS/Email OTP)</option>
              <option value="Manuscrita en Físico">Firma Manuscrita en Documento Físico Impreso</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notas u Observaciones del Paciente:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <label className="flex items-start gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-600 dark:text-slate-400">
              Certifico que el paciente o su representante legal recibió la copia íntegra de la fórmula médica y fue instruido sobre su correcto uso y advertencias.
            </span>
          </label>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!acceptedTerms}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs disabled:opacity-50 transition"
            >
              Guardar Constancia de Entrega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
