import { useState } from 'react';
import { RateComparison } from '../types';
import { Scale, Plus, Trash2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  amount: number;
}

export default function RateComparator({ amount }: Props) {
  const [comparisons, setComparisons] = useState<RateComparison[]>([
    { label: 'Opción 1', rate: 10, term: 12, monthlyPayment: 0, totalPayment: 0, totalInterest: 0 },
    { label: 'Opción 2', rate: 8, term: 12, monthlyPayment: 0, totalPayment: 0, totalInterest: 0 },
  ]);

  const calculateScenario = (rate: number, term: number) => {
    const r = rate / 100;
    if (r === 0) return { monthlyPayment: amount / term, totalPayment: amount, totalInterest: 0 };
    const monthlyPayment = amount * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;
    return { monthlyPayment, totalPayment, totalInterest };
  };

  const updateComparison = (index: number, field: keyof RateComparison, value: string | number) => {
    const updated = [...comparisons];
    const item = { ...updated[index], [field]: value };
    
    // Recalculate
    const calc = calculateScenario(item.rate, item.term);
    item.monthlyPayment = calc.monthlyPayment;
    item.totalPayment = calc.totalPayment;
    item.totalInterest = calc.totalInterest;
    
    updated[index] = item;
    setComparisons(updated);
  };

  const addComparison = () => {
    if (comparisons.length >= 5) return;
    const newItem: RateComparison = {
      label: `Opción ${comparisons.length + 1}`,
      rate: 10,
      term: 12,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
    };
    const calc = calculateScenario(newItem.rate, newItem.term);
    newItem.monthlyPayment = calc.monthlyPayment;
    newItem.totalPayment = calc.totalPayment;
    newItem.totalInterest = calc.totalInterest;
    setComparisons([...comparisons, newItem]);
  };

  const removeComparison = (index: number) => {
    if (comparisons.length <= 2) return;
    setComparisons(comparisons.filter((_, i) => i !== index));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Recalculate all on mount and amount change
  const recalculated = comparisons.map(c => {
    const calc = calculateScenario(c.rate, c.term);
    return { ...c, ...calc };
  });

  // Find best option
  const bestOption = recalculated.reduce((best, curr) => 
    curr.totalInterest < best.totalInterest ? curr : best
  );

  // Chart data
  const chartData = recalculated.map(c => ({
    name: c.label,
    cuota: c.monthlyPayment,
    interes: c.totalInterest,
    total: c.totalPayment,
  }));

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-400" />
          Comparador de Tasas y Plazos
        </h2>
        <div className="text-sm text-slate-400">
          Monto base: <span className="text-white font-semibold">Bs. {formatCurrency(amount)}</span>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recalculated.map((comp, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-5 transition-all ${
              comp.label === bestOption.label
                ? 'bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20'
                : 'bg-slate-800/50 border-blue-500/20'
            }`}
          >
            {comp.label === bestOption.label && (
              <div className="flex items-center gap-1 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-green-400">MEJOR OPCIÓN</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nombre</label>
                <input
                  type="text"
                  value={comp.label}
                  onChange={(e) => updateComparison(idx, 'label', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tasa mensual (%)</label>
                  <input
                    type="number"
                    value={comp.rate}
                    onChange={(e) => updateComparison(idx, 'rate', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                    min={0.1}
                    max={50}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Plazo (meses)</label>
                  <input
                    type="number"
                    value={comp.term}
                    onChange={(e) => updateComparison(idx, 'term', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                    min={1}
                    max={360}
                  />
                </div>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Cuota mensual</span>
                  <span className="text-white font-semibold">Bs. {formatCurrency(comp.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total a pagar</span>
                  <span className="text-white font-medium">Bs. {formatCurrency(comp.totalPayment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Interés total</span>
                  <span className="text-red-400 font-medium">Bs. {formatCurrency(comp.totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm pt-1 border-t border-slate-700/30">
                  <span className="text-slate-400">Tasa efectiva anual</span>
                  <span className="text-cyan-400 font-medium">
                    {((Math.pow(1 + comp.rate / 100, 12) - 1) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              {comparisons.length > 2 && (
                <button
                  onClick={() => removeComparison(idx)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3 h-3" /> Eliminar
                </button>
              )}
            </div>
          </div>
        ))}

        {comparisons.length < 5 && (
          <button
            onClick={addComparison}
            className="rounded-2xl border-2 border-dashed border-slate-600/50 p-5 flex flex-col items-center justify-center gap-2 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all min-h-[200px]"
          >
            <Plus className="w-8 h-8 text-slate-500" />
            <span className="text-sm text-slate-500">Agregar comparación</span>
          </button>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-md font-semibold text-white mb-4">Cuota Mensual por Opción</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => `Bs. ${formatCurrency(value)}`}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="cuota" name="Cuota Mensual" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <rect key={index} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-md font-semibold text-white mb-4">Interés Total por Opción</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => `Bs. ${formatCurrency(value)}`}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="interes" name="Interés Total" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6 overflow-x-auto">
        <h3 className="text-md font-semibold text-white mb-4">📋 Tabla Comparativa</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-2 text-left text-xs text-blue-300 font-semibold">Concepto</th>
              {recalculated.map((c, idx) => (
                <th key={idx} className="px-4 py-2 text-right text-xs text-blue-300 font-semibold">
                  <span style={{ color: colors[idx % colors.length] }}>{c.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-700/20">
              <td className="px-4 py-2 text-slate-400">Tasa mensual</td>
              {recalculated.map((c, idx) => (
                <td key={idx} className="px-4 py-2 text-right text-yellow-400">{c.rate}%</td>
              ))}
            </tr>
            <tr className="border-b border-slate-700/20">
              <td className="px-4 py-2 text-slate-400">Tasa efectiva anual</td>
              {recalculated.map((c, idx) => (
                <td key={idx} className="px-4 py-2 text-right text-cyan-400">
                  {((Math.pow(1 + c.rate / 100, 12) - 1) * 100).toFixed(2)}%
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-700/20">
              <td className="px-4 py-2 text-slate-400">Plazo</td>
              {recalculated.map((c, idx) => (
                <td key={idx} className="px-4 py-2 text-right text-white">{c.term} meses</td>
              ))}
            </tr>
            <tr className="border-b border-slate-700/20">
              <td className="px-4 py-2 text-slate-400">Cuota mensual</td>
              {recalculated.map((c, idx) => (
                <td key={idx} className="px-4 py-2 text-right text-white font-semibold">
                  Bs. {formatCurrency(c.monthlyPayment)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-700/20">
              <td className="px-4 py-2 text-slate-400">Total a pagar</td>
              {recalculated.map((c, idx) => (
                <td key={idx} className="px-4 py-2 text-right text-white">
                  Bs. {formatCurrency(c.totalPayment)}
                </td>
              ))}
            </tr>
            <tr className="bg-green-500/5">
              <td className="px-4 py-2 text-slate-400 font-semibold">Interés total</td>
              {recalculated.map((c, idx) => (
                <td key={idx} className={`px-4 py-2 text-right font-bold ${
                  c.label === bestOption.label ? 'text-green-400' : 'text-red-400'
                }`}>
                  Bs. {formatCurrency(c.totalInterest)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
