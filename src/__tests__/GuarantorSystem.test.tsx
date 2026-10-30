import { render, screen, fireEvent } from '@testing-library/react';
import GuarantorSystem from '../components/GuarantorSystem';

describe('GuarantorSystem Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render guarantor system', () => {
    render(<GuarantorSystem />);
    
    expect(screen.getByText('Sistema de Garantes')).toBeInTheDocument();
    expect(screen.getByText('Nuevo Garante')).toBeInTheDocument();
  });

  it('should show empty state when no guarantors', () => {
    render(<GuarantorSystem />);
    
    expect(screen.getByText('No hay garantes registrados')).toBeInTheDocument();
  });

  it('should show form when "Nuevo Garante" clicked', () => {
    render(<GuarantorSystem />);
    
    const addButton = screen.getByText('Nuevo Garante');
    fireEvent.click(addButton);
    
    expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('12345678')).toBeInTheDocument();
  });

  it('should validate required fields', () => {
    render(<GuarantorSystem />);
    
    const addButton = screen.getByText('Nuevo Garante');
    fireEvent.click(addButton);
    
    const saveButton = screen.getByText('Guardar Garante');
    fireEvent.click(saveButton);
    
    expect(screen.getByText(/Por favor completa los campos obligatorios/i)).toBeInTheDocument();
  });

  it('should add guarantor with valid data', () => {
    render(<GuarantorSystem />);
    
    const addButton = screen.getByText('Nuevo Garante');
    fireEvent.click(addButton);
    
    const nameInput = screen.getByPlaceholderText('Juan Pérez');
    const ciInput = screen.getByPlaceholderText('12345678');
    const incomeInput = screen.getByPlaceholderText('5000');
    
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(ciInput, { target: { value: '12345678' } });
    fireEvent.change(incomeInput, { target: { value: '5000' } });
    
    const saveButton = screen.getByText('Guardar Garante');
    fireEvent.click(saveButton);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('CI: 12345678')).toBeInTheDocument();
  });

  it('should delete guarantor with confirmation', () => {
    // Mock confirm
    window.confirm = jest.fn(() => true);
    
    render(<GuarantorSystem />);
    
    // Add a guarantor first
    const addButton = screen.getByText('Nuevo Garante');
    fireEvent.click(addButton);
    
    fireEvent.change(screen.getByPlaceholderText('Juan Pérez'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('12345678'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByPlaceholderText('5000'), { target: { value: '5000' } });
    fireEvent.click(screen.getByText('Guardar Garante'));
    
    // Delete the guarantor
    const deleteButtons = screen.getAllByTitle('');
    const deleteButton = deleteButtons.find(btn => btn.querySelector('svg.lucide-trash-2'));
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de eliminar este garante?');
    }
  });

  it('should show metrics', () => {
    render(<GuarantorSystem />);
    
    expect(screen.getByText('Total Garantes')).toBeInTheDocument();
    expect(screen.getByText('Ingreso Promedio')).toBeInTheDocument();
    expect(screen.getByText('Garantias Activas')).toBeInTheDocument();
  });
});
