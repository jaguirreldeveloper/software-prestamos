import { useState, useMemo } from 'react';
import { AmortizationRow, LoanSummary } from '../types';
import { 
  Printer, Search, ChevronUp, ChevronDown, 
  ChevronRight, ChevronLeft, TrendingUp, 
  Target, Calendar, Percent, FileSpreadsheet,
  Copy, CheckCircle2, FileText, Info
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type Props = {
  rows: AmortizationRow[];
  summary: LoanSummary;
};

type SortField = 'number' | 'initialBalance' | 'payment' | 'interest' | 'capital' | 'finalBalance' | 'paymentDate';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'compact' | 'standard' | 'detailed';
type GroupMode = 'monthly' | 'quarterly' | 'yearly';

export default function AmortizationTable({ rows, summary }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('number');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [copiedRow, setCopiedRow] = useState<number | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode>('monthly');
  const [tooltipRow, setTooltipRow] = useState<number | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
  };

  const metrics = useMemo(() => {
    const validRows = rows.filter((r: AmortizationRow) => r.number > 0);
    const breakevenRow = validRows.find((r: AmortizationRow) => r.capital > r.interest);
    const highestInterestRow = validRows.reduce((max: AmortizationRow, r: AmortizationRow) => r.interest > max.interest ? r : max, validRows[0]);
    const avgInterest = validRows.reduce((sum: number, r: AmortizationRow) => sum + r.interest, 0) / validRows.length;
    const today = new Date();
    const nextPayment = validRows.find((r: AmortizationRow) => {
      const paymentDate = new Date(r.paymentDate + 'T12:00:00');
      return paymentDate >= today && !r.isPaid;
    });
    return { breakevenRow, highestInterestRow, avgInterest, nextPayment };
  }, [rows]);

  const filteredRows = useMemo(() => {
    let result = rows.filter((row: AmortizationRow) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return row.number.toString().includes(searchLower) || formatDate(row.paymentDate).toLowerCase().includes(searchLower);
    });
    result.sort((a: AmortizationRow, b: AmortizationRow) => {
      const aVal: any = sortField === 'paymentDate' ? new Date(a[sortField]).getTime() : a[sortField];
      const bVal: any = sortField === 'paymentDate' ? new Date(b[sortField]).getTime() : b[sortField];
      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return result;
  }, [rows, searchTerm, sortField, sortDirection]);

  // Agrupación temporal
  const groupedRows = useMemo(() => {
    if (groupMode === 'monthly') return filteredRows;
    
    const groups: any[] = [];
    let currentGroup: any = null;
    
    filteredRows.forEach((row: AmortizationRow) => {
      if (row.number === 0) return;
      
      const date = new Date(row.paymentDate + 'T12:00:00');
      let groupKey = '';
      
      if (groupMode === 'quarterly') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        groupKey = `Q${quarter} ${date.getFullYear()}`;
      } else if (groupMode === 'yearly') {
        groupKey = `${date.getFullYear()}`;
      }
      
      if (!currentGroup || currentGroup.key !== groupKey) {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = {
          key: groupKey,
          rows: [],
          totalPayment: 0,
          totalInterest: 0,
          totalCapital: 0,
          startBalance: row.initialBalance,
          endBalance: row.finalBalance,
          firstDate: row.paymentDate,
          lastDate: row.paymentDate,
        };
      }
      
      currentGroup.rows.push(row);
      currentGroup.totalPayment += row.payment;
      currentGroup.totalInterest += row.interest;
      currentGroup.totalCapital += row.capital;
      currentGroup.lastDate = row.paymentDate;
    });
    
    if (currentGroup) groups.push(currentGroup);
    return groups;
  }, [filteredRows, groupMode]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportExcel = () => {
    const headers = ['No.', 'Saldo Inicial', 'Cuota Fija', 'Interes', 'Capital', 'Saldo Final', 'Fecha de Pago', '% Interes', '% Capital'];
    const csvRows = rows.filter((r: AmortizationRow) => r.number > 0).map((row: AmortizationRow) => [
      row.number,
      formatCurrency(row.initialBalance),
      formatCurrency(row.payment),
      formatCurrency(row.interest),
      formatCurrency(row.capital),
      formatCurrency(row.finalBalance),
      formatDate(row.paymentDate),
      ((row.interest / row.payment) * 100).toFixed(1) + '%',
      ((row.capital / row.payment) * 100).toFixed(1) + '%',
    ]);
    const csv = [headers.join(','), ...csvRows.map((r: any) => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tabla_amortizacion_excel.csv';
    link.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Encabezado
    doc.setFontSize(18);
    doc.setTextColor(40, 60, 100);
    doc.text('Tabla de Amortización', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Sistema de Gestión de Préstamos', 14, 28);
    doc.text('Fecha: ' + new Date().toLocaleDateString('es-BO'), 14, 33);
    
    // Resumen
    doc.setFontSize(11);
    doc.setTextColor(40, 60, 100);
    doc.text('Resumen del Préstamo', 14, 42);
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text('Cuota Mensual: Bs. ' + formatCurrency(summary.monthlyPayment), 14, 48);
    doc.text('Total a Pagar: Bs. ' + formatCurrency(summary.totalPayment), 14, 53);
    doc.text('Total Intereses: Bs. ' + formatCurrency(summary.totalInterest), 14, 58);
    
    // Tabla
    const tableColumn = ['No.', 'Saldo Inicial', 'Cuota', 'Interés', 'Capital', 'Saldo Final', 'Fecha'];
    const tableRows: any[] = [];
    
    rows.filter((r: AmortizationRow) => r.number > 0).forEach((row: AmortizationRow) => {
      tableRows.push([
        row.number.toString(),
        formatCurrency(row.initialBalance),
        formatCurrency(row.payment),
        formatCurrency(row.interest),
        formatCurrency(row.capital),
        formatCurrency(Math.max(0, row.finalBalance)),
        formatDate(row.paymentDate),
      ]);
    });
    
    (doc as any).autoTable({
      startY: 65,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [40, 60, 100], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      styles: { fontSize: 8, cellPadding: 2 },
    });
    
    doc.save('tabla_amortizacion.pdf');
  };

  const handleCopyRow = (row: AmortizationRow) => {
    const text = 'Cuota #' + row.number + ' | Fecha: ' + formatDate(row.paymentDate) + ' | Cuota: Bs. ' + formatCurrency(row.payment) + ' | Interes: Bs. ' + formatCurrency(row.interest) + ' | Capital: Bs. ' + formatCurrency(row.capital);
    navigator.clipboard.writeText(text);
    setCopiedRow(row.number);
    setTimeout(() => setCopiedRow(null), 2000);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 text-slate-600" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-blue-400" /> : <ChevronDown className="w-3 h-3 text-blue-400" />;
  };

  // Sparkline SVG
  const SparklineChart = ({ data, color }: { data: number[], color: string }) => {
    if (data.length === 0) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 20;
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="inline-block">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  };

  if (!rows.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl text-slate-400">No hay datos para mostrar</h3>
        <p className="text-slate-500 mt-2">Calcula un prestamo primero</p>
      </div>
    );
  }

  const totalPayments = rows.reduce((sum: number, row: AmortizationRow) => sum + row.payment, 0);
  const totalInterest = rows.reduce((sum: number, row: AmortizationRow) => sum + row.interest, 0);
  const totalCapital = rows.filter((r: AmortizationRow) => r.capital > 0).reduce((sum: number, row: AmortizationRow) => sum + row.capital, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold text-white">📋 Tabla de Amortizacion</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/30">
            {(['compact', 'standard', 'detailed'] as ViewMode[]).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} className={'px-3 py-1 rounded-md text-xs font-medium transition-all ' + (viewMode === mode ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white')}>
                {mode === 'compact' ? '📝 Compacta' : mode === 'standard' ? '📊 Estandar' : '📈 Detallada'}
              </button>
            ))}
          </div>
          {viewMode === 'detailed' && (
            <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/30">
              {(['monthly', 'quarterly', 'yearly'] as GroupMode[]).map(mode => (
                <button key={mode} onClick={() => setGroupMode(mode)} className={'px-3 py-1 rounded-md text-xs font-medium transition-all ' + (groupMode === mode ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-white')}>
                  {mode === 'monthly' ? 'Mensual' : mode === 'quarterly' ? 'Trimestral' : 'Anual'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Buscar por cuota # o fecha..." className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
          <option value={12}>12 por pagina</option>
          <option value={24}>24 por pagina</option>
          <option value={48}>48 por pagina</option>
          <option value={filteredRows.length}>Todas</option>
        </select>
      </div>

      {/* Metrics */}
      {viewMode === 'detailed' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.breakevenRow && (
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center gap-2 mb-1"><Target className="w-4 h-4 text-blue-400" /><p className="text-xs text-slate-400">Punto de Equilibrio</p></div>
              <p className="text-lg font-bold text-white">Cuota #{metrics.breakevenRow.number}</p>
              <p className="text-xs text-slate-400 mt-1">Capital supera al interes</p>
            </div>
          )}
          <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-xl border border-red-500/20 p-4">
            <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-red-400" /><p className="text-xs text-slate-400">Mayor Interes</p></div>
            <p className="text-lg font-bold text-white">Cuota #{metrics.highestInterestRow?.number}</p>
            <p className="text-xs text-red-400 mt-1">Bs. {formatCurrency(metrics.highestInterestRow?.interest || 0)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 p-4">
            <div className="flex items-center gap-2 mb-1"><Percent className="w-4 h-4 text-purple-400" /><p className="text-xs text-slate-400">Promedio Interes</p></div>
            <p className="text-lg font-bold text-white">Bs. {formatCurrency(metrics.avgInterest)}</p>
            <p className="text-xs text-slate-400 mt-1">Por cuota</p>
          </div>
          {metrics.nextPayment && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 p-4">
              <div className="flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-yellow-400" /><p className="text-xs text-slate-400">Proximo Pago</p></div>
              <p className="text-lg font-bold text-white">Cuota #{metrics.nextPayment.number}</p>
              <p className="text-xs text-yellow-400 mt-1">{formatDate(metrics.nextPayment.paymentDate)}</p>
            </div>
          )}
        </div>
      )}

      {/* Vista Agrupada */}
      {viewMode === 'detailed' && groupMode !== 'monthly' && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                <tr className="border-b border-purple-500/20">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-300 uppercase">Periodo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-purple-300 uppercase">Cuotas</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-purple-300 uppercase">Total Pagado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-purple-300 uppercase">Total Interes</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-purple-300 uppercase">Total Capital</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-purple-300 uppercase">Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {groupedRows.map((group: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-700/30 hover:bg-purple-500/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{group.key}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{group.rows.length}</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">Bs. {formatCurrency(group.totalPayment)}</td>
                    <td className="px-4 py-3 text-right text-red-400">Bs. {formatCurrency(group.totalInterest)}</td>
                    <td className="px-4 py-3 text-right text-green-400">Bs. {formatCurrency(group.totalCapital)}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">Bs. {formatCurrency(Math.max(0, group.endBalance))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabla Principal */}
      {groupMode === 'monthly' && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                <tr className="border-b border-blue-500/20">
                  <th onClick={() => handleSort('number')} className="px-4 py-3 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/10 transition-colors">
                    <div className="flex items-center gap-1">No. <SortIcon field="number" /></div>
                  </th>
                  {viewMode !== 'compact' && (
                    <th onClick={() => handleSort('initialBalance')} className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/10 transition-colors">
                      <div className="flex items-center justify-end gap-1">Saldo Inicial <SortIcon field="initialBalance" /></div>
                    </th>
                  )}
                  <th onClick={() => handleSort('payment')} className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/10 transition-colors">
                    <div className="flex items-center justify-end gap-1">Cuota <SortIcon field="payment" /></div>
                  </th>
                  <th onClick={() => handleSort('interest')} className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/10 transition-colors relative">
                    <div className="flex items-center justify-end gap-1">Interes <SortIcon field="interest" /></div>
                  </th>
                  <th onClick={() => handleSort('capital')} className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/10 transition-colors">
                    <div className="flex items-center justify-end gap-1">Capital <SortIcon field="capital" /></div>
                  </th>
                  {viewMode !== 'compact' && (
                    <th onClick={() => handleSort('finalBalance')} className="px-4 py-3 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/10 transition-colors">
                      <div className="flex items-center justify-end gap-1">Saldo Final <SortIcon field="finalBalance" /></div>
                    </th>
                  )}
                  <th onClick={() => handleSort('paymentDate')} className="px-4 py-3 text-center text-xs font-semibold text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/10 transition-colors">
                    <div className="flex items-center justify-center gap-1">Fecha <SortIcon field="paymentDate" /></div>
                  </th>
                  {viewMode === 'detailed' && (
                    <>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-blue-300 uppercase tracking-wider">Tendencia</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-blue-300 uppercase tracking-wider">Progreso</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row: AmortizationRow, idx: number) => {
                  const isExpanded = expandedRow === row.number;
                  const isBreakeven = metrics.breakevenRow?.number === row.number;
                  const isHighestInterest = metrics.highestInterestRow?.number === row.number;
                  const isNextPayment = metrics.nextPayment?.number === row.number;
                  const interestPercent = row.payment > 0 ? (row.interest / row.payment) * 100 : 0;
                  const capitalPercent = row.payment > 0 ? (row.capital / row.payment) * 100 : 0;
                  const progressPercent = row.initialBalance > 0 ? ((row.initialBalance - Math.max(0, row.finalBalance)) / row.initialBalance) * 100 : 0;
                  
                  // Datos para sparkline
                  const prevRows = rows.filter((r: AmortizationRow) => r.number > 0 && r.number <= row.number).slice(-6);
                  const interestData = prevRows.map((r: AmortizationRow) => r.interest);
                  const capitalData = prevRows.map((r: AmortizationRow) => r.capital);

                  return (
                    <tr key={idx}>
                      <td colSpan={viewMode === 'compact' ? 5 : viewMode === 'detailed' ? 9 : 7} className="p-0">
                        <table className="w-full">
                          <tbody>
                            <tr
                              onClick={() => viewMode === 'detailed' && row.number > 0 && setExpandedRow(isExpanded ? null : row.number)}
                              onMouseEnter={() => setTooltipRow(row.number)}
                              onMouseLeave={() => setTooltipRow(null)}
                              className={'border-b border-slate-700/30 transition-colors relative ' + (row.number === 0 ? 'bg-slate-900/30' : '') + (row.finalBalance === 0 ? ' bg-green-500/5' : '') + (isBreakeven ? ' bg-blue-500/10' : '') + (isHighestInterest ? ' bg-red-500/5' : '') + (isNextPayment ? ' bg-yellow-500/10' : '') + (viewMode === 'detailed' && row.number > 0 ? ' cursor-pointer hover:bg-blue-500/5' : ' hover:bg-blue-500/5')}
                            >
                              <td className="px-4 py-3 text-white font-medium">
                                <div className="flex items-center gap-2">
                                  {row.number}
                                  {isBreakeven && <span className="text-blue-400" title="Punto de equilibrio">🎯</span>}
                                  {isHighestInterest && <span className="text-red-400" title="Mayor interes">🔺</span>}
                                  {isNextPayment && <span className="text-yellow-400" title="Proximo pago">📅</span>}
                                </div>
                              </td>
                              {viewMode !== 'compact' && <td className="px-4 py-3 text-right text-slate-300">Bs. {formatCurrency(row.initialBalance)}</td>}
                              <td className="px-4 py-3 text-right text-white font-semibold">{row.payment > 0 ? 'Bs. ' + formatCurrency(row.payment) : '-'}</td>
                              <td className="px-4 py-3 text-right text-red-400">Bs. {formatCurrency(row.interest)}</td>
                              <td className={'px-4 py-3 text-right ' + (row.capital < 0 ? 'text-red-400' : 'text-green-400')}>Bs. {formatCurrency(row.capital)}</td>
                              {viewMode !== 'compact' && <td className="px-4 py-3 text-right text-white font-medium">Bs. {formatCurrency(Math.max(0, row.finalBalance))}</td>}
                              <td className="px-4 py-3 text-center text-slate-400">{formatDate(row.paymentDate)}</td>
                              {viewMode === 'detailed' && (
                                <>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <SparklineChart data={interestData} color="#ef4444" />
                                      <SparklineChart data={capitalData} color="#10b981" />
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-500 to-cyan-400 rounded-full transition-all" style={{ width: progressPercent + '%' }}></div>
                                      </div>
                                      <span className="text-xs text-slate-400 w-10">{progressPercent.toFixed(0)}%</span>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                            {isExpanded && viewMode === 'detailed' && row.number > 0 && (
                              <tr className="bg-slate-900/50">
                                <td colSpan={8} className="px-4 py-4">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                      <p className="text-xs text-slate-400 mb-1">% Interes</p>
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: interestPercent + '%' }}></div></div>
                                        <span className="text-xs text-red-400 font-semibold">{interestPercent.toFixed(1)}%</span>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400 mb-1">% Capital</p>
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: capitalPercent + '%' }}></div></div>
                                        <span className="text-xs text-green-400 font-semibold">{capitalPercent.toFixed(1)}%</span>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400 mb-1">Composicion</p>
                                      <div className="flex gap-0 h-3 rounded-full overflow-hidden">
                                        <div className="bg-red-500" style={{ width: interestPercent + '%' }}></div>
                                        <div className="bg-green-500" style={{ width: capitalPercent + '%' }}></div>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400 mb-1">Acciones</p>
                                      <button onClick={(e) => { e.stopPropagation(); handleCopyRow(row); }} className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 hover:bg-slate-700 rounded text-xs text-slate-300 transition-all">
                                        {copiedRow === row.number ? <><CheckCircle2 className="w-3 h-3 text-green-400" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        
                        {/* Tooltip */}
                        {tooltipRow === row.number && viewMode === 'detailed' && row.number > 0 && (
                          <div className="absolute left-0 right-0 top-full z-20 bg-slate-900 border border-blue-500/30 rounded-lg p-3 shadow-xl pointer-events-none">
                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div>
                                <p className="text-slate-400">Calculo Interes</p>
                                <p className="text-white font-mono">Bs. {formatCurrency(row.initialBalance)} × {(row.interest / row.initialBalance * 100).toFixed(2)}%</p>
                              </div>
                              <div>
                                <p className="text-slate-400">Calculo Capital</p>
                                <p className="text-white font-mono">Bs. {formatCurrency(row.payment)} - Bs. {formatCurrency(row.interest)}</p>
                              </div>
                              <div>
                                <p className="text-slate-400">Saldo Restante</p>
                                <p className="text-white font-mono">{((row.finalBalance / rows[0].initialBalance) * 100).toFixed(1)}% del original</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900/70 border-t-2 border-blue-500/30">
                  <td className="px-4 py-3 text-white font-bold">TOTAL</td>
                  {viewMode !== 'compact' && <td className="px-4 py-3"></td>}
                  <td className="px-4 py-3 text-right text-white font-bold">Bs. {formatCurrency(totalPayments)}</td>
                  <td className="px-4 py-3 text-right text-red-400 font-bold">Bs. {formatCurrency(totalInterest)}</td>
                  <td className="px-4 py-3 text-right text-green-400 font-bold">Bs. {formatCurrency(totalCapital)}</td>
                  {viewMode !== 'compact' && <td className="px-4 py-3"></td>}
                  <td className="px-4 py-3"></td>
                  {viewMode === 'detailed' && <><td className="px-4 py-3"></td><td className="px-4 py-3"></td></>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredRows.length)} de {filteredRows.length} cuotas</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Primera</button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><ChevronLeft className="w-3 h-3" /></button>
            <span className="px-3 py-1 text-sm text-white">Pagina {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><ChevronRight className="w-3 h-3" /></button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Ultima</button>
          </div>
        </div>
      )}

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

      {/* Export Actions */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 transition-all">
          <FileText className="w-4 h-4" /> Exportar PDF
        </button>
        <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-green-500/20 hover:border-green-500/50 transition-all">
          <FileSpreadsheet className="w-4 h-4" /> Exportar Excel
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all">
          <Printer className="w-4 h-4" /> Imprimir
        </button>
      </div>
    </div>
  );
}
