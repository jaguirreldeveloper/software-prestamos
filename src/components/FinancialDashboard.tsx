import { useMemo } from 'react';
import { SavedLoan } from '../types';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { TrendingUp, DollarSign, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Props {
  loans: SavedLoan[];
}

export default function FinancialDashboard({ loans }: Props) {
  const metrics = useMemo(() => {
    const activeLoans = loans.filter(l => l.status === 'active');
    const completedLoans = loans.filter(l => l.status === 'completed');
    
    const totalPortfolio = loans.reduce((sum, l) => sum + l.params.amount, 0);
    const totalExpected = loans.reduce((sum, l) => sum + l.summary.totalPayment, 0);
    const totalInterest = loans.reduce((sum, l) => sum + l.summary.totalInterest, 0);
    
    const totalPaid = loans.reduce((sum, l) => {
      return sum + l.payments.reduce((pSum, p) => pSum + p.amount, 0);
    }, 0);
    
    const totalPending = totalExpected - totalPaid;
    const recoveryRate = totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0;
    
    const avgLoanAmount = loans.length > 0 ? totalPortfolio / loans.length : 0;
    const avgRate = loans.length > 0 
      ? loans.reduce((sum, l) => sum + l.params.monthlyRate, 0) / loans.length 
      : 0;
    
    return {
      totalLoans: loans.length,
      activeLoans: activeLoans.length,
      completedLoans: completedLoans.length,
      totalPortfolio,
      totalExpected,
      totalInterest,
      totalPaid,
      totalPending,
      recoveryRate,
      avgLoanAmount,
      avgRate,
    };
  }, [loans]);

  // Datos para gráfico de distribución
  const portfolioDistribution = useMemo(() => {
    const statusCount = {
      active: loans.filter(l => l.status === 'active').length,
      completed: loans.filter(l => l.status === 'completed').length,
      cancelled: loans.filter(l => l.status === 'cancelled').length,
    };
    
    return [
      { name: 'Activos', value: statusCount.active, color: '#10b981' },
      { name: 'Completados', value: statusCount.completed, color: '#3b82f6' },
      { name: 'Cancelados', value: statusCount.cancelled, color: '#ef4444' },
    ].filter(item => item.value > 0);
  }, [loans]);

  // Datos para gráfico de evolución mensual
  const monthlyEvolution = useMemo(() => {
    const monthlyData: { [key: string]: { month: string; paid: number; pending: number } } = {};
    
    loans.forEach(loan => {
      loan.payments.forEach(payment => {
        const date = new Date(payment.paidDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, paid: 0, pending: 0 };
        }
        
        monthlyData[monthKey].paid += payment.amount;
      });
    });
    
    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Últimos 12 meses
  }, [loans]);

  // Datos para gráfico de tasas
  const rateDistribution = useMemo(() => {
    const rateRanges = [
      { range: '0-5%', min: 0, max: 5, count: 0 },
      { range: '5-10%', min: 5, max: 10, count: 0 },
      { range: '10-15%', min: 10, max: 15, count: 0 },
      { range: '15-20%', min: 15, max: 20, count: 0 },
      { range: '20%+', min: 20, max: 100, count: 0 },
    ];
    
    loans.forEach(loan => {
      const rate = loan.params.monthlyRate;
      const range = rateRanges.find(r => rate >= r.min && rate < r.max);
      if (range) range.count++;
    });
    
    return rateRanges.map(r => ({ name: r.range, count: r.count }));
  }, [loans]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (loans.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl text-slate-400">No hay datos para mostrar</h3>
        <p className="text-slate-500 mt-2">Guarda algunos préstamos para ver las métricas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        Dashboard de Métricas Financieras
      </h2>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Cartera Total</p>
              <p className="text-xl font-bold text-white">Bs. {formatCurrency(metrics.totalPortfolio)}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">{metrics.totalLoans} préstamos</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Recuperado</p>
              <p className="text-xl font-bold text-white">Bs. {formatCurrency(metrics.totalPaid)}</p>
            </div>
          </div>
          <p className="text-xs text-green-400">{metrics.recoveryRate.toFixed(1)}% de recuperación</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Pendiente por Cobrar</p>
              <p className="text-xl font-bold text-white">Bs. {formatCurrency(metrics.totalPending)}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">{metrics.activeLoans} préstamos activos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Intereses Ganados</p>
              <p className="text-xl font-bold text-white">Bs. {formatCurrency(metrics.totalInterest)}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Tasa promedio: {metrics.avgRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Estado */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-md font-semibold text-white mb-4">Distribución de Préstamos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={portfolioDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {portfolioDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value} préstamos`}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Evolución Mensual */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-md font-semibold text-white mb-4">Evolución de Cobros (Últimos 12 meses)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyEvolution}>
              <defs>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip 
                formatter={(value: number) => `Bs. ${formatCurrency(value)}`}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="paid" stroke="#10b981" fill="url(#colorPaid)" name="Cobrado" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Tasas */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-md font-semibold text-white mb-4">Distribución de Tasas de Interés</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={rateDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip 
                formatter={(value: number) => `${value} préstamos`}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Préstamos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Métricas Promedio */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-md font-semibold text-white mb-4">Métricas Promedio</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
              <span className="text-sm text-slate-400">Monto promedio por préstamo</span>
              <span className="text-lg font-bold text-white">Bs. {formatCurrency(metrics.avgLoanAmount)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
              <span className="text-sm text-slate-400">Tasa de interés promedio</span>
              <span className="text-lg font-bold text-yellow-400">{metrics.avgRate.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
              <span className="text-sm text-slate-400">Tasa de recuperación</span>
              <span className="text-lg font-bold text-green-400">{metrics.recoveryRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Préstamos activos</span>
              <span className="text-lg font-bold text-blue-400">{metrics.activeLoans}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
