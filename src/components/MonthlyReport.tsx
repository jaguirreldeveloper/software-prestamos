import { useState } from 'react';
import { SavedLoan } from '../types';
import { FileText, Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Props {
  loans: SavedLoan[];
}

export default function MonthlyReport({ loans }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getMonthName = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const generateReport = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    
    // Filter payments for selected month
    const monthlyPayments = loans.flatMap(loan => 
      loan.payments
        .filter(payment => {
          const paymentDate = new Date(payment.paidDate);
          return paymentDate.getFullYear() === year && paymentDate.getMonth() + 1 === month;
        })
        .map(payment => ({
          loanName: loan.name,
          clientName: loan.clientName,
          quotaNumber: payment.quotaNumber,
          amount: payment.amount,
          paidDate: payment.paidDate,
        }))
    );

    // Calculate metrics
    const totalCollected = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPayments = monthlyPayments.length;
    
    // Expected payments for the month
    const expectedPayments = loans.reduce((sum, loan) => {
      if (loan.status !== 'active') return sum;
      const loanStart = new Date(loan.params.startDate);
      const monthStart = new Date(year, month - 1, 1);
      
      // Check if loan was active during this month
      if (loanStart <= monthStart) {
        const monthsSinceStart = (year - loanStart.getFullYear()) * 12 + (month - loanStart.getMonth() - 1);
        if (monthsSinceStart >= 0 && monthsSinceStart < loan.params.term) {
          return sum + loan.summary.monthlyPayment;
        }
      }
      return sum;
    }, 0);

    const collectionRate = expectedPayments > 0 ? (totalCollected / expectedPayments) * 100 : 0;

    return {
      monthlyPayments,
      totalCollected,
      totalPayments,
      expectedPayments,
      collectionRate,
      activeLoans: loans.filter(l => l.status === 'active').length,
    };
  };

  const exportPDF = () => {
    const report = generateReport();
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 60, 100);
    doc.text('REPORTE MENSUAL', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(getMonthName(selectedMonth), 105, 30, { align: 'center' });
    
    doc.setDrawColor(40, 60, 100);
    doc.line(20, 35, 190, 35);
    
    // Summary
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    doc.text('Resumen Ejecutivo', 20, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Total Recaudado: Bs. ${formatCurrency(report.totalCollected)}`, 20, 65);
    doc.text(`Total Esperado: Bs. ${formatCurrency(report.expectedPayments)}`, 20, 75);
    doc.text(`Tasa de Cobranza: ${report.collectionRate.toFixed(1)}%`, 20, 85);
    doc.text(`Número de Pagos: ${report.totalPayments}`, 20, 95);
    doc.text(`Préstamos Activos: ${report.activeLoans}`, 20, 105);
    
    // Payment Details
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    doc.text('Detalle de Pagos', 20, 125);
    
    if (report.monthlyPayments.length > 0) {
      const tableColumn = ['Cliente', 'Préstamo', 'Cuota #', 'Monto', 'Fecha'];
      const tableRows = report.monthlyPayments.map(p => [
        p.clientName,
        p.loanName,
        `#${p.quotaNumber}`,
        `Bs. ${formatCurrency(p.amount)}`,
        new Date(p.paidDate).toLocaleDateString('es-BO'),
      ]);
      
      (doc as any).autoTable({
        startY: 135,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [40, 60, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 245, 255] },
        styles: { fontSize: 9, cellPadding: 3 },
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('No hay pagos registrados para este período', 20, 140);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generado el ${new Date().toLocaleString('es-BO')}`, 105, 285, { align: 'center' });
    
    doc.save(`reporte_${selectedMonth}.pdf`);
  };

  const report = generateReport();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Reportes Mensuales
        </h2>
        
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Recaudado</p>
              <p className="text-xl font-bold text-white">Bs. {formatCurrency(report.totalCollected)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Esperado</p>
              <p className="text-xl font-bold text-white">Bs. {formatCurrency(report.expectedPayments)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tasa de Cobranza</p>
              <p className="text-xl font-bold text-white">{report.collectionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Pagos del Mes</p>
              <p className="text-xl font-bold text-white">{report.totalPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="text-md font-semibold text-white">Detalle de Pagos - {getMonthName(selectedMonth)}</h3>
        </div>
        
        <div className="overflow-x-auto">
          {report.monthlyPayments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">No hay pagos registrados para este período</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-300 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-300 uppercase">Préstamo</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-blue-300 uppercase">Cuota #</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase">Monto</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-blue-300 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {report.monthlyPayments.map((payment, idx) => (
                  <tr key={idx} className="border-b border-slate-700/30 hover:bg-blue-500/5 transition-colors">
                    <td className="px-4 py-3 text-white">{payment.clientName}</td>
                    <td className="px-4 py-3 text-slate-300">{payment.loanName}</td>
                    <td className="px-4 py-3 text-center text-white">#{payment.quotaNumber}</td>
                    <td className="px-4 py-3 text-right text-green-400 font-semibold">Bs. {formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3 text-center text-slate-400">
                      {new Date(payment.paidDate).toLocaleDateString('es-BO')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900/70 border-t-2 border-blue-500/30">
                  <td colSpan={3} className="px-4 py-3 text-white font-bold">TOTAL</td>
                  <td className="px-4 py-3 text-right text-green-400 font-bold">
                    Bs. {formatCurrency(report.totalCollected)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
