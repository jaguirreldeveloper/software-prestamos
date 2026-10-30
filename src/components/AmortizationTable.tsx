import { useState, useMemo } from 'react';
import { AmortizationRow, LoanSummary } from '../types';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  ChevronUp, 
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Eye,
  TrendingUp,
  Target,
  Calendar,
  Percent
} from 'lucide-react';

interface Props {
  rows: AmortizationRow[];
  summary: LoanSummary;
}

type ViewMode = 'compact' | 'standard' | 'detailed';

export default function AmortizationTable({ rows, summary }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter((row: AmortizationRow) => 
      row.number.toString().includes(searchTerm) ||
      formatDate(row.paymentDate).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);

  const totalPayments = rows.reduce((sum: number, row: AmortizationRow) => sum + row.payment, 0);
  const totalInterest = rows.reduce((sum: number, row: AmortizationRow) => sum + row.interest, 0);
  const totalCapital = rows.filter((r: AmortizationRow) => r.capital > 0).reduce((sum: number, row: AmortizationRow) => sum + row.capital, 0);

  if (!rows.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-title">No hay datos para mostrar</h3>
        <p className="empty-state-description">
          Calcula un préstamo primero para ver la tabla de amortización
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Tabla de Amortización
          </h1>
          <p style={{ color: 'var(--text-tertiary)' }}>
            Detalle completo de cada cuota del préstamo
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button className="btn btn-secondary">
            <FileText className="w-4 h-4" />
            Word
          </button>
          <button className="btn btn-primary">
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Pagado</p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Bs. {formatCurrency(totalPayments)}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <Target className="w-5 h-5" style={{ color: 'var(--accent-success)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Capital</p>
              <p className="text-lg font-bold" style={{ color: 'var(--accent-success)' }}>
                Bs. {formatCurrency(totalCapital)}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <Percent className="w-5 h-5" style={{ color: 'var(--accent-danger)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Intereses</p>
              <p className="text-lg font-bold" style={{ color: 'var(--accent-danger)' }}>
                Bs. {formatCurrency(totalInterest)}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <Calendar className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Cuotas</p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {rows.filter((r: AmortizationRow) => r.number > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('compact')}
              className={`btn ${viewMode === 'compact' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Compacta
            </button>
            <button 
              onClick={() => setViewMode('standard')}
              className={`btn ${viewMode === 'standard' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Estándar
            </button>
            <button 
              onClick={() => setViewMode('detailed')}
              className={`btn ${viewMode === 'detailed' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Detallada
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cuota..."
                className="input pl-10 w-64"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                {viewMode !== 'compact' && <th>Saldo Inicial</th>}
                <th>Cuota</th>
                <th>Interés</th>
                <th>Capital</th>
                {viewMode !== 'compact' && <th>Saldo Final</th>}
                <th>Fecha</th>
                {viewMode === 'detailed' && <th>Progreso</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row: AmortizationRow, idx: number) => {
                const progressPercent = row.initialBalance > 0 
                  ? ((row.initialBalance - Math.max(0, row.finalBalance)) / row.initialBalance) * 100 
                  : 0;

                return (
                  <tr key={idx}>
                    <td>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {row.number}
                      </span>
                    </td>
                    {viewMode !== 'compact' && (
                      <td style={{ color: 'var(--text-secondary)' }}>
                        Bs. {formatCurrency(row.initialBalance)}
                      </td>
                    )}
                    <td className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Bs. {formatCurrency(row.payment)}
                    </td>
                    <td style={{ color: 'var(--accent-danger)' }}>
                      Bs. {formatCurrency(row.interest)}
                    </td>
                    <td style={{ color: 'var(--accent-success)' }}>
                      Bs. {formatCurrency(row.capital)}
                    </td>
                    {viewMode !== 'compact' && (
                      <td className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Bs. {formatCurrency(Math.max(0, row.finalBalance))}
                      </td>
                    )}
                    <td style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(row.paymentDate)}
                    </td>
                    {viewMode === 'detailed' && (
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${progressPercent}%`,
                                background: 'var(--gradient-primary)'
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            {progressPercent.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <td className="font-bold" style={{ color: 'var(--text-primary)' }}>TOTAL</td>
                {viewMode !== 'compact' && <td></td>}
                <td className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  Bs. {formatCurrency(totalPayments)}
                </td>
                <td className="font-bold" style={{ color: 'var(--accent-danger)' }}>
                  Bs. {formatCurrency(totalInterest)}
                </td>
                <td className="font-bold" style={{ color: 'var(--accent-success)' }}>
                  Bs. {formatCurrency(totalCapital)}
                </td>
                {viewMode !== 'compact' && <td></td>}
                <td></td>
                {viewMode === 'detailed' && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
