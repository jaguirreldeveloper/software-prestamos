import { useState } from 'react';
import { AmortizationRow, PaymentRecord } from '../types';
import { CheckCircle, AlertTriangle, Receipt } from 'lucide-react';

interface Props {
  data: AmortizationRow[];
  payments: PaymentRecord[];
  onRegisterPayment: (payment: PaymentRecord) => void;
  monthlyPayment: number;
}

export default function PaymentRegister({ data, payments, onRegisterPayment, monthlyPayment }: Props) {
  const [selectedQuota, setSelectedQuota] = useState<number>(1);
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);
  const [extraAmount, setExtraAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastPayment, setLastPayment] = useState<PaymentRecord | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const pendingPayments = data.filter(row => row.number > 0 && !row.isPaid);
  const paidPayments = data.filter(row => row.isPaid);
  const totalPaid = paidPayments.reduce((sum, row) => sum + (row.paidAmount || row.payment), 0);
  const totalPending = pendingPayments.reduce((sum, row) => sum + row.payment, 0);
  const progress = data.length > 1 ? ((paidPayments.length / (data.length - 1)) * 100) : 0;

  const handleSubmit = () => {
    const payment: PaymentRecord = {
      loanId: '',
      quotaNumber: selectedQuota,
      paidDate,
      amount: monthlyPayment,
      extraAmount,
      notes,
    };
    onRegisterPayment(payment);
    setLastPayment(payment);
    setShowReceipt(true);
    setExtraAmount(0);
    setNotes('');
    
    // Auto-select next pending quota
    const nextPending = pendingPayments.find(p => p.number > selectedQuota);
    if (nextPending) setSelectedQuota(nextPending.number);
  };

  if (!data.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">💳</div>
        <h3 className="text-xl text-slate-400">No hay cuotas para registrar</h3>
        <p className="text-slate-500 mt-2">Calcula un préstamo primero</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">💳 Registro de Pagos</h2>

      {/* Progress Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-300">Progreso del Préstamo</h3>
          <span className="text-sm font-bold text-blue-400">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-xs text-slate-400">Cuotas Pagadas</p>
            <p className="text-lg font-bold text-green-400">{paidPayments.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Cuotas Pendientes</p>
            <p className="text-lg font-bold text-yellow-400">{pendingPayments.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Total Pagado</p>
            <p className="text-lg font-bold text-white">Bs. {formatCurrency(totalPaid)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-400" />
            Registrar Nuevo Pago
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Cuota a pagar</label>
              <select
                value={selectedQuota}
                onChange={(e) => setSelectedQuota(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                {pendingPayments.map(row => (
                  <option key={row.number} value={row.number}>
                    Cuota #{row.number} - Bs. {formatCurrency(row.payment)} (Vence: {row.paymentDate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Fecha de pago</label>
              <input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Monto de cuota</label>
              <div className="px-4 py-3 bg-slate-900/30 border border-slate-700/50 rounded-xl text-white font-semibold">
                Bs. {formatCurrency(monthlyPayment)}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                💰 Pago extra (abono a capital)
              </label>
              <input
                type="number"
                value={extraAmount || ''}
                onChange={(e) => setExtraAmount(Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-green-500"
                min={0}
                step={10}
              />
              {extraAmount > 0 && (
                <p className="text-xs text-green-400 mt-1">
                  ✨ Este monto se aplicará directamente al capital, reduciendo intereses futuros
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Notas (opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones del pago..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 resize-none"
                rows={2}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={pendingPayments.length === 0}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {pendingPayments.length === 0 ? '✓ Todas las cuotas pagadas' : '✓ Registrar Pago'}
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Historial de Pagos ({payments.length})
          </h3>

          {payments.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No hay pagos registrados aún</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {payments.map((payment, idx) => (
                <div key={idx} className="bg-slate-900/30 rounded-xl p-3 border border-slate-700/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-white">Cuota #{payment.quotaNumber}</p>
                      <p className="text-xs text-slate-400">Pagado: {payment.paidDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">Bs. {formatCurrency(payment.amount)}</p>
                      {payment.extraAmount > 0 && (
                        <p className="text-xs text-cyan-400">+ Bs. {formatCurrency(payment.extraAmount)} extra</p>
                      )}
                    </div>
                  </div>
                  {payment.notes && (
                    <p className="text-xs text-slate-500 mt-1 italic">"{payment.notes}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastPayment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-gray-800">
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
              <h3 className="text-xl font-bold">COMPROBANTE DE PAGO</h3>
              <p className="text-sm text-gray-500">Sistema de Préstamos</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Cuota N°:</span>
                <span className="font-semibold">{lastPayment.quotaNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha de Pago:</span>
                <span className="font-semibold">{lastPayment.paidDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Monto Cuota:</span>
                <span className="font-semibold">Bs. {formatCurrency(lastPayment.amount)}</span>
              </div>
              {lastPayment.extraAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Abono Extra:</span>
                  <span className="font-semibold text-green-600">Bs. {formatCurrency(lastPayment.extraAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-700 font-bold">Total Recibido:</span>
                <span className="font-bold text-lg">Bs. {formatCurrency(lastPayment.amount + lastPayment.extraAmount)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                🖨️ Imprimir
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
