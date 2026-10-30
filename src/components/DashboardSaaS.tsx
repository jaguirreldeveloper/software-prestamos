import { TrendingUp, DollarSign, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SavedLoan } from '../types';

interface DashboardProps {
  loans: SavedLoan[];
  onNavigate?: (tab: string) => void;
}

export default function DashboardSaaS({ loans, onNavigate }: DashboardProps) {
  // Calcular métricas
  const totalLoans = loans.length;
  const activeLoans = loans.filter(l => l.status === 'active').length;
  const totalAmount = loans.reduce((sum, l) => sum + l.params.amount, 0);
  const totalInterest = loans.reduce((sum, l) => sum + l.summary.totalInterest, 0);
  const totalPayments = loans.reduce((sum, l) => sum + l.summary.totalPayment, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Préstamos recientes
  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-tertiary)' }}>
          Resumen general de tu cartera de préstamos
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Préstamos */}
        <div className="metric-card metric-card-primary">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <ArrowUpRight className="w-3 h-3" />
              +12%
            </span>
          </div>
          <div className="mb-1">
            <p className="text-sm text-white/80">Monto Total</p>
            <p className="text-3xl font-bold text-white">
              Bs. {formatCurrency(totalAmount)}
            </p>
          </div>
          <p className="text-xs text-white/60">
            {totalLoans} préstamos activos
          </p>
        </div>

        {/* Intereses Ganados */}
        <div className="metric-card metric-card-success">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <ArrowUpRight className="w-3 h-3" />
              +8%
            </span>
          </div>
          <div className="mb-1">
            <p className="text-sm text-white/80">Intereses</p>
            <p className="text-3xl font-bold text-white">
              Bs. {formatCurrency(totalInterest)}
            </p>
          </div>
          <p className="text-xs text-white/60">
            Ganancia proyectada
          </p>
        </div>

        {/* Préstamos Activos */}
        <div className="metric-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <span className="badge badge-info">
              <ArrowUpRight className="w-3 h-3" />
              +5%
            </span>
          </div>
          <div className="mb-1">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Activos</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {activeLoans}
            </p>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            De {totalLoans} totales
          </p>
        </div>

        {/* Total a Recaudar */}
        <div className="metric-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <Calendar className="w-6 h-6" style={{ color: 'var(--accent-warning)' }} />
            </div>
            <span className="badge badge-warning">
              <ArrowDownRight className="w-3 h-3" />
              -2%
            </span>
          </div>
          <div className="mb-1">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>A Recaudar</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Bs. {formatCurrency(totalPayments)}
            </p>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Total proyectado
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Préstamos Recientes */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Préstamos Recientes
            </h2>
            <button 
              onClick={() => onNavigate?.('history')}
              className="btn btn-secondary text-sm"
            >
              Ver todos
            </button>
          </div>

          {recentLoans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">No hay préstamos</h3>
              <p className="empty-state-description">
                Comienza creando tu primer préstamo
              </p>
              <button 
                onClick={() => onNavigate?.('calculator')}
                className="btn btn-primary"
              >
                Crear Préstamo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                  style={{ border: '1px solid var(--border-primary)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                      <span className="text-white font-semibold">
                        {loan.clientName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {loan.clientName}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {loan.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Bs. {formatCurrency(loan.params.amount)}
                    </p>
                    <span className={`badge ${
                      loan.status === 'active' ? 'badge-success' :
                      loan.status === 'completed' ? 'badge-info' : 'badge-danger'
                    }`}>
                      {loan.status === 'active' ? 'Activo' :
                       loan.status === 'completed' ? 'Completado' : 'Cancelado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accesos Rápidos */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Accesos Rápidos
          </h2>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate?.('calculator')}
              className="w-full p-4 rounded-xl text-left hover:bg-[var(--bg-secondary)] transition-colors" 
              style={{ border: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <span className="text-xl">🧮</span>
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Nuevo Préstamo
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Calcular y crear
                  </p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => onNavigate?.('payments')}
              className="w-full p-4 rounded-xl text-left hover:bg-[var(--bg-secondary)] transition-colors" 
              style={{ border: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <span className="text-xl">💳</span>
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Registrar Pago
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Actualizar estado
                  </p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => onNavigate?.('financial')}
              className="w-full p-4 rounded-xl text-left hover:bg-[var(--bg-secondary)] transition-colors" 
              style={{ border: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Ver Reportes
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Análisis detallado
                  </p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => onNavigate?.('import')}
              className="w-full p-4 rounded-xl text-left hover:bg-[var(--bg-secondary)] transition-colors" 
              style={{ border: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                  <span className="text-xl">📥</span>
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Importar Datos
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Carga masiva Excel
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
