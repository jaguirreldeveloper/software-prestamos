import { useState } from 'react';
import { SavedLoan, LoanParams } from '../types';
import { RefreshCw, TrendingDown, Calendar, DollarSign, CheckCircle } from 'lucide-react';

interface Props {
  loan: SavedLoan;
  onRenegotiate: (loanId: string, newParams: LoanParams) => void;
}

export default function LoanRenegotiation({ loan, onRenegotiate }: Props) {
  const [newTerm, setNewTerm] = useState(loan.params.term);
  const [newRate, setNewRate] = useState(loan.params.monthlyRate);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate current remaining balance
  const paidQuotas = loan.payments.length;
  const remainingQuotas = loan.params.term - paidQuotas;
  
  // Calculate remaining balance (simplified)
  const totalPaid = loan.payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = loan.summary.totalPayment - totalPaid;

  // Calculate new monthly payment with new parameters
  const calculateNewPayment = (principal: number, rate: number, term: number) => {
    const r = rate / 100;
    if (r === 0) return principal / term;
    return principal * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
  };

  const currentPayment = loan.summary.monthlyPayment;
  const newPayment = calculateNewPayment(remainingBalance, newRate, newTerm);
  
  const paymentDifference = newPayment - currentPayment;
  const totalInterestCurrent = remainingBalance - (remainingBalance - (loan.summary.totalInterest * (remainingQuotas / loan.params.term)));
  const totalInterestNew = (newPayment * newTerm) - remainingBalance;
  const interestSavings = totalInterestCurrent - totalInterestNew;

  const handleRenegotiate = () => {
    const newParams: LoanParams = {
      amount: remainingBalance,
      monthlyRate: newRate,
      term: newTerm,
      startDate: new Date().toISOString().split('T')[0],
    };
    
    onRenegotiate(loan.id, newParams);
    setShowConfirmation(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
      <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
        <RefreshCw className="w-5 h-5 text-blue-400" />
        Renegociación de Préstamo
      </h3>

      {/* Current Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-900/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Cuotas Pagadas</p>
          <p className="text-lg font-bold text-white">{paidQuotas} / {loan.params.term}</p>
        </div>
        <div className="bg-slate-900/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Saldo Restante</p>
          <p className="text-lg font-bold text-white">Bs. {formatCurrency(remainingBalance)}</p>
        </div>
        <div className="bg-slate-900/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Cuota Actual</p>
          <p className="text-lg font-bold text-blue-400">Bs. {formatCurrency(currentPayment)}</p>
        </div>
        <div className="bg-slate-900/30 rounded-lg p-3">
          <p className="text-xs text-slate-400">Tasa Actual</p>
          <p className="text-lg font-bold text-yellow-400">{loan.params.monthlyRate}%</p>
        </div>
      </div>

      {/* Renegotiation Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm text-slate-300 mb-2 block">
            <Calendar className="w-4 h-4 inline mr-1" />
            Nuevo Plazo (meses)
          </label>
          <input
            type="number"
            value={newTerm}
            onChange={(e) => setNewTerm(Number(e.target.value))}
            min={1}
            max={360}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
          <input
            type="range"
            value={newTerm}
            onChange={(e) => setNewTerm(Number(e.target.value))}
            min={1}
            max={60}
            className="w-full mt-2 accent-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-2 block">
            <TrendingDown className="w-4 h-4 inline mr-1" />
            Nueva Tasa Mensual (%)
          </label>
          <input
            type="number"
            value={newRate}
            onChange={(e) => setNewRate(Number(e.target.value))}
            min={0.1}
            max={50}
            step={0.5}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
          <input
            type="range"
            value={newRate}
            onChange={(e) => setNewRate(Number(e.target.value))}
            min={0.5}
            max={30}
            step={0.5}
            className="w-full mt-2 accent-yellow-500"
          />
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-slate-900/30 rounded-xl p-4 mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Comparación</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">Cuota Actual</p>
            <p className="text-lg font-bold text-white">Bs. {formatCurrency(currentPayment)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Nueva Cuota</p>
            <p className={`text-lg font-bold ${paymentDifference < 0 ? 'text-green-400' : 'text-red-400'}`}>
              Bs. {formatCurrency(newPayment)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Diferencia Mensual</p>
            <p className={`text-sm font-semibold ${paymentDifference < 0 ? 'text-green-400' : 'text-red-400'}`}>
              {paymentDifference < 0 ? '-' : '+'}Bs. {formatCurrency(Math.abs(paymentDifference))}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Ahorro en Intereses</p>
            <p className={`text-sm font-semibold ${interestSavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
              Bs. {formatCurrency(Math.abs(interestSavings))}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => setShowConfirmation(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Renegociar Préstamo
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-blue-500/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Confirmar Renegociación
            </h3>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm text-slate-300">
                Estás a punto de renegociar el préstamo <strong>{loan.name}</strong> con los siguientes cambios:
              </p>
              <div className="bg-slate-900/30 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Nuevo plazo:</span>
                  <span className="text-white font-semibold">{newTerm} meses</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Nueva tasa:</span>
                  <span className="text-white font-semibold">{newRate}% mensual</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Nueva cuota:</span>
                  <span className="text-green-400 font-semibold">Bs. {formatCurrency(newPayment)}</span>
                </div>
              </div>
              <p className="text-xs text-yellow-400">
                ⚠️ Esta acción generará una nueva tabla de amortización basada en el saldo restante.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRenegotiate}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
