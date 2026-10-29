import { AmortizationRow, LoanSummary } from '../types';
import { Printer, Download } from 'lucide-react';

interface Props {
  data: AmortizationRow[];
  summary: LoanSummary;
}

export default function AmortizationTable({ data, summary }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['No.', 'Saldo Inicial', 'Cuota Fija', 'Interés', 'Capital', 'Saldo Final', 'Fecha de Pago'];
    const rows = data.map(row => [
      row.number,
      formatCurrency(row.initialBalance),
      formatCurrency(row.payment),
      formatCurrency(row.interest),
      formatCurrency(row.capital),
      formatCurrency(row.finalBalance),
      formatDate(row.paymentDate),
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tabla_amortizacion.csv';
    link.click();
  };

  if (!data.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl text-slate-400">No hay datos para mostrar</h3>
        <p className="text-slate-500 mt-2">Calcula un préstamo primero</p>
      </div>
    );
  }

  const totalPayments = data.reduce((sum, row) => sum + row.payment, 0);
  const totalInterest = data.reduce((sum, row) => sum + row.interest, 0);
  const totalCapital = data.filter(r => r.capital > 0).reduce((sum, row) => sum + row.capital, 0);

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">📋 Tabla de Amortización</h2>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-green-500/20 hover:border-green-500/50 transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/50 border-b border-blue-500/20">
                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">No.</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider">Saldo Inicial</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider">Cuota Fija</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider">Interés</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider">Capital</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider">Saldo Final</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-blue-300 uppercase tracking-wider">Fecha de Pago</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-700/30 hover:bg-blue-500/5 transition-colors ${
                    row.number === 0 ? 'bg-slate-900/30' : ''
                  } ${row.finalBalance === 0 ? 'bg-green-500/5' : ''}`}
                >
                  <td className="px-4 py-3 text-white font-medium">{row.number}</td>
                  <td className="px-4 py-3 text-right text-slate-300">Bs. {formatCurrency(row.initialBalance)}</td>
                  <td className="px-4 py-3 text-right text-white font-semibold">
                    {row.payment > 0 ? `Bs. ${formatCurrency(row.payment)}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-red-400">Bs. {formatCurrency(row.interest)}</td>
                  <td className={`px-4 py-3 text-right ${row.capital < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    Bs. {formatCurrency(row.capital)}
                  </td>
                  <td className="px-4 py-3 text-right text-white font-medium">
                    Bs. {formatCurrency(Math.max(0, row.finalBalance))}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400">{formatDate(row.paymentDate)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900/70 border-t-2 border-blue-500/30">
                <td className="px-4 py-3 text-white font-bold">TOTAL</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-white font-bold">Bs. {formatCurrency(totalPayments)}</td>
                <td className="px-4 py-3 text-right text-red-400 font-bold">Bs. {formatCurrency(totalInterest)}</td>
                <td className="px-4 py-3 text-right text-green-400 font-bold">Bs. {formatCurrency(totalCapital)}</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-blue-500/20 p-4">
          <p className="text-sm text-slate-400">Total Pagado</p>
          <p className="text-xl font-bold text-white">Bs. {formatCurrency(summary.totalPayment)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-green-500/20 p-4">
          <p className="text-sm text-slate-400">Total Capital Amortizado</p>
          <p className="text-xl font-bold text-green-400">Bs. {formatCurrency(totalCapital)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-red-500/20 p-4">
          <p className="text-sm text-slate-400">Total Intereses Pagados</p>
          <p className="text-xl font-bold text-red-400">Bs. {formatCurrency(totalInterest)}</p>
        </div>
      </div>
    </div>
  );
}
