import { AmortizationRow } from '../types';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Props {
  data: AmortizationRow[];
  moraRate?: number;
}

export default function PaymentCalendar({ data, moraRate = 2 }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getShortDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return { day: date.getDate(), month: months[date.getMonth()], year: date.getFullYear() };
  };

  const getPaymentStatus = (dateStr: string) => {
    const today = new Date();
    const paymentDate = new Date(dateStr + 'T12:00:00');
    
    if (paymentDate < today) return 'overdue';
    if (paymentDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) return 'upcoming';
    return 'pending';
  };

  const calculateMora = (dateStr: string, paymentAmount: number) => {
    const today = new Date();
    const paymentDate = new Date(dateStr + 'T12:00:00');
    if (paymentDate >= today) return { mora: 0, daysLate: 0 };
    
    const diffTime = today.getTime() - paymentDate.getTime();
    const daysLate = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const monthlyMoraRate = moraRate / 100;
    const dailyMoraRate = monthlyMoraRate / 30;
    const mora = paymentAmount * dailyMoraRate * daysLate;
    
    return { mora, daysLate };
  };

  const payments = data.filter(row => row.number > 0);
  
  // Calculate total mora for overdue payments
  const overduePayments = payments.filter(p => getPaymentStatus(p.paymentDate) === 'overdue');
  const totalMora = overduePayments.reduce((sum, p) => {
    const { mora } = calculateMora(p.paymentDate, p.payment);
    return sum + mora;
  }, 0);

  if (!payments.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl text-slate-400">No hay pagos programados</h3>
        <p className="text-slate-500 mt-2">Calcula un préstamo para ver el calendario</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">📅 Calendario de Pagos</h2>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            Pagado
          </span>
          <span className="flex items-center gap-1 text-yellow-400">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            Próximo
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            Pendiente
          </span>
        </div>
      </div>

      {/* Mora Alert */}
      {totalMora > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-300">⚠️ Pagos vencidos detectados</p>
              <p className="text-xs text-red-400/70">
                {overduePayments.length} cuota(s) atrasada(s) — Mora acumulada al {moraRate}% mensual
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-red-300">Mora total</p>
            <p className="text-lg font-bold text-red-400">Bs. {formatCurrency(totalMora)}</p>
          </div>
        </div>
      )}

      {/* Timeline View */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-slate-700"></div>
          
          <div className="space-y-4">
            {payments.map((payment, idx) => {
              const status = getPaymentStatus(payment.paymentDate);
              const shortDate = getShortDate(payment.paymentDate);
              
              return (
                <div key={idx} className="relative flex items-start gap-4 pl-2">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    status === 'overdue' ? 'bg-green-500/20 border-green-500' :
                    status === 'upcoming' ? 'bg-yellow-500/20 border-yellow-500' :
                    'bg-slate-700/50 border-slate-600'
                  }`}>
                    {status === 'overdue' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {status === 'upcoming' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
                    {status === 'pending' && <Clock className="w-4 h-4 text-slate-400" />}
                  </div>

                  {/* Payment Card */}
                  <div className={`flex-1 rounded-xl border p-4 transition-all hover:scale-[1.01] ${
                    status === 'overdue' ? 'bg-green-500/5 border-green-500/20' :
                    status === 'upcoming' ? 'bg-yellow-500/5 border-yellow-500/20' :
                    'bg-slate-900/30 border-slate-700/30'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        {/* Date badge */}
                        <div className="text-center bg-slate-800/80 rounded-lg px-3 py-2 min-w-[60px]">
                          <p className="text-lg font-bold text-white leading-tight">{shortDate.day}</p>
                          <p className="text-xs text-blue-300">{shortDate.month}</p>
                          <p className="text-xs text-slate-500">{shortDate.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">
                            Cuota #{payment.number} - {formatDate(payment.paymentDate)}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Capital: Bs. {formatCurrency(payment.capital)} | Interés: Bs. {formatCurrency(payment.interest)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">Bs. {formatCurrency(payment.payment)}</p>
                        <p className={`text-xs ${
                          status === 'overdue' ? 'text-green-400' :
                          status === 'upcoming' ? 'text-yellow-400' :
                          'text-slate-500'
                        }`}>
                          {status === 'overdue' ? '✓ Pagado' :
                           status === 'upcoming' ? '⚠ Próximo vencimiento' :
                           '○ Pendiente'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3 flex gap-1">
                      <div 
                        className="h-1.5 rounded-full bg-green-500"
                        style={{ width: `${(payment.capital / payment.payment) * 100}%` }}
                      ></div>
                      <div 
                        className="h-1.5 rounded-full bg-red-500"
                        style={{ width: `${(payment.interest / payment.payment) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-green-400">Capital {(payment.capital / payment.payment * 100).toFixed(0)}%</span>
                      <span className="text-xs text-red-400">Interés {(payment.interest / payment.payment * 100).toFixed(0)}%</span>
                    </div>

                    {/* Mora info for overdue payments */}
                    {status === 'overdue' && calculateMora(payment.paymentDate, payment.payment).daysLate > 0 && (
                      <div className="mt-2 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-red-300">
                            ⚠️ {calculateMora(payment.paymentDate, payment.payment).daysLate} día(s) de atraso
                          </span>
                          <span className="text-xs font-bold text-red-400">
                            Mora: Bs. {formatCurrency(calculateMora(payment.paymentDate, payment.payment).mora)}
                          </span>
                        </div>
                        <p className="text-xs text-red-400/60 mt-1">
                          Total a pagar: Bs. {formatCurrency(payment.payment + calculateMora(payment.paymentDate, payment.payment).mora)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📊 Resumen del Calendario</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-sm text-slate-400">Total de Cuotas</p>
            <p className="text-2xl font-bold text-white">{payments.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-sm text-slate-400">Próximo Pago</p>
            <p className="text-lg font-bold text-yellow-400">
              {payments.length > 0 ? formatDate(payments[0].paymentDate) : '-'}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-sm text-slate-400">Último Pago</p>
            <p className="text-lg font-bold text-blue-400">
              {payments.length > 0 ? formatDate(payments[payments.length - 1].paymentDate) : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
