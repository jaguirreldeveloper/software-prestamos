import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import InteractiveTour from './InteractiveTour';

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <div className="flex items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar préstamos, clientes..."
            className="input pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="btn btn-secondary relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center" style={{ background: 'var(--accent-danger)', color: 'white' }}>
            3
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Tour */}
        <InteractiveTour />
      </div>
    </header>
  );
}
