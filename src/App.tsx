import { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './components/Login';
import InteractiveTour from './components/InteractiveTour';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrandProvider } from './contexts/BrandContext';
import { LoanParams, AmortizationRow, SavedLoan, PaymentRecord } from './types';
import { calculateAmortization } from './utils/calculations';

// Lazy load components for better performance
const DashboardSaaS = lazy(() => import('./components/DashboardSaaS'));
const LoanCalculator = lazy(() => import('./components/LoanCalculator'));
const AmortizationTable = lazy(() => import('./components/AmortizationTable'));
const PaymentCalendar = lazy(() => import('./components/PaymentCalendar'));
const PaymentRegister = lazy(() => import('./components/PaymentRegister'));
const LoanHistory = lazy(() => import('./components/LoanHistory'));
const GuarantorSystem = lazy(() => import('./components/GuarantorSystem'));
const PenaltyCalculator = lazy(() => import('./components/PenaltyCalculator'));
const BrandSettings = lazy(() => import('./components/BrandSettings'));

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [savedLoans, setSavedLoans] = useState<SavedLoan[]>([]);
  const [amortizationData, setAmortizationData] = useState<AmortizationRow[]>([]);
  const [summary, setSummary] = useState({
    monthlyPayment: 0,
    monthlyPaymentRounded: 0,
    totalPayment: 0,
    totalRoundedPayment: 0,
    totalInterest: 0,
  });
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [moraRate, setMoraRate] = useState(2);
  const [loanParams, setLoanParams] = useState<LoanParams>({
    amount: 1000,
    monthlyRate: 10,
    term: 12,
    startDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const stored = localStorage.getItem('savedLoans');
    if (stored) {
      setSavedLoans(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedLoans', JSON.stringify(savedLoans));
  }, [savedLoans]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleCalculate = (params: LoanParams) => {
    setLoanParams(params);
    const result = calculateAmortization(params);
    setAmortizationData(result.rows);
    setSummary({
      monthlyPayment: result.monthlyPayment,
      monthlyPaymentRounded: result.monthlyPaymentRounded,
      totalPayment: result.totalPayment,
      totalRoundedPayment: result.totalRoundedPayment,
      totalInterest: result.totalInterest,
    });
  };

  const handleSaveLoan = (name: string, clientName: string) => {
    const newLoan: SavedLoan = {
      id: `loan_${Date.now()}`,
      name,
      clientName,
      params: loanParams,
      summary,
      createdAt: new Date().toISOString(),
      payments: [],
      status: 'active',
    };
    setSavedLoans([...savedLoans, newLoan]);
  };

  const handleLoadLoan = (loan: SavedLoan) => {
    setLoanParams(loan.params);
    const result = calculateAmortization(loan.params);
    setAmortizationData(result.rows);
    setSummary({
      monthlyPayment: result.monthlyPayment,
      monthlyPaymentRounded: result.monthlyPaymentRounded,
      totalPayment: result.totalPayment,
      totalRoundedPayment: result.totalRoundedPayment,
      totalInterest: result.totalInterest,
    });
    setActiveTab('table');
  };

  const handleDeleteLoan = (id: string) => {
    setSavedLoans(savedLoans.filter(l => l.id !== id));
  };

  const handleUpdateLoan = (id: string, updates: Partial<SavedLoan>) => {
    setSavedLoans(savedLoans.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const handleDuplicateLoan = (loan: SavedLoan) => {
    const newLoan: SavedLoan = {
      ...loan,
      id: `loan_${Date.now()}`,
      name: `${loan.name} (Copia)`,
      createdAt: new Date().toISOString(),
    };
    setSavedLoans([...savedLoans, newLoan]);
  };

  const handleExportLoan = (loan: SavedLoan) => {
    const dataStr = JSON.stringify(loan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${loan.name.replace(/\s+/g, '_')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleRegisterPayment = (payment: PaymentRecord) => {
    setPayments([...payments, payment]);
    const updatedRows = amortizationData.map((row: AmortizationRow) => 
      row.number === payment.quotaNumber 
        ? { ...row, isPaid: true, paidDate: payment.paidDate }
        : row
    );
    setAmortizationData(updatedRows);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardSaaS loans={savedLoans} onNavigate={setActiveTab} />;
      case 'calculator':
        return <LoanCalculator onCalculate={handleCalculate} defaultParams={loanParams} onSave={handleSaveLoan} />;
      case 'table':
        return <AmortizationTable rows={amortizationData} summary={summary} />;
      case 'calendar':
        return <PaymentCalendar rows={amortizationData} />;
      case 'payments':
        return <PaymentRegister rows={amortizationData} payments={payments} onRegisterPayment={handleRegisterPayment} monthlyPayment={summary.monthlyPayment} />;
      case 'history':
        return <LoanHistory loans={savedLoans} onLoad={handleLoadLoan} onDelete={handleDeleteLoan} onUpdate={handleUpdateLoan} onDuplicate={handleDuplicateLoan} onExport={handleExportLoan} onNavigate={setActiveTab} />;
      case 'tour':
        return <InteractiveTour />;
      case 'guarantors':
        return <GuarantorSystem />;
      case 'penalties':
        return <PenaltyCalculator loans={savedLoans} moraRate={moraRate} />;
      case 'brand':
        return <BrandSettings />;
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
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p style={{ color: 'var(--text-tertiary)' }}>Cargando...</p>
              </div>
            </div>
          }>
            {renderContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrandProvider>
          <AppContent />
        </BrandProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
