import { useState } from 'react';
import { SavedLoan } from '../types';
import { AlertTriangle, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface Props {
  loans: SavedLoan[];
  moraRate: number;
}

export default function PenaltyCalculator({ loans, moraRate }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calcular penalidades para cada préstamo
  const penalties = loans.flatMap((loan: SavedLoan) => {
    if (loan.status !== 'active') return [];
    
    const paidQuotas = loan.payments.map((p: any) => p.quotaNumber);
    const today = new Date();
    const results: any[] = [];
    
    for (let i = 1; i <= loan.params.term; i++) {
      if (paidQuotas.includes(i)) continue;
      
      const paymentDate = new Date(loan.params.startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      
      const diffMs = today.getTime() - paymentDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        const dailyRate = (moraRate / 100) / 30;
        const penalty = loan.summary.monthlyPayment * dailyRate * diffDays;
        
        results.push({
          loanId: loan.id,
          loanName: loan.name,
          clientName: loan.clientName,
          quotaNumber: i,
          paymentDate: paymentDate.toISOString().split('T')[0],
          daysLate: diffDays,
          originalAmount: loan.summary.monthlyPayment,
          penaltyAmount: Math.round(penalty * 100) / 100,
          totalDue: Math.round((loan.summary.monthlyPayment + penalty) * 100) / 100,
        });
      }
    }
    
    return results;
  });

  const totalPenalties = penalties.reduce((sum: number, p: any) => sum + p.penaltyAmount, 0);
  const totalDue = penalties.reduce((sum: number, p: any) => sum + p.totalDue, 0);
  const affectedLoans = new Set(penalties.map((p: any) => p.loanId)).size;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Cálculo de Penalidades
        </h1>
        <p style={{ color: 'var(--text-tertiary)' }}>
          Intereses moratorios por pagos atrasados (Tasa: {moraRate}% mensual)
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card metric-card-primary">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-white" />
            <div>
              <p className="text-sm text-white/80">Cuotas Vencidas</p>
              <p className="text-2xl font-bold text-white">{penalties.length}</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <DollarSign className="w-6 h-6" style={{ color: 'var(--accent-danger)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Penalidades</p>
              <p className="text-xl font-bold" style={{ color: 'var(--accent-danger)' }}>
                Bs. {formatCurrency(totalPenalties)}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: 'var(--accent-warning)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total a Cobrar</p>
              <p className="text-xl font-bold" style={{ color: 'var(--accent-warning)' }}>
                Bs. {formatCurrency(totalDue)}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <Calendar className="w-6 h-6" style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Préstamos Afectados</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
                {affectedLoans}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Penalidades */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Detalle de Penalidades
        </h2>

        {penalties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <h3 className="empty-state-title">Sin penalidades</h3>
            <p className="empty-state-description">
              No hay cuotas vencidas con penalidades
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Préstamo</th>
                  <th>Cuota</th>
                  <th>Vencimiento</th>
                  <th>Días Atraso</th>
                  <th>Cuota Original</th>
                  <th>Penalidad</th>
                  <th>Total a Pagar</th>
                </tr>
              </thead>
              <tbody>
                {penalties.map((penalty: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ color: 'var(--text-primary)' }}>{penalty.clientName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{penalty.loanName}</td>
                    <td className="font-semibold" style={{ color: 'var(--text-primary)' }}>#{penalty.quotaNumber}</td>
                    <td style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(penalty.paymentDate).toLocaleDateString('es-BO')}
                    </td>
                    <td>
                      <span className="badge badge-danger">
                        {penalty.daysLate} días
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      Bs. {formatCurrency(penalty.originalAmount)}
                    </td>
                    <td style={{ color: 'var(--accent-danger)' }} className="font-semibold">
                      Bs. {formatCurrency(penalty.penaltyAmount)}
                    </td>
                    <td style={{ color: 'var(--accent-warning)' }} className="font-bold">
                      Bs. {formatCurrency(penalty.totalDue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <td colSpan={5} className="font-bold" style={{ color: 'var(--text-primary)' }}>TOTALES</td>
                  <td></td>
                  <td className="font-bold" style={{ color: 'var(--accent-danger)' }}>
                    Bs. {formatCurrency(totalPenalties)}
                  </td>
                  <td className="font-bold" style={{ color: 'var(--accent-warning)' }}>
                    Bs. {formatCurrency(totalDue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
