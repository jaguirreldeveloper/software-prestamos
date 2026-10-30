import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TourStep {
  title: string;
  content: string;
  icon: string;
}

const tourSteps: TourStep[] = [
  {
    title: '¡Bienvenido!',
    content: 'Este es el Sistema de Gestión de Préstamos. Te guiaremos por las principales funcionalidades.',
    icon: '👋',
  },
  {
    title: 'Dashboard',
    content: 'El Dashboard te muestra un resumen general de tu cartera de préstamos con métricas clave como monto total, intereses y préstamos activos.',
    icon: '📊',
  },
  {
    title: 'Calculadora',
    content: 'La Calculadora te permite calcular préstamos con amortización francesa de forma rápida y precisa. Configura monto, tasa y plazo.',
    icon: '🧮',
  },
  {
    title: 'Tabla de Amortización',
    content: 'Visualiza el detalle completo de cada cuota: saldo inicial, interés, capital y saldo final. Puedes exportar a Excel, Word o PDF.',
    icon: '📋',
  },
  {
    title: 'Calendario de Pagos',
    content: 'Mantén el control de todos los pagos programados. Visualiza pagos pendientes, próximos y vencidos en un solo lugar.',
    icon: '📅',
  },
  {
    title: 'Historial',
    content: 'Gestiona todos tus préstamos guardados. Puedes editar, duplicar, exportar y cambiar el estado de cada préstamo.',
    icon: '📁',
  },
  {
    title: '¡Listo!',
    content: 'Ahora conoces las funcionalidades principales. Explora el menú lateral para descubrir más herramientas como simuladores, comparadores y reportes.',
    icon: '🎉',
  },
];

export default function InteractiveTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('tourCompleted');
    if (!tourCompleted) {
      setTimeout(() => setIsOpen(true), 1500);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('tourCompleted', 'true');
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setCurrentStep(0); }}
        className="btn btn-secondary"
        title="Ver tour interactivo"
      >
        🎓 Tour
      </button>
    );
  }

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="card max-w-lg w-full mx-4 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{step.icon}</span>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {step.title}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Paso {currentStep + 1} de {tourSteps.length}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="btn btn-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          {step.content}
        </p>

        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 rounded-full transition-all"
              style={{
                background: idx <= currentStep ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn btn-secondary flex-1 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <button onClick={handleNext} className="btn btn-primary flex-1">
            {currentStep === tourSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
            {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
