import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Download,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Filter,
  Search,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FinancialTransaction, TransactionType } from '../../types';
import { formatCOP, formatDate } from '../../utils/formatters';
import { TransactionModal } from './TransactionModal';

export const FinanceModule: React.FC = () => {
  const { transactions } = useApp();

  const [activeTab, setActiveTab] = useState<'todos' | 'ingresos' | 'gastos' | 'por_cobrar'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'Ingreso' && t.status !== 'Anulado')
    .reduce((sum, t) => sum + t.paidAmount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Gasto' && t.status !== 'Anulado')
    .reduce((sum, t) => sum + t.paidAmount, 0);

  const totalReceivable = transactions
    .filter((t) => t.isReceivable && t.status === 'Abonado')
    .reduce((sum, t) => sum + (t.amount - t.paidAmount), 0);

  const netProfit = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      t.concept.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      (t.patientName && t.patientName.toLowerCase().includes(term)) ||
      (t.voucherNumber && t.voucherNumber.toLowerCase().includes(term));

    const matchesTab =
      activeTab === 'todos'
        ? true
        : activeTab === 'ingresos'
        ? t.type === 'Ingreso'
        : activeTab === 'gastos'
        ? t.type === 'Gasto'
        : t.isReceivable && t.status === 'Abonado';

    return matchesSearch && matchesTab;
  });

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Tipo',
      'Fecha',
      'Concepto',
      'Categoría',
      'Valor Total',
      'Valor Pagado',
      'Medio de Pago',
      'Estado',
      'Paciente',
      'Comprobante',
    ];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.type,
      t.date,
      `"${t.concept.replace(/"/g, '""')}"`,
      t.category,
      t.amount,
      t.paidAmount,
      t.paymentMethod,
      t.status,
      t.patientName || 'N/A',
      t.voucherNumber || 'S/N',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contabilidad_jairrestaura_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Administración Financiera y Contabilidad Colombiana
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Flujo de caja, conciliación de consultas, gastos operativos y cuentas por cobrar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={exportToCSV}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar Excel / CSV</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Movimiento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recaudos */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Ingresos Recaudados
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCOP(totalIncome)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Efectivamente ingresado en bancos
          </span>
        </div>

        {/* Egresos */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Gastos Operacionales
            </span>
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-red-600 dark:text-red-400">
            {formatCOP(totalExpense)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Honorarios, software y conectividad
          </span>
        </div>

        {/* Cuentas por Cobrar */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Cuentas por Cobrar
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-amber-600 dark:text-amber-400">
            {formatCOP(totalReceivable)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Saldos pendientes de paquetes
          </span>
        </div>

        {/* Utilidad Neta */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Margen Operativo
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`mt-2 text-xl font-black ${
              netProfit >= 0 ? 'text-teal-700 dark:text-teal-400' : 'text-red-600'
            }`}
          >
            {formatCOP(netProfit)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Balance administrativo del periodo
          </span>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'todos', label: 'Todos los Movimientos' },
            { id: 'ingresos', label: 'Ingresos' },
            { id: 'gastos', label: 'Egresos' },
            { id: 'por_cobrar', label: 'Cuentas por Cobrar' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por concepto o comprobante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Concepto y Categoría</th>
                <th className="px-4 py-3">Paciente / Tercero</th>
                <th className="px-4 py-3">Medio & Soporte</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Valor Pagado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredTransactions.map((trx) => (
                <tr
                  key={trx.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="px-4 py-3 font-mono font-bold text-[11px] text-slate-900 dark:text-white">
                    {trx.id}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-500 whitespace-nowrap">
                    {formatDate(trx.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {trx.concept}
                    </span>
                    <span className="text-[10px] text-slate-400">{trx.category}</span>
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    {trx.patientName || 'Consultorio General'}
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">
                      {trx.paymentMethod}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {trx.voucherNumber || 'S/N'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        trx.status === 'Pagado'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : trx.status === 'Abonado'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-black text-xs ${
                      trx.type === 'Ingreso'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {trx.type === 'Ingreso' ? '+' : '-'} {formatCOP(trx.paidAmount)}
                    {trx.status === 'Abonado' && (
                      <span className="block text-[10px] text-amber-600 font-normal">
                        Pendiente: {formatCOP(trx.amount - trx.paidAmount)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <TransactionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
