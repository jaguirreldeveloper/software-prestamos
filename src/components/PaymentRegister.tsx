import { useState } from 'react';
import { AmortizationRow, PaymentRecord } from '../types';
import { CreditCard, CheckCircle, Calendar } from 'lucide-react';

interface Props {
  rows: AmortizationRow[];
  payments: PaymentRecord[];
  onRegisterPayment: (payment: PaymentRecord) => void;
  monthlyPayment: number;
}

export default function PaymentRegister({ rows, payments, onRegisterPayment, monthlyPayment }: Props) {
  const [selectedQuota, setSelectedQuota] = useState<number>(1);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState(monthlyPayment);
  const [notes, setNotes] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const pendingPayments = rows.filter((r: AmortizationRow) => r.number > 0 && !r.isPaid);

  const handleRegister = () => {
    const payment: PaymentRecord = {
      loanId: '',
      quotaNumber: selectedQuota,
      paidDate: paymentDate,
      amount: amount,
      extraAmount: 0,
      notes: notes,
    };
    onRegisterPayment(payment);
    setNotes('');
    alert('Pago registrado exitosamente');
  };

  if (pendingPayments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">✅</div>
        <h3 className="empty-state-title">Todos los pagos están al día</h3>
        <p className="empty-state-description">
          No hay pagos pendientes por registrar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Registrar Pago
        </h1>
        <p style={{ color: 'var(--text-tertiary)' }}>
          Registra los pagos recibidos de tus préstamos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Detalles del Pago
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label">Cuota a Pagar</label>
              <select
                value={selectedQuota}
                onChange={(e) => setSelectedQuota(Number(e.target.value))}
                className="input"
              >
                {pendingPayments.map((payment: AmortizationRow) => (
                  <option key={payment.number} value={payment.number}>
                    Cuota #{payment.number} - Bs. {formatCurrency(payment.payment)} - {new Date(payment.paymentDate).toLocaleDateString('es-BO')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Fecha de Pago</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">Monto</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="input"
                step="0.01"
              />
            </div>

            <div>
              <label className="label">Notas (opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input"
                rows={3}
                placeholder="Agregar notas sobre este pago..."
              />
            </div>

            <button onClick={handleRegister} className="btn btn-primary w-full">
              <CreditCard className="w-4 h-4" />
              Registrar Pago
            </button>
          </div>
        </div>

        {/* Historial Reciente */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Pagos Recientes
          </h2>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: 'var(--text-tertiary)' }}>No hay pagos registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.slice(-5).reverse().map((payment, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Cuota #{payment.quotaNumber}
                    </span>
                    <CheckCircle className="w-4 h-4" style={{ color: 'var(--accent-success)' }} />
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Bs. {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(payment.paidDate).toLocaleDateString('es-BO')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
