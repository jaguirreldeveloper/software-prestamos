import { useState, useEffect } from 'react';
import { LoanParams } from '../types';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface Props {
  onCalculate: (params: LoanParams) => void;
  defaultParams: LoanParams;
}

export default function LoanCalculator({ onCalculate, defaultParams }: Props) {
  const [amount, setAmount] = useState(defaultParams.amount);
  const [monthlyRate, setMonthlyRate] = useState(defaultParams.monthlyRate);
  const [term, setTerm] = useState(defaultParams.term);
  const [startDate, setStartDate] = useState(defaultParams.startDate);
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  useEffect(() => {
    // Auto-calculate on mount with defaults
    handleCalculate();
  }, []);

  const handleCalculate = () => {
    const rate = monthlyRate / 100;
    const monthlyPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;

    setResult({ monthlyPayment, totalPayment, totalInterest });
    onCalculate({ amount, monthlyRate, term, startDate });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const presets = [
    { label: '500 Bs. / 6 meses', amount: 500, term: 6, rate: 10 },
    { label: '1.000 Bs. / 12 meses', amount: 1000, term: 12, rate: 10 },
    { label: '5.000 Bs. / 24 meses', amount: 5000, term: 24, rate: 8 },
    { label: '10.000 Bs. / 36 meses', amount: 10000, term: 36, rate: 7 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Section */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            Parámetros del Préstamo
          </h2>

          {/* Presets */}
          <div className="mb-6">
            <label className="text-sm text-slate-400 mb-2 block">Plantillas rápidas</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAmount(preset.amount);
                    setTerm(preset.term);
                    setMonthlyRate(preset.rate);
                  }}
                  className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-xs text-slate-300 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                <DollarSign className="w-4 h-4 inline text-green-400" />
                Monto del préstamo (Bs.)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
                className="w-full mt-2 accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Bs. 100</span>
                <span>Bs. 100.000</span>
              </div>
            </div>

            {/* Monthly Rate */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                <TrendingUp className="w-4 h-4 inline text-yellow-400" />
                Tasa de interés mensual (%)
              </label>
              <input
                type="number"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
                className="w-full mt-2 accent-yellow-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0.5%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Term */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                <Clock className="w-4 h-4 inline text-purple-400" />
                Plazo (meses)
              </label>
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
                className="w-full mt-2 accent-purple-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 mes</span>
                <span>60 meses</span>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                📅 Fecha de inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            📊 Calcular Amortización
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="space-y-4">
        {result && (
          <>
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-5">
              <p className="text-sm text-blue-300 mb-1">Cuota Mensual</p>
              <p className="text-3xl font-bold text-white">
                Bs. {formatCurrency(result.monthlyPayment)}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-5">
              <p className="text-sm text-slate-400 mb-1">Total a Pagar</p>
              <p className="text-xl font-bold text-white">
                Bs. {formatCurrency(result.totalPayment)}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-red-500/20 p-5">
              <p className="text-sm text-red-300 mb-1">Interés Total</p>
              <p className="text-xl font-bold text-red-400">
                Bs. {formatCurrency(result.totalInterest)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {((result.totalInterest / amount) * 100).toFixed(1)}% del monto prestado
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-green-500/20 p-5">
              <p className="text-sm text-green-300 mb-1">Capital Prestado</p>
              <p className="text-xl font-bold text-green-400">
                Bs. {formatCurrency(amount)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
