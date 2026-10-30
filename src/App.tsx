import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardSaaS from './components/DashboardSaaS';
import LoanCalculator from './components/LoanCalculator';
import Login from './components/Login';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoanParams, AmortizationRow, SavedLoan, PaymentRecord } from './types';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [savedLoans, setSavedLoans] = useState<SavedLoan[]>([]);

  // Load saved loans from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('savedLoans');
    if (stored) {
      setSavedLoans(JSON.parse(stored));
    }
  }, []);

  // Save loans to localStorage
  useEffect(() => {
    localStorage.setItem('savedLoans', JSON.stringify(savedLoans));
  }, [savedLoans]);

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardSaaS loans={savedLoans} />;
      case 'calculator':
        return <LoanCalculator 
          onCalculate={(params) => console.log('Calculate', params)} 
          defaultParams={{ amount: 1000, monthlyRate: 10, term: 12, startDate: new Date().toISOString().split('T')[0] }}
        />;
      default:
        return (
          <div className="empty-state">
            <div className="empty-state-icon">🚧</div>
            <h3 className="empty-state-title">En Construcción</h3>
            <p className="empty-state-description">
              Esta sección estará disponible próximamente
            </p>
          </div>
        );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-content">
        <Topbar />
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
