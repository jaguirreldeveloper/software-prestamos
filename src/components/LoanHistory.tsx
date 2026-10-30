import { useState } from 'react';
import { SavedLoan } from '../types';
import { Search, Edit2, Trash2, Eye, Copy, MoreVertical } from 'lucide-react';

interface Props {
  loans: SavedLoan[];
  onLoad: (loan: SavedLoan) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SavedLoan>) => void;
  onDuplicate: (loan: SavedLoan) => void;
  onExport: (loan: SavedLoan) => void;
  onNavigate?: (tab: string) => void;
}

export default function LoanHistory({ loans, onLoad, onDelete, onUpdate, onDuplicate, onExport, onNavigate }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Activo</span>;
      case 'completed':
        return <span className="badge badge-info">Completado</span>;
      case 'cancelled':
        return <span className="badge badge-danger">Cancelado</span>;
      default:
        return null;
    }
  };

  if (loans.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📂</div>
        <h3 className="empty-state-title">No hay préstamos guardados</h3>
        <p className="empty-state-description">
          Comienza calculando un préstamo y guárdalo para verlo aquí
        </p>
        <button 
          onClick={() => onNavigate?.('calculator')}
          className="btn btn-primary"
        >
          Crear Primer Préstamo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Historial de Préstamos
          </h1>
          <p style={{ color: 'var(--text-tertiary)' }}>
            Gestiona todos tus préstamos guardados
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o cliente..."
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="input w-48"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="completed">Completados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>

        {/* Lista de Préstamos */}
        <div className="space-y-3">
          {filteredLoans.map((loan) => (
            <div
              key={loan.id}
              className="p-4 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
              style={{ border: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {loan.name}
                    </h3>
                    {getStatusBadge(loan.status)}
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Cliente: {loan.clientName}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Monto</p>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Bs. {formatCurrency(loan.params.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tasa</p>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {loan.params.monthlyRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Plazo</p>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {loan.params.term} meses
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cuota</p>
                      <p className="font-semibold" style={{ color: 'var(--accent-success)' }}>
                        Bs. {formatCurrency(loan.summary.monthlyPayment)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                    Creado: {formatDate(loan.createdAt)}
                  </p>
                </div>

                {/* Menú de Acciones */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === loan.id ? null : loan.id)}
                    className="btn btn-secondary"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {menuOpenId === loan.id && (
                    <div
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg z-10"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)' }}
                    >
                      <button
                        onClick={() => { onLoad(loan); setMenuOpenId(null); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-secondary)] flex items-center gap-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <Eye className="w-4 h-4" />
                        Cargar
                      </button>
                      <button
                        onClick={() => { onDuplicate(loan); setMenuOpenId(null); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-secondary)] flex items-center gap-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <Copy className="w-4 h-4" />
                        Duplicar
                      </button>
                      <button
                        onClick={() => { onExport(loan); setMenuOpenId(null); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-secondary)] flex items-center gap-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <Edit2 className="w-4 h-4" />
                        Exportar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar este préstamo?')) {
                            onDelete(loan.id);
                            setMenuOpenId(null);
                          }
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-secondary)] flex items-center gap-2"
                        style={{ color: 'var(--accent-danger)' }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
