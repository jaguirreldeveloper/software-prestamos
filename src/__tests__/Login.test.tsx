import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
import { AuthProvider } from '../contexts/AuthContext';

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render login form', () => {
    renderWithAuth(<Login />);
    
    expect(screen.getByText('Sistema de Préstamos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('should show demo credentials toggle', () => {
    renderWithAuth(<Login />);
    
    const toggleButton = screen.getByText(/Ver credenciales de demostración/i);
    expect(toggleButton).toBeInTheDocument();
  });

  it('should show demo credentials when toggled', () => {
    renderWithAuth(<Login />);
    
    const toggleButton = screen.getByText(/Ver credenciales de demostración/i);
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('admin@prestamos.com')).toBeInTheDocument();
    expect(screen.getByText('gerente@prestamos.com')).toBeInTheDocument();
  });

  it('should auto-fill credentials when demo button clicked', () => {
    renderWithAuth(<Login />);
    
    const toggleButton = screen.getByText(/Ver credenciales de demostración/i);
    fireEvent.click(toggleButton);
    
    const adminButton = screen.getByText('admin@prestamos.com / admin123');
    fireEvent.click(adminButton);
    
    const emailInput = screen.getByPlaceholderText('tu@email.com') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    
    expect(emailInput.value).toBe('admin@prestamos.com');
    expect(passwordInput.value).toBe('admin123');
  });

  it('should show error message for invalid credentials', async () => {
    renderWithAuth(<Login />);
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Iniciar Sesión');
    
    fireEvent.change(emailInput, { target: { value: 'invalid@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/Credenciales incorrectas/i)).toBeInTheDocument();
  });

  it('should have required fields', () => {
    renderWithAuth(<Login />);
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
