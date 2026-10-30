import { 
  Calculator, 
  LayoutDashboard, 
  Table, 
  Calendar, 
  CreditCard, 
  Zap, 
  FolderOpen, 
  Scale, 
  GitBranch, 
  FileText, 
  TrendingUp, 
  Upload, 
  BarChart3, 
  RefreshCw,
  Settings,
  LogOut,
  User,
  Users,
  AlertTriangle,
  Palette
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBrand } from '../contexts/BrandContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const { brand } = useBrand();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Principal' },
    { id: 'calculator', label: 'Calculadora', icon: Calculator, section: 'Principal' },
    { id: 'table', label: 'Tabla Amortización', icon: Table, section: 'Principal' },
    { id: 'calendar', label: 'Calendario', icon: Calendar, section: 'Gestión' },
    { id: 'payments', label: 'Pagos', icon: CreditCard, section: 'Gestión' },
    { id: 'history', label: 'Historial', icon: FolderOpen, section: 'Gestión' },
    { id: 'financial', label: 'Métricas', icon: TrendingUp, section: 'Análisis' },
    { id: 'reports', label: 'Reportes', icon: BarChart3, section: 'Análisis' },
    { id: 'simulator', label: 'Simulador', icon: Zap, section: 'Herramientas' },
    { id: 'comparator', label: 'Comparador', icon: Scale, section: 'Herramientas' },
    { id: 'renegotiation', label: 'Renegociar', icon: RefreshCw, section: 'Herramientas' },
    { id: 'import', label: 'Importar', icon: Upload, section: 'Herramientas' },
    { id: 'guarantors', label: 'Garantes', icon: Users, section: 'Herramientas' },
    { id: 'penalties', label: 'Penalidades', icon: AlertTriangle, section: 'Herramientas' },
  ];

  const secondaryItems = [
    { id: 'commits', label: 'Commits', icon: GitBranch },
    { id: 'plan', label: 'Plan', icon: FileText },
  ];

  // Agrupar por sección
  const sections = navigationItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-3">
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.appName} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-xl">💰</span>
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {brand.appName}
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {brand.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} className="mb-6">
            <div className="px-6 mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {section}
              </h3>
            </div>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`sidebar-nav-item w-[calc(100%-1rem)] ${
                    activeTab === item.id ? 'active' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}

        {/* Secondary Navigation */}
        <div className="border-t border-[var(--border-primary)] pt-4 mt-4">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`sidebar-nav-item w-[calc(100%-1rem)] ${
                  activeTab === item.id ? 'active' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => onTabChange('brand')}
            className={`sidebar-nav-item w-[calc(100%-1rem)] ${
              activeTab === 'brand' ? 'active' : ''
            }`}
          >
            <Palette className="w-5 h-5" />
            <span>Marca</span>
          </button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-[var(--border-primary)] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
            <User className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'Usuario'}
            </p>
            <p className="text-xs truncate capitalize" style={{ color: 'var(--text-tertiary)' }}>
              {user?.role || 'viewer'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary flex-1 text-xs">
            <Settings className="w-4 h-4" />
            Ajustes
          </button>
          <button onClick={logout} className="btn btn-secondary text-xs" title="Cerrar sesión">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
