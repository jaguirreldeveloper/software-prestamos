import { SavedLoan } from '../types';
import { FolderOpen, Trash2, Eye, Calendar, DollarSign } from 'lucide-react';

interface Props {
  loans: SavedLoan[];
  onLoad: (loan: SavedLoan) => void;
  onDelete: (id: string) => void;
}

export default function LoanHistory({ loans, onLoad, onDelete }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loans.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📂</div>
        <h3 className="text-xl text-slate-400">No hay préstamos guardados</h3>
        <p className="text-slate-500 mt-2">
          Calcula un préstamo y guárdalo desde la pestaña "Calculadora"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-blue-400" />
          Historial de Préstamos ({loans.length})
        </h2>
        <p className="text-xs text-slate-500">💾 Guardados localmente en tu navegador</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-5 hover:border-blue-500/40 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-white font-semibold">{loan.name}</h3>
                <p className="text-sm text-blue-300">{loan.clientName}</p>
              </div>
              <span className="text-xs text-slate-500">{formatDate(loan.createdAt)}</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Monto
                </span>
                <span className="text-white font-medium">Bs. {formatCurrency(loan.params.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tasa mensual</span>
                <span className="text-yellow-400 font-medium">{loan.params.monthlyRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Plazo
                </span>
                <span className="text-white font-medium">{loan.params.term} meses</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Cuota</span>
                <span className="text-green-400 font-medium">Bs. {formatCurrency(loan.summary.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total a pagar</span>
                <span className="text-white font-medium">Bs. {formatCurrency(loan.summary.totalPayment)}</span>
              </div>
              {loan.payments.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pagos registrados</span>
                  <span className="text-cyan-400 font-medium">{loan.payments.length}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onLoad(loan)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs text-blue-300 hover:bg-blue-500/30 transition-all"
              >
                <Eye className="w-3 h-3" /> Cargar
              </button>
              <button
                onClick={() => {
                  if (confirm('¿Eliminar este préstamo del historial?')) {
                    onDelete(loan.id);
                  }
                }}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-xs text-red-300 hover:bg-red-500/30 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-md font-semibold text-white mb-4">📊 Resumen del Portafolio</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-400">Total Préstamos</p>
            <p className="text-2xl font-bold text-white">{loans.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Monto Total Prestado</p>
            <p className="text-lg font-bold text-green-400">
              Bs. {formatCurrency(loans.reduce((sum, l) => sum + l.params.amount, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Total a Recuperar</p>
            <p className="text-lg font-bold text-blue-400">
              Bs. {formatCurrency(loans.reduce((sum, l) => sum + l.summary.totalPayment, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Intereses Esperados</p>
            <p className="text-lg font-bold text-yellow-400">
              Bs. {formatCurrency(loans.reduce((sum, l) => sum + l.summary.totalInterest, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
