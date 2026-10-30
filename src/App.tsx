import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardSaaS from './components/DashboardSaaS';
import LoanCalculator from './components/LoanCalculator';
import AmortizationTable from './components/AmortizationTable';
import PaymentCalendar from './components/PaymentCalendar';
import PaymentRegister from './components/PaymentRegister';
import LoanHistory from './components/LoanHistory';
import Login from './components/Login';
import InteractiveTour from './components/InteractiveTour';
import GuarantorSystem from './components/GuarantorSystem';
import PenaltyCalculator from './components/PenaltyCalculator';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoanParams, AmortizationRow, SavedLoan, PaymentRecord } from './types';

function calculateAmortization(params: LoanParams) {
  const { amount, monthlyRate, term, startDate } = params;
  const rate = monthlyRate / 100;
  const monthlyPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
  const monthlyPaymentRounded = Math.ceil(monthlyPayment);
  
  const rows: AmortizationRow[] = [];
  let balance = amount;
  let totalInterest = 0;
  let totalPayment = 0;
  let totalRoundedPayment = 0;
  let accumulatedDifference = 0;

  for (let i = 1; i <= term; i++) {
    const interest = Math.round(balance * rate * 100) / 100;
    let capital: number;
    let payment: number;
    let roundedPayment: number;
    
    if (i === term) {
      capital = Math.round(balance * 100) / 100;
      payment = Math.round((capital + interest) * 100) / 100;
      roundedPayment = Math.round((payment - accumulatedDifference) * 100) / 100;
    } else {
      capital = Math.round((monthlyPayment - interest) * 100) / 100;
      payment = Math.round(monthlyPayment * 100) / 100;
      roundedPayment = monthlyPaymentRounded;
    }
    
    const difference = Math.round((roundedPayment - payment) * 100) / 100;
    accumulatedDifference += difference;
    accumulatedDifference = Math.round(accumulatedDifference * 100) / 100;
    
    const newBalance = Math.round((balance - capital) * 100) / 100;
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    totalInterest += interest;
    totalPayment += payment;
    totalRoundedPayment += roundedPayment;

    rows.push({
      number: i,
      initialBalance: Math.round(balance * 100) / 100,
      payment: payment,
      interest: interest,
      capital: capital,
      finalBalance: newBalance,
      paymentDate: paymentDate.toISOString().split('T')[0],
      isPaid: false,
      roundedPayment: roundedPayment,
      roundingDifference: difference,
      accumulatedRounding: accumulatedDifference,
    });

    balance = newBalance;
  }

  return { 
    monthlyPayment: Math.round(monthlyPayment * 100) / 100, 
    monthlyPaymentRounded: monthlyPaymentRounded,
    totalPayment: Math.round(totalPayment * 100) / 100, 
    totalRoundedPayment: Math.round(totalRoundedPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100, 
    rows 
  };
}

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
        return <DashboardSaaS loans={savedLoans} />;
      case 'calculator':
        return <LoanCalculator onCalculate={handleCalculate} defaultParams={loanParams} onSave={handleSaveLoan} />;
      case 'table':
        return <AmortizationTable rows={amortizationData} summary={summary} />;
      case 'calendar':
        return <PaymentCalendar rows={amortizationData} />;
      case 'payments':
        return <PaymentRegister rows={amortizationData} payments={payments} onRegisterPayment={handleRegisterPayment} monthlyPayment={summary.monthlyPayment} />;
      case 'history':
        return <LoanHistory loans={savedLoans} onLoad={handleLoadLoan} onDelete={handleDeleteLoan} onUpdate={handleUpdateLoan} onDuplicate={handleDuplicateLoan} onExport={handleExportLoan} />;
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
