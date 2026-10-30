import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, Lock, AlertCircle, Shield } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    if (!success) {
      setError('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
    }
  };

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fadeIn" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl" style={{ background: 'var(--gradient-primary)' }}>
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Sistema de Préstamos
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
            Inicia sesión para continuar
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="input pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-11"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="badge badge-danger w-full p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full py-3"
            >
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--accent-primary)' }}
            >
              {showCredentials ? '🔒 Ocultar' : '🔑 Ver'} credenciales de demostración
            </button>

            {showCredentials && (
              <div className="mt-4 space-y-2 animate-fadeIn">
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  Click para autocompletar:
                </p>
                
                <button
                  onClick={() => fillDemoCredentials('admin@prestamos.com', 'admin123')}
                  className="w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--accent-secondary)' }}>
                      👑 Admin
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    admin@prestamos.com / admin123
                  </p>
                </button>

                <button
                  onClick={() => fillDemoCredentials('gerente@prestamos.com', 'gerente123')}
                  className="w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      💼 Gerente
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    gerente@prestamos.com / gerente123
                  </p>
                </button>

                <button
                  onClick={() => fillDemoCredentials('operador@prestamos.com', 'operador123')}
                  className="w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" style={{ color: 'var(--accent-success)' }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--accent-success)' }}>
                      ⚙️ Operador
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    operador@prestamos.com / operador123
                  </p>
                </button>

                <button
                  onClick={() => fillDemoCredentials('viewer@prestamos.com', 'viewer123')}
                  className="w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(107, 114, 128, 0.1)', border: '1px solid rgba(107, 114, 128, 0.2)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                      👁️ Solo Lectura
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    viewer@prestamos.com / viewer123
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          Sistema de Préstamos v3.0 — Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
