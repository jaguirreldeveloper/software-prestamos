import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Sistema de Préstamos</h1>
          <p className="text-sm text-blue-300 mt-1">Inicia sesión para continuar</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-lg shadow-lg transition-all"
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full text-sm text-blue-400 hover:text-blue-300 transition-all"
            >
              {showCredentials ? '🔒 Ocultar' : '🔑 Ver'} credenciales de demostración
            </button>

            {showCredentials && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-slate-400 mb-2">Click para autocompletar:</p>
                
                <button
                  onClick={() => fillDemoCredentials('admin@prestamos.com', 'admin123')}
                  className="w-full text-left p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all"
                >
                  <p className="text-xs font-semibold text-purple-300">👑 Admin</p>
                  <p className="text-xs text-slate-400">admin@prestamos.com / admin123</p>
                </button>

                <button
                  onClick={() => fillDemoCredentials('gerente@prestamos.com', 'gerente123')}
                  className="w-full text-left p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-all"
                >
                  <p className="text-xs font-semibold text-blue-300">💼 Gerente</p>
                  <p className="text-xs text-slate-400">gerente@prestamos.com / gerente123</p>
                </button>

                <button
                  onClick={() => fillDemoCredentials('operador@prestamos.com', 'operador123')}
                  className="w-full text-left p-2 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all"
                >
                  <p className="text-xs font-semibold text-green-300">⚙️ Operador</p>
                  <p className="text-xs text-slate-400">operador@prestamos.com / operador123</p>
                </button>

                <button
                  onClick={() => fillDemoCredentials('viewer@prestamos.com', 'viewer123')}
                  className="w-full text-left p-2 bg-slate-500/10 border border-slate-500/30 rounded-lg hover:bg-slate-500/20 transition-all"
                >
                  <p className="text-xs font-semibold text-slate-300">👁️ Solo Lectura</p>
                  <p className="text-xs text-slate-400">viewer@prestamos.com / viewer123</p>
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Sistema de Préstamos v2.0 — Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
