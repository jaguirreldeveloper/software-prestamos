import { useState } from 'react';
import { AmortizationRow, LoanParams, LoanSummary } from '../types';
import { Zap, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Props {
  data: AmortizationRow[];
  params: LoanParams;
  summary: LoanSummary;
}

export default function EarlyPaymentSimulator({ data, params, summary }: Props) {
  const [extraPayment, setExtraPayment] = useState(100);
  const [startFromMonth, setStartFromMonth] = useState(1);
  const [frequency, setFrequency] = useState<'every' | 'alternate' | 'once'>('every');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Simulate early payments
  const simulate = () => {
    const rate = params.monthlyRate / 100;
    let balance = params.amount;
    const originalRows: { month: number; balance: number }[] = [];
    const simulatedRows: { month: number; balance: number }[] = [];
    
    let month = 0;
    let totalInterestOriginal = 0;
    let totalInterestSimulated = 0;
    let simulatedMonths = 0;

    // Original schedule
    let origBalance = params.amount;
    for (let i = 1; i <= params.term; i++) {
      const interest = origBalance * rate;
      const capital = summary.monthlyPayment - interest;
      origBalance -= capital;
      totalInterestOriginal += interest;
      originalRows.push({ month: i, balance: Math.max(0, origBalance) });
    }

    // Simulated schedule with extra payments
    let simBalance = params.amount;
    month = 0;
    while (simBalance > 0.01 && month < 360) {
      month++;
      const interest = simBalance * rate;
      let capital = summary.monthlyPayment - interest;
      
      // Apply extra payment
      if (month >= startFromMonth) {
        if (frequency === 'every') {
          capital += extraPayment;
        } else if (frequency === 'alternate' && month % 2 === 0) {
          capital += extraPayment;
        } else if (frequency === 'once' && month === startFromMonth) {
          capital += extraPayment;
        }
      }

      if (capital > simBalance) {
        capital = simBalance;
      }
      
      simBalance -= capital;
      totalInterestSimulated += interest;
      simulatedRows.push({ month, balance: Math.max(0, simBalance) });
    }
    simulatedMonths = month;

    const interestSaved = totalInterestOriginal - totalInterestSimulated;
    const monthsSaved = params.term - simulatedMonths;
    const totalExtraPaid = extraPayment * (frequency === 'every' ? Math.max(0, params.term - startFromMonth + 1) : frequency === 'alternate' ? Math.floor(Math.max(0, params.term - startFromMonth + 1) / 2) : 1);

    // Chart data
    const chartData = [];
    const maxMonths = Math.max(originalRows.length, simulatedRows.length);
    for (let i = 0; i < maxMonths; i++) {
      chartData.push({
        month: `M${i + 1}`,
        original: originalRows[i]?.balance || 0,
        simulated: simulatedRows[i]?.balance || 0,
      });
    }

    return {
      interestSaved,
      monthsSaved,
      totalInterestOriginal,
      totalInterestSimulated,
      simulatedMonths,
      totalExtraPaid,
      chartData,
    };
  };

  if (!data.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">⚡</div>
        <h3 className="text-xl text-slate-400">No hay préstamo para simular</h3>
        <p className="text-slate-500 mt-2">Calcula un préstamo primero</p>
      </div>
    );
  }

  const result = simulate();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Simulador de Pagos Anticipados
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-yellow-500/20 p-6">
          <h3 className="text-md font-semibold text-white mb-4">⚙️ Configuración</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                💰 Monto de pago extra (Bs.)
              </label>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-yellow-500"
                min={10}
                step={10}
              />
              <input
                type="range"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                min={10}
                max={summary.monthlyPayment * 2}
                step={10}
                className="w-full mt-2 accent-yellow-500"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                📅 Iniciar desde cuota #
              </label>
              <input
                type="number"
                value={startFromMonth}
                onChange={(e) => setStartFromMonth(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-yellow-500"
                min={1}
                max={params.term}
              />
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">🔄 Frecuencia</label>
              <div className="grid grid-cols-3 gap-2">
                {(['every', 'alternate', 'once'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      frequency === f
                        ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'
                        : 'bg-slate-700/50 border border-slate-600/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f === 'every' ? 'Cada mes' : f === 'alternate' ? 'Alterno' : 'Una vez'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-green-500/10 rounded-xl border border-green-500/20 p-4">
              <TrendingDown className="w-5 h-5 text-green-400 mb-1" />
              <p className="text-xs text-slate-400">Interés Ahorrado</p>
              <p className="text-lg font-bold text-green-400">Bs. {formatCurrency(result.interestSaved)}</p>
            </div>
            <div className="bg-blue-500/10 rounded-xl border border-blue-500/20 p-4">
              <Clock className="w-5 h-5 text-blue-400 mb-1" />
              <p className="text-xs text-slate-400">Meses Ahorrados</p>
              <p className="text-lg font-bold text-blue-400">{result.monthsSaved}</p>
            </div>
            <div className="bg-purple-500/10 rounded-xl border border-purple-500/20 p-4">
              <DollarSign className="w-5 h-5 text-purple-400 mb-1" />
              <p className="text-xs text-slate-400">Nuevo Plazo</p>
              <p className="text-lg font-bold text-purple-400">{result.simulatedMonths} meses</p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl border border-yellow-500/20 p-4">
              <Zap className="w-5 h-5 text-yellow-400 mb-1" />
              <p className="text-xs text-slate-400">Total Extra Pagado</p>
              <p className="text-lg font-bold text-yellow-400">Bs. {formatCurrency(result.totalExtraPaid)}</p>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4">📊 Comparación: Original vs Con Pagos Extra</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={result.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => `Bs. ${formatCurrency(value)}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="original" stroke="#ef4444" strokeWidth={2} name="Sin pagos extra" dot={false} />
                <Line type="monotone" dataKey="simulated" stroke="#10b981" strokeWidth={2} name="Con pagos extra" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span className="text-xs text-slate-300">Original ({params.term} meses)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className="text-xs text-slate-300">Con extra ({result.simulatedMonths} meses)</span>
              </div>
            </div>
          </div>

          {/* Savings breakdown */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-3">💡 Resumen del Ahorro</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-700/30">
                <span className="text-slate-400">Interés total original</span>
                <span className="text-red-400 font-medium">Bs. {formatCurrency(result.totalInterestOriginal)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/30">
                <span className="text-slate-400">Interés con pagos extra</span>
                <span className="text-green-400 font-medium">Bs. {formatCurrency(result.totalInterestSimulated)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/30">
                <span className="text-slate-400">Total extra invertido</span>
                <span className="text-yellow-400 font-medium">Bs. {formatCurrency(result.totalExtraPaid)}</span>
              </div>
              <div className="flex justify-between py-2 bg-green-500/5 rounded-lg px-3">
                <span className="text-white font-semibold">Ahorro neto</span>
                <span className="text-green-400 font-bold text-lg">
                  Bs. {formatCurrency(result.interestSaved - result.totalExtraPaid + result.totalExtraPaid)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                * Por cada Bs. 1 de pago extra, ahorras Bs. {(result.interestSaved / Math.max(1, result.totalExtraPaid)).toFixed(2)} en intereses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
