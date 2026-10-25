import React, { useState } from 'react';
import { DollarSign, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  TransactionType,
  PaymentMethod,
  TransactionStatus,
} from '../../types';

interface TransactionModalProps {
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ onClose }) => {
  const { patients, addTransaction } = useApp();

  const [type, setType] = useState<TransactionType>('Ingreso');
  const [concept, setConcept] = useState('Consulta de Psiquiatría Especializada');
  const [category, setCategory] = useState('Consulta Psiquiatría');
  const [amount, setAmount] = useState<number>(220000);
  const [paidAmount, setPaidAmount] = useState<number>(220000);
  const [date, setDate] = useState('2026-10-25');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bancolombia');
  const [status, setStatus] = useState<TransactionStatus>('Pagado');
  const [patientId, setPatientId] = useState<string>('');
  const [voucherNumber, setVoucherNumber] = useState('TRF-' + Math.floor(Math.random() * 900000 + 100000));
  const [isReceivable, setIsReceivable] = useState(false);
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [notes, setNotes] = useState('');

  const incomeCategories = [
    'Consulta Psicológica',
    'Consulta Psiquiatría',
    'Paquete Psicoterapia',
    'Aporte Pastoral / Donación',
    'Taller / Curso Psicoeducativo',
    'Evaluación Psicométrica',
    'Otros Ingresos',
  ];

  const expenseCategories = [
    'Software y Suscripciones',
    'Honorarios Profesionales',
    'Internet y Telefonía',
    'Arriendo Consultorio Físico',
    'Publicidad y Marketing Digital',
    'Material Terapéutico y Pruebas',
    'Comisiones Pasarelas de Pago',
    'Otros Gastos',
  ];

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'Ingreso') {
      setCategory(incomeCategories[0]);
      setConcept('Sesión Psicoterapéutica');
    } else {
      setCategory(expenseCategories[0]);
      setConcept('Suscripción Plataforma');
      setPatientId('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPatient = patients.find((p) => p.id === patientId);

    addTransaction({
      type,
      concept,
      category,
      amount,
      paidAmount,
      date,
      paymentMethod,
      status,
      patientId: selectedPatient ? selectedPatient.id : undefined,
      patientName: selectedPatient
        ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
        : undefined,
      voucherNumber,
      isReceivable: isReceivable || status === 'Abonado' || status === 'Pendiente',
      dueDate: isReceivable ? dueDate : undefined,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">Registrar Movimiento Contable</h2>
              <p className="text-[11px] text-slate-400">
                Flujo de caja, comprobantes y conciliación en Pesos Colombianos (COP)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Tipo de movimiento */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('Ingreso')}
              className={`py-2 text-xs font-bold rounded-xl border transition ${
                type === 'Ingreso'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              + Ingreso (Recaudo)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('Gasto')}
              className={`py-2 text-xs font-bold rounded-xl border transition ${
                type === 'Gasto'
                  ? 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-800 dark:text-red-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              - Gasto / Egreso
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Concepto del Movimiento:
            </label>
            <input
              type="text"
              required
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoría:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                {(type === 'Ingreso' ? incomeCategories : expenseCategories).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Medio de Pago:
              </label>
              <select
                value={paymentMethod}
                onChange={(e: any) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="Bancolombia">Bancolombia Transferencia</option>
                <option value="Nequi">Nequi</option>
                <option value="Daviplata">Daviplata</option>
                <option value="PSE">PSE / Pasarela</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Otra Cuenta Bancaria</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Valor Total (COP):
              </label>
              <input
                type="number"
                step="5000"
                required
                value={amount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAmount(val);
                  if (status === 'Pagado') setPaidAmount(val);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Valor Efectivamente Pagado (COP):
              </label>
              <input
                type="number"
                step="5000"
                required
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha del Movimiento:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estado:
              </label>
              <select
                value={status}
                onChange={(e: any) => {
                  const s = e.target.value;
                  setStatus(s);
                  if (s === 'Pagado') setPaidAmount(amount);
                  if (s === 'Pendiente') setPaidAmount(0);
                  if (s === 'Abonado') setIsReceivable(true);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
              >
                <option value="Pagado">Pagado Totalmente</option>
                <option value="Abonado">Abonado (Saldo Pendiente)</option>
                <option value="Pendiente">Pendiente de Pago</option>
                <option value="Anulado">Anulado</option>
              </select>
            </div>
          </div>

          {type === 'Ingreso' && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paciente Asociado (Opcional):
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="">Ninguno / Venta directa de recurso</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} — ({p.documentNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Número de Comprobante / Voucher:
            </label>
            <input
              type="text"
              value={voucherNumber}
              onChange={(e) => setVoucherNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
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
              Registrar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
