import { useState } from 'react';
import { Users, UserPlus, Trash2, Edit2 } from 'lucide-react';

interface Guarantor {
  id: string;
  name: string;
  ci: string;
  phone: string;
  email: string;
  income: number;
  existingGuarantees: number;
}

export default function GuarantorSystem() {
  const [guarantors, setGuarantors] = useState<Guarantor[]>(() => {
    const saved = localStorage.getItem('guarantors');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    ci: '',
    phone: '',
    email: '',
    income: 0,
    existingGuarantees: 0,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const saveGuarantors = (newGuarantors: Guarantor[]) => {
    setGuarantors(newGuarantors);
    localStorage.setItem('guarantors', JSON.stringify(newGuarantors));
  };

  const handleSubmit = () => {
    if (!form.name || !form.ci || !form.income) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    if (editingId) {
      const updated = guarantors.map(g => g.id === editingId ? { ...g, ...form } : g);
      saveGuarantors(updated);
      setEditingId(null);
    } else {
      const newGuarantor: Guarantor = {
        id: `guarantor_${Date.now()}`,
        ...form,
      };
      saveGuarantors([...guarantors, newGuarantor]);
    }

    setForm({ name: '', ci: '', phone: '', email: '', income: 0, existingGuarantees: 0 });
    setShowForm(false);
  };

  const handleEdit = (guarantor: Guarantor) => {
    setForm({
      name: guarantor.name,
      ci: guarantor.ci,
      phone: guarantor.phone,
      email: guarantor.email,
      income: guarantor.income,
      existingGuarantees: guarantor.existingGuarantees,
    });
    setEditingId(guarantor.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este garante?')) {
      saveGuarantors(guarantors.filter(g => g.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Sistema de Garantes
          </h1>
          <p style={{ color: 'var(--text-tertiary)' }}>
            Gestiona los garantes de tus préstamos
          </p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', ci: '', phone: '', email: '', income: 0, existingGuarantees: 0 }); }} className="btn btn-primary">
          <UserPlus className="w-4 h-4" />
          Nuevo Garante
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Garantes</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {guarantors.length}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Ingreso Promedio</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-success)' }}>
                Bs. {formatCurrency(guarantors.length > 0 ? guarantors.reduce((s, g) => s + g.income, 0) / guarantors.length : 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Garantias Activas</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
                {guarantors.reduce((s, g) => s + g.existingGuarantees, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {editingId ? 'Editar Garante' : 'Nuevo Garante'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre completo *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input" placeholder="Juan Pérez" />
            </div>
            <div>
              <label className="label">CI / NIT *</label>
              <input type="text" value={form.ci} onChange={(e) => setForm({...form, ci: e.target.value})} className="input" placeholder="12345678" />
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="input" placeholder="+591 70000000" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input" placeholder="email@ejemplo.com" />
            </div>
            <div>
              <label className="label">Ingreso mensual (Bs.) *</label>
              <input type="number" value={form.income || ''} onChange={(e) => setForm({...form, income: Number(e.target.value)})} className="input" placeholder="5000" />
            </div>
            <div>
              <label className="label">Garantías existentes</label>
              <input type="number" value={form.existingGuarantees} onChange={(e) => setForm({...form, existingGuarantees: Number(e.target.value)})} className="input" placeholder="0" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSubmit} className="btn btn-primary">
              {editingId ? 'Actualizar' : 'Guardar'} Garante
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Garantes */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Lista de Garantes
        </h2>
        {guarantors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3 className="empty-state-title">No hay garantes registrados</h3>
            <p className="empty-state-description">
              Agrega garantes para respaldar los préstamos
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {guarantors.map((guarantor) => (
              <div key={guarantor.id} className="p-4 rounded-xl flex items-center justify-between" style={{ border: '1px solid var(--border-primary)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                    <span className="text-white font-bold text-lg">{guarantor.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{guarantor.name}</p>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>CI: {guarantor.ci} | Ingreso: Bs. {formatCurrency(guarantor.income)}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {guarantor.phone ? '📞 ' + guarantor.phone + ' | ' : ''}
                      {guarantor.email ? '📧 ' + guarantor.email + ' | ' : ''}
                      {'Garantias: ' + guarantor.existingGuarantees}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(guarantor)} className="btn btn-secondary">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(guarantor.id)} className="btn btn-secondary" style={{ color: 'var(--accent-danger)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
