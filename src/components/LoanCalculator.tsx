import { useState, useEffect } from 'react';
import { LoanParams } from '../types';
import { Calculator, TrendingUp, Clock, DollarSign, Save, Sparkles } from 'lucide-react';

interface Props {
  onCalculate: (params: LoanParams) => void;
  defaultParams: LoanParams;
  onSave?: (name: string, clientName: string) => void;
}

export default function LoanCalculator({ onCalculate, defaultParams, onSave }: Props) {
  const [amount, setAmount] = useState(defaultParams.amount);
  const [monthlyRate, setMonthlyRate] = useState(defaultParams.monthlyRate);
  const [term, setTerm] = useState(defaultParams.term);
  const [startDate, setStartDate] = useState(defaultParams.startDate);
  const [result, setResult] = useState<{
    monthlyPayment: number;
    monthlyPaymentRounded: number;
    totalPayment: number;
    totalRoundedPayment: number;
    totalInterest: number;
  } | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loanName, setLoanName] = useState('');
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    handleCalculate();
  }, []);

  const handleCalculate = () => {
    const rate = monthlyRate / 100;
    const monthlyPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const monthlyPaymentRounded = Math.ceil(monthlyPayment);
    const totalPayment = monthlyPayment * term;
    const totalRoundedPayment = monthlyPaymentRounded * term;
    const totalInterest = totalPayment - amount;

    setResult({ monthlyPayment, monthlyPaymentRounded, totalPayment, totalRoundedPayment, totalInterest });
    onCalculate({ amount, monthlyRate, term, startDate });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const presets = [
    { label: '500 Bs. / 6 meses', amount: 500, term: 6, rate: 10, icon: '💰' },
    { label: '1.000 Bs. / 12 meses', amount: 1000, term: 12, rate: 10, icon: '💵' },
    { label: '5.000 Bs. / 24 meses', amount: 5000, term: 24, rate: 8, icon: '💎' },
    { label: '10.000 Bs. / 36 meses', amount: 10000, term: 36, rate: 7, icon: '🏦' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Form Section */}
      <div className="lg:col-span-2">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Parámetros del Préstamo
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Configura los detalles de tu préstamo
              </p>
            </div>
          </div>

          {/* Presets */}
          <div className="mb-6">
            <label className="label flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-warning)' }} />
              Plantillas rápidas
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAmount(preset.amount);
                    setTerm(preset.term);
                    setMonthlyRate(preset.rate);
                  }}
                  className="card card-interactive p-3 text-left group"
                >
                  <div className="text-2xl mb-1">{preset.icon}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="label flex items-center gap-2">
                <DollarSign className="w-4 h-4" style={{ color: 'var(--accent-success)' }} />
                Monto del préstamo (Bs.)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="input text-lg font-semibold"
                min={100}
                step={100}
              />
              <input
                type="range"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={100}
                max={100000}
                step={100}
                className="w-full mt-3 accent-blue-500"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>Bs. 100</span>
                <span>Bs. 100.000</span>
              </div>
            </div>

            {/* Monthly Rate */}
            <div>
              <label className="label flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-warning)' }} />
                Tasa de interés mensual (%)
              </label>
              <input
                type="number"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(Number(e.target.value))}
                className="input text-lg font-semibold"
                min={0.1}
                max={50}
                step={0.5}
              />
              <input
                type="range"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(Number(e.target.value))}
                min={0.5}
                max={30}
                step={0.5}
                className="w-full mt-3 accent-yellow-500"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>0.5%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Term */}
            <div>
              <label className="label flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
                Plazo (meses)
              </label>
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="input text-lg font-semibold"
                min={1}
                max={360}
                step={1}
              />
              <input
                type="range"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                min={1}
                max={60}
                step={1}
                className="w-full mt-3 accent-purple-500"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>1 mes</span>
                <span>60 meses</span>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="label">📅 Fecha de inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input text-lg font-semibold"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="btn btn-primary w-full mt-6 py-4 text-base"
          >
            <Calculator className="w-5 h-5" />
            Calcular Amortización
          </button>

          {/* Save Button */}
          {onSave && result && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="btn btn-secondary w-full mt-3"
            >
              <Save className="w-4 h-4" />
              Guardar Préstamo
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="space-y-4">
        {result && (
          <>
            <div className="card card-interactive" style={{ background: 'var(--gradient-primary)', border: 'none' }}>
              <p className="text-sm text-white/80 mb-1">Cuota Mensual</p>
              <p className="text-3xl font-bold text-white">
                Bs. {formatCurrency(result.monthlyPayment)}
              </p>
            </div>

            <div className="card">
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Cuota Redondeada</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
                Bs. {formatCurrency(result.monthlyPaymentRounded)}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                +{formatCurrency(result.monthlyPaymentRounded - result.monthlyPayment)} por cuota
              </p>
            </div>

            <div className="card">
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Total a Pagar</p>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Bs. {formatCurrency(result.totalPayment)}
              </p>
            </div>

            <div className="card" style={{ borderColor: 'var(--accent-danger)' }}>
              <p className="text-sm" style={{ color: 'var(--accent-danger)' }}>Interés Total</p>
              <p className="text-xl font-bold" style={{ color: 'var(--accent-danger)' }}>
                Bs. {formatCurrency(result.totalInterest)}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {((result.totalInterest / amount) * 100).toFixed(1)}% del monto prestado
              </p>
            </div>

            <div className="card" style={{ borderColor: 'var(--accent-success)' }}>
              <p className="text-sm" style={{ color: 'var(--accent-success)' }}>Capital Prestado</p>
              <p className="text-xl font-bold" style={{ color: 'var(--accent-success)' }}>
                Bs. {formatCurrency(amount)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="card max-w-md w-full">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              💾 Guardar Préstamo
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label">Nombre del préstamo</label>
                <input
                  type="text"
                  value={loanName}
                  onChange={(e) => setLoanName(e.target.value)}
                  placeholder="Ej: Préstamo personal Marzo"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Nombre del cliente</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="input"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (loanName && clientName && onSave) {
                      onSave(loanName, clientName);
                      setShowSaveModal(false);
                      setLoanName('');
                      setClientName('');
                    }
                  }}
                  className="btn btn-primary flex-1"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
