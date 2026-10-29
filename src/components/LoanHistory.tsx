import { useState } from 'react';
import { SavedLoan, LoanParams } from '../types';
import { 
  FolderOpen, Trash2, Eye, Calendar, DollarSign, 
  Edit3, Copy, Download, MoreVertical, Search,
  CheckCircle2, XCircle, Clock, FileText, X, Save
} from 'lucide-react';

interface Props {
  loans: SavedLoan[];
  onLoad: (loan: SavedLoan) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SavedLoan>) => void;
  onDuplicate: (loan: SavedLoan) => void;
  onExport: (loan: SavedLoan) => void;
}

type StatusFilter = 'all' | 'active' | 'completed' | 'cancelled';

export default function LoanHistory({ 
  loans, onLoad, onDelete, onUpdate, onDuplicate, onExport 
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingLoan, setEditingLoan] = useState<SavedLoan | null>(null);
  const [viewingLoan, setViewingLoan] = useState<SavedLoan | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editClient, setEditClient] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editAmount, setEditAmount] = useState(0);
  const [editRate, setEditRate] = useState(0);
  const [editTerm, setEditTerm] = useState(0);
  const [editStartDate, setEditStartDate] = useState('');

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

  // Filter loans
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const activeLoans = loans.filter(l => l.status === 'active').length;
  const completedLoans = loans.filter(l => l.status === 'completed').length;
  const cancelledLoans = loans.filter(l => l.status === 'cancelled').length;
  const totalActiveAmount = loans
    .filter(l => l.status === 'active')
    .reduce((sum, l) => sum + l.params.amount, 0);

  const openEditModal = (loan: SavedLoan) => {
    setEditingLoan(loan);
    setEditName(loan.name);
    setEditClient(loan.clientName);
    setEditNotes(loan.notes || '');
    setEditAmount(loan.params.amount);
    setEditRate(loan.params.monthlyRate);
    setEditTerm(loan.params.term);
    setEditStartDate(loan.params.startDate);
    setOpenMenuId(null);
  };

  const handleSaveEdit = () => {
    if (!editingLoan) return;
    
    const paramsChanged = 
      editAmount !== editingLoan.params.amount ||
      editRate !== editingLoan.params.monthlyRate ||
      editTerm !== editingLoan.params.term ||
      editStartDate !== editingLoan.params.startDate;

    // Recalculate if params changed
    let newSummary = editingLoan.summary;
    if (paramsChanged) {
      const rate = editRate / 100;
      const monthlyPayment = editAmount * (rate * Math.pow(1 + rate, editTerm)) / (Math.pow(1 + rate, editTerm) - 1);
      newSummary = {
        monthlyPayment,
        totalPayment: monthlyPayment * editTerm,
        totalInterest: (monthlyPayment * editTerm) - editAmount,
      };
    }

    onUpdate(editingLoan.id, {
      name: editName,
      clientName: editClient,
      notes: editNotes,
      params: {
        amount: editAmount,
        monthlyRate: editRate,
        term: editTerm,
        startDate: editStartDate,
      },
      summary: newSummary,
    });
    setEditingLoan(null);
  };

  const handleStatusChange = (loan: SavedLoan, status: 'active' | 'completed' | 'cancelled') => {
    onUpdate(loan.id, { status });
    setOpenMenuId(null);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Activo', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
      case 'completed':
        return { label: 'Completado', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
      case 'cancelled':
        return { label: 'Cancelado', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
      default:
        return { label: 'Desconocido', icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' };
    }
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
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-blue-400" />
          Historial de Préstamos
          <span className="text-sm font-normal text-slate-400">({filteredLoans.length})</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o cliente..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/30">
            {(['all', 'active', 'completed', 'cancelled'] as StatusFilter[]).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status === 'all' ? 'Todos' : 
                 status === 'active' ? 'Activos' :
                 status === 'completed' ? 'Completados' : 'Cancelados'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/50 rounded-xl border border-blue-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-white">{loans.length}</p>
          <p className="text-xs text-slate-400">Total Préstamos</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-green-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{activeLoans}</p>
          <p className="text-xs text-slate-400">Activos</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-blue-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{completedLoans}</p>
          <p className="text-xs text-slate-400">Completados</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-yellow-500/20 p-4 text-center">
          <p className="text-lg font-bold text-yellow-400">Bs. {formatCurrency(totalActiveAmount)}</p>
          <p className="text-xs text-slate-400">Monto Activo</p>
        </div>
      </div>

      {/* Loan Cards */}
      {filteredLoans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No se encontraron préstamos con los filtros actuales</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLoans.map((loan) => {
            const statusConfig = getStatusConfig(loan.status);
            const StatusIcon = statusConfig.icon;
            const paidCount = loan.payments.length;
            const totalQuotas = loan.params.term;
            const progress = totalQuotas > 0 ? (paidCount / totalQuotas) * 100 : 0;

            return (
              <div
                key={loan.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border p-5 hover:border-blue-500/40 transition-all relative ${
                  loan.status === 'cancelled' ? 'opacity-60' : ''
                } ${statusConfig.border}`}
              >
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusConfig.bg} ${statusConfig.border} border ${statusConfig.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </div>

                {/* Header */}
                <div className="pr-20 mb-3">
                  <h3 className="text-white font-semibold truncate">{loan.name}</h3>
                  <p className="text-sm text-blue-300 truncate">{loan.clientName}</p>
                </div>

                {/* Progress bar */}
                {loan.status === 'active' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Progreso</span>
                      <span className="text-white">{paidCount}/{totalQuotas} cuotas</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-1.5 mb-4">
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
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Creado: {formatDate(loan.createdAt)}</span>
                    {loan.updatedAt && <span>Editado: {formatDate(loan.updatedAt)}</span>}
                  </div>
                  {loan.notes && (
                    <div className="mt-2 p-2 bg-slate-900/30 rounded-lg">
                      <p className="text-xs text-slate-400 italic truncate">📝 {loan.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onLoad(loan)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs text-blue-300 hover:bg-blue-500/30 transition-all"
                    title="Cargar préstamo"
                  >
                    <Eye className="w-3 h-3" /> Cargar
                  </button>
                  <button
                    onClick={() => setViewingLoan(loan)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-xs text-slate-300 hover:bg-slate-700 transition-all"
                    title="Ver detalles"
                  >
                    <FileText className="w-3 h-3" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === loan.id ? null : loan.id)}
                      className="flex items-center justify-center px-2 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 hover:bg-slate-700 transition-all"
                      title="Más acciones"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === loan.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenMenuId(null)}
                        ></div>
                        <div className="absolute right-0 bottom-full mb-1 w-48 bg-slate-800 border border-slate-600/50 rounded-xl shadow-xl z-20 overflow-hidden">
                          <button
                            onClick={() => openEditModal(loan)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition-all"
                          >
                            <Edit3 className="w-4 h-4 text-blue-400" />
                            Editar préstamo
                          </button>
                          <button
                            onClick={() => { onDuplicate(loan); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition-all"
                          >
                            <Copy className="w-4 h-4 text-purple-400" />
                            Duplicar
                          </button>
                          <button
                            onClick={() => { onExport(loan); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition-all"
                          >
                            <Download className="w-4 h-4 text-green-400" />
                            Exportar JSON
                          </button>
                          
                          <div className="border-t border-slate-700/50"></div>
                          <p className="px-4 py-1.5 text-xs text-slate-500 font-semibold">Cambiar estado</p>
                          
                          {loan.status !== 'active' && (
                            <button
                              onClick={() => handleStatusChange(loan, 'active')}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-green-400 hover:bg-green-500/10 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Marcar activo
                            </button>
                          )}
                          {loan.status !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(loan, 'completed')}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10 transition-all"
                            >
                              <FileText className="w-4 h-4" />
                              Marcar completado
                            </button>
                          )}
                          {loan.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(loan, 'cancelled')}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancelar préstamo
                            </button>
                          )}

                          <div className="border-t border-slate-700/50"></div>
                          <button
                            onClick={() => { setConfirmDeleteId(loan.id); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Portfolio Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-md font-semibold text-white mb-4">📊 Resumen del Portafolio</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
          <div className="text-center">
            <p className="text-xs text-slate-400">Pagos Registrados</p>
            <p className="text-2xl font-bold text-cyan-400">
              {loans.reduce((sum, l) => sum + l.payments.length, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingLoan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-blue-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">📋 Detalles del Préstamo</h3>
              <button
                onClick={() => setViewingLoan(null)}
                className="p-1 hover:bg-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/30 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Nombre</p>
                <p className="text-white font-medium">{viewingLoan.name}</p>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Cliente</p>
                <p className="text-white font-medium">{viewingLoan.clientName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Monto</p>
                  <p className="text-white font-semibold">Bs. {formatCurrency(viewingLoan.params.amount)}</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Tasa mensual</p>
                  <p className="text-yellow-400 font-semibold">{viewingLoan.params.monthlyRate}%</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Plazo</p>
                  <p className="text-white font-semibold">{viewingLoan.params.term} meses</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Cuota mensual</p>
                  <p className="text-green-400 font-semibold">Bs. {formatCurrency(viewingLoan.summary.monthlyPayment)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Total a pagar</p>
                  <p className="text-white font-semibold">Bs. {formatCurrency(viewingLoan.summary.totalPayment)}</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Interés total</p>
                  <p className="text-red-400 font-semibold">Bs. {formatCurrency(viewingLoan.summary.totalInterest)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Fecha inicio</p>
                  <p className="text-white font-medium">{formatDate(viewingLoan.params.startDate)}</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Estado</p>
                  <p className={`font-medium ${getStatusConfig(viewingLoan.status).color}`}>
                    {getStatusConfig(viewingLoan.status).label}
                  </p>
                </div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Pagos registrados</p>
                <p className="text-white font-medium">{viewingLoan.payments.length} de {viewingLoan.params.term} cuotas</p>
              </div>
              {viewingLoan.notes && (
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Notas</p>
                  <p className="text-slate-300 text-sm">{viewingLoan.notes}</p>
                </div>
              )}
              <div className="bg-slate-900/30 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Creado</p>
                <p className="text-white font-medium">{new Date(viewingLoan.createdAt).toLocaleString('es-BO')}</p>
                {viewingLoan.updatedAt && (
                  <>
                    <p className="text-xs text-slate-400 mb-1 mt-2">Última edición</p>
                    <p className="text-white font-medium">{new Date(viewingLoan.updatedAt).toLocaleString('es-BO')}</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { onLoad(viewingLoan); setViewingLoan(null); }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Cargar préstamo
              </button>
              <button
                onClick={() => { openEditModal(viewingLoan); setViewingLoan(null); }}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingLoan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-blue-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                Editar Préstamo
              </h3>
              <button
                onClick={() => setEditingLoan(null)}
                className="p-1 hover:bg-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Nombre del préstamo</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Nombre del cliente</label>
                <input
                  type="text"
                  value={editClient}
                  onChange={(e) => setEditClient(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <p className="text-xs text-yellow-400 mb-3 flex items-center gap-1">
                  ⚠️ Modificar los parámetros recalculará la tabla de amortización
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Monto (Bs.)</label>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      min={100}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Tasa mensual (%)</label>
                    <input
                      type="number"
                      value={editRate}
                      onChange={(e) => setEditRate(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      min={0.1}
                      max={50}
                      step={0.5}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Plazo (meses)</label>
                    <input
                      type="number"
                      value={editTerm}
                      onChange={(e) => setEditTerm(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      min={1}
                      max={360}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Fecha inicio</label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-1 block">Notas</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Observaciones del préstamo..."
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-1 block">Estado</label>
                <div className="flex gap-2">
                  {(['active', 'completed', 'cancelled'] as const).map(status => {
                    const config = getStatusConfig(status);
                    return (
                      <button
                        key={status}
                        onClick={() => onUpdate(editingLoan.id, { status })}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                          editingLoan.status === status
                            ? `${config.bg} ${config.border} ${config.color}`
                            : 'bg-slate-700/50 border-slate-600/50 text-slate-400'
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Guardar cambios
              </button>
              <button
                onClick={() => setEditingLoan(null)}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-red-500/30">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">¿Eliminar préstamo?</h3>
              <p className="text-sm text-slate-400 mb-6">
                Esta acción no se puede deshacer. Se perderán todos los datos del préstamo incluyendo pagos registrados.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onDelete(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600"
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
