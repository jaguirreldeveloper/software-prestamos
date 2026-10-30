import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

// Simulated users database
const USERS = [
  { id: '1', name: 'Admin Principal', email: 'admin@prestamos.com', password: 'admin123', role: 'admin' as UserRole },
  { id: '2', name: 'Gerente de Cartera', email: 'gerente@prestamos.com', password: 'gerente123', role: 'manager' as UserRole },
  { id: '3', name: 'Operador', email: 'operador@prestamos.com', password: 'operador123', role: 'operator' as UserRole },
  { id: '4', name: 'Solo Lectura', email: 'viewer@prestamos.com', password: 'viewer123', role: 'viewer' as UserRole },
];

// Permissions by role
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'], // All permissions
  manager: ['loans.create', 'loans.edit', 'loans.delete', 'loans.view', 'payments.register', 'reports.view', 'users.view'],
  operator: ['loans.create', 'loans.edit', 'loans.view', 'payments.register', 'reports.view'],
  viewer: ['loans.view', 'reports.view'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    const foundUser = USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role];
    return permissions.includes('*') || permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
