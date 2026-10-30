import { useState, useEffect, useRef } from 'react';
import { SavedLoan } from '../types';
import { Search, X, FileText } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

interface Props {
  loans: SavedLoan[];
  onSelectLoan: (loan: SavedLoan) => void;
}

export default function GlobalSearch({ loans, onSelectLoan }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Atajo de teclado: Ctrl+K o Cmd+K para abrir búsqueda
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    setIsOpen(true);
  });

  // Atajo para cerrar: Escape
  useHotkeys('escape', () => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredLoans = loans.filter(loan => {
    const search = searchTerm.toLowerCase();
    return (
      loan.name.toLowerCase().includes(search) ||
      loan.clientName.toLowerCase().includes(search) ||
      loan.params.amount.toString().includes(search) ||
      loan.id.toLowerCase().includes(search)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredLoans.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredLoans[selectedIndex]) {
      handleSelect(filteredLoans[selectedIndex]);
    }
  };

  const handleSelect = (loan: SavedLoan) => {
    onSelectLoan(loan);
    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(0);
  };

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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-slate-400 hover:text-white hover:border-blue-500/50 transition-all"
        title="Buscar préstamos (Ctrl+K)"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Buscar...</span>
        <kbd className="hidden md:inline px-1.5 py-0.5 text-xs bg-slate-700 rounded">Ctrl+K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl border border-blue-500/30 shadow-2xl">
        {/* Input */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por nombre, cliente, monto o ID..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {filteredLoans.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">No se encontraron préstamos</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredLoans.map((loan, idx) => (
                <button
                  key={loan.id}
                  onClick={() => handleSelect(loan)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    idx === selectedIndex
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'hover:bg-slate-700/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">{loan.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          loan.status === 'active' ? 'bg-green-500/10 text-green-400' :
                          loan.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {loan.status === 'active' ? 'Activo' :
                           loan.status === 'completed' ? 'Completado' : 'Cancelado'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 ml-6">{loan.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">Bs. {formatCurrency(loan.params.amount)}</p>
                      <p className="text-xs text-slate-400">{formatDate(loan.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex gap-4">
            <span>↑↓ Navegar</span>
            <span>↵ Seleccionar</span>
            <span>esc Cerrar</span>
          </div>
          <span>{filteredLoans.length} resultados</span>
        </div>
      </div>
    </div>
  );
}
