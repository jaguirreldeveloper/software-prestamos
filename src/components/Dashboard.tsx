import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { LoanParams, AmortizationRow, LoanSummary } from '../types';
import { TrendingDown, DollarSign, Calendar, Percent } from 'lucide-react';

interface Props {
  summary: LoanSummary;
  params: LoanParams;
  data: AmortizationRow[];
}

export default function Dashboard({ summary, params, data }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Pie chart data
  const pieData = [
    { name: 'Capital', value: params.amount, color: '#10b981' },
    { name: 'Intereses', value: summary.totalInterest, color: '#ef4444' },
  ];

  // Bar chart data - Capital vs Interest per period
  const barData = data.filter(row => row.number > 0).map(row => ({
    name: `Mes ${row.number}`,
    capital: row.capital,
    interes: row.interest,
  }));

  // Line chart data - Balance over time
  const lineData = data.filter(row => row.number > 0).map(row => ({
    name: `Mes ${row.number}`,
    saldo: row.finalBalance,
  }));

  if (!data.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl text-slate-400">Calcula un préstamo para ver el dashboard</h3>
        <p className="text-slate-500 mt-2">Ve a la pestaña "Calculadora" e ingresa los parámetros</p>
      </div>
    );
  }

  const interestPercentage = ((summary.totalInterest / summary.totalPayment) * 100).toFixed(1);
  const capitalPercentage = ((params.amount / summary.totalPayment) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Cuota Mensual</p>
              <p className="text-lg font-bold text-white">Bs. {formatCurrency(summary.monthlyPayment)}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Capital</p>
              <p className="text-lg font-bold text-white">Bs. {formatCurrency(params.amount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-red-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Interés Total</p>
              <p className="text-lg font-bold text-white">Bs. {formatCurrency(summary.totalInterest)}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Plazo</p>
              <p className="text-lg font-bold text-white">{params.term} meses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Composición del Pago Total</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `Bs. ${formatCurrency(value)}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-300">Capital ({capitalPercentage}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-300">Intereses ({interestPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Line Chart - Balance */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Evolución del Saldo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => `Bs. ${formatCurrency(value)}`}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="saldo" stroke="#3b82f6" fill="url(#colorSaldo)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Capital vs Interés por Cuota</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              formatter={(value: number) => `Bs. ${formatCurrency(value)}`}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="capital" fill="#10b981" radius={[4, 4, 0, 0]} name="Capital" />
            <Bar dataKey="interes" fill="#ef4444" radius={[4, 4, 0, 0]} name="Interés" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📈 Métricas Clave</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-sm text-slate-400">Relación Interés/Capital</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              {((summary.totalInterest / params.amount) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Por cada Bs. 1 prestado, pagas Bs. {((summary.totalPayment / params.amount)).toFixed(2)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-sm text-slate-400">Tasa Efectiva Anual</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1">
              {((Math.pow(1 + params.monthlyRate / 100, 12) - 1) * 100).toFixed(2)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Equivalent to monthly {params.monthlyRate}%</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-sm text-slate-400">Promedio Interés/Cuota</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {((summary.totalInterest / summary.totalPayment) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Del total pagado va a intereses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
