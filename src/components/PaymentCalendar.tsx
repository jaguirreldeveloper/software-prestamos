import { useState } from 'react';
import { AmortizationRow } from '../types';
import { Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Props {
  rows: AmortizationRow[];
}

export default function PaymentCalendar({ rows }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getPaymentStatus = (row: AmortizationRow): string => {
    if (row.isPaid) return 'paid';
    const today = new Date();
    const paymentDate = new Date(row.paymentDate);
    if (paymentDate < today) return 'overdue';
    const diffDays = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return 'upcoming';
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Pagado</span>;
      case 'overdue':
        return <span className="badge badge-danger"><AlertCircle className="w-3 h-3" /> Vencido</span>;
      case 'upcoming':
        return <span className="badge badge-warning"><Clock className="w-3 h-3" /> Próximo</span>;
      default:
        return <span className="badge badge-info">Pendiente</span>;
    }
  };

  const payments = rows.filter((row: AmortizationRow) => row.number > 0);

  if (payments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📅</div>
        <h3 className="empty-state-title">No hay pagos programados</h3>
        <p className="empty-state-description">
          Calcula un préstamo para ver el calendario de pagos
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
            Calendario de Pagos
          </h1>
          <p style={{ color: 'var(--text-tertiary)' }}>
            Visualiza y gestiona todos los pagos de tus préstamos
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card metric-card-success">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-white" />
            <div>
              <p className="text-sm text-white/80">Pagados</p>
              <p className="text-2xl font-bold text-white">
                {payments.filter((p: AmortizationRow) => p.isPaid).length}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card metric-card-primary">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-white" />
            <div>
              <p className="text-sm text-white/80">Pendientes</p>
              <p className="text-2xl font-bold text-white">
                {payments.filter((p: AmortizationRow) => !p.isPaid).length}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertCircle className="w-6 h-6" style={{ color: 'var(--accent-danger)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Vencidos</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-danger)' }}>
                {payments.filter((p: AmortizationRow) => getPaymentStatus(p) === 'overdue').length}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Calendar className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Total</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {payments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline de Pagos */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Próximos Pagos
        </h2>
        <div className="space-y-3">
          {payments.slice(0, 10).map((payment: AmortizationRow) => {
            const status = getPaymentStatus(payment);
            return (
              <div
                key={payment.number}
                className="p-4 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                style={{ border: '1px solid var(--border-primary)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                      <span className="text-white font-bold">{payment.number}</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Cuota #{payment.number}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(payment.paymentDate).toLocaleDateString('es-BO', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      Bs. {formatCurrency(payment.payment)}
                    </p>
                    {getStatusBadge(status)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
