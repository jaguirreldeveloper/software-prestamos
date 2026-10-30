import { useState, useEffect } from 'react';
import LoanCalculator from './components/LoanCalculator';
import Dashboard from './components/Dashboard';
import AmortizationTable from './components/AmortizationTable';
import PaymentCalendar from './components/PaymentCalendar';
import PaymentRegister from './components/PaymentRegister';
import EarlyPaymentSimulator from './components/EarlyPaymentSimulator';
import LoanHistory from './components/LoanHistory';
import RateComparator from './components/RateComparator';
import CommitTimeline from './components/CommitTimeline';
import ProjectPlan from './components/ProjectPlan';
import FinancialDashboard from './components/FinancialDashboard';
import ExcelImport from './components/ExcelImport';
import GlobalSearch from './components/GlobalSearch';
import NotificationSystem from './components/NotificationSystem';
import Login from './components/Login';
import MonthlyReport from './components/MonthlyReport';
import LoanRenegotiation from './components/LoanRenegotiation';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoanParams, AmortizationRow, SavedLoan, PaymentRecord } from './types';
import { Calculator, LayoutDashboard, Table, Calendar, CreditCard, Zap, FolderOpen, Scale, GitBranch, FileText, TrendingUp, Upload, Sun, Moon, BarChart3, RefreshCw, LogOut, User } from 'lucide-react';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  
  // TODOS los hooks deben declararse ANTES de cualquier return condicional
  const [activeTab, setActiveTab] = useState('calculator');
  const [loanParams, setLoanParams] = useState<LoanParams>({
    amount: 1000,
    monthlyRate: 10,
    term: 12,
    startDate: new Date().toISOString().split('T')[0],
  });
  const [amortizationData, setAmortizationData] = useState<AmortizationRow[]>([]);
  const [summary, setSummary] = useState({
    monthlyPayment: 0,
    monthlyPaymentRounded: 0,
    totalPayment: 0,
    totalRoundedPayment: 0,
    totalInterest: 0,
  });
  const [savedLoans, setSavedLoans] = useState<SavedLoan[]>([]);
  const [currentLoanId, setCurrentLoanId] = useState<string>('');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [moraRate, setMoraRate] = useState(2); // 2% mensual de mora

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

  // Si no está autenticado, mostrar login (DESPUÉS de todos los hooks)
  if (!isAuthenticated) {
    return <Login />;
  }

  const handleCalculate = (params: LoanParams) => {
    setLoanParams(params);
    const data = calculateAmortization(params);
    setAmortizationData(data.rows);
    setSummary({
      monthlyPayment: data.monthlyPayment,
      monthlyPaymentRounded: data.monthlyPaymentRounded,
      totalPayment: data.totalPayment,
      totalRoundedPayment: data.totalRoundedPayment,
      totalInterest: data.totalInterest,
    });
  };

  const handleSaveLoan = (name: string, clientName: string) => {
    const id = `loan_${Date.now()}`;
    const newLoan: SavedLoan = {
      id,
      name,
      clientName,
      params: loanParams,
      summary,
      createdAt: new Date().toISOString(),
      payments: [],
      status: 'active',
    };
    setSavedLoans([...savedLoans, newLoan]);
    setCurrentLoanId(id);
  };

  const handleLoadLoan = (loan: SavedLoan) => {
    setLoanParams(loan.params);
    setSummary({
      monthlyPayment: loan.summary.monthlyPayment,
      monthlyPaymentRounded: loan.summary.monthlyPaymentRounded || loan.summary.monthlyPayment,
      totalPayment: loan.summary.totalPayment,
      totalRoundedPayment: loan.summary.totalRoundedPayment || loan.summary.totalPayment,
      totalInterest: loan.summary.totalInterest,
    });
    const data = calculateAmortization(loan.params);
    setAmortizationData(data.rows);
    setCurrentLoanId(loan.id);
    setPayments(loan.payments);
    setActiveTab('table');
  };

  const handleDeleteLoan = (id: string) => {
    setSavedLoans(savedLoans.filter(l => l.id !== id));
    if (currentLoanId === id) setCurrentLoanId('');
  };

  const handleUpdateLoan = (id: string, updates: Partial<SavedLoan>) => {
    setSavedLoans(savedLoans.map(l => 
      l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    ));
  };

  const handleDuplicateLoan = (loan: SavedLoan) => {
    const newLoan: SavedLoan = {
      ...loan,
      id: `loan_${Date.now()}`,
      name: `${loan.name} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: undefined,
      payments: [],
      status: 'active',
    };
    setSavedLoans([...savedLoans, newLoan]);
  };

  const handleExportLoan = (loan: SavedLoan) => {
    const data = JSON.stringify(loan, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prestamo_${loan.name.replace(/\s+/g, '_')}_${loan.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportLoans = (importedLoans: Array<{ params: LoanParams; name: string; clientName: string }>) => {
    const newLoans: SavedLoan[] = importedLoans.map((loan, index) => {
      const data = calculateAmortization(loan.params);
      const id = `loan_${Date.now()}_${index}`;
      return {
        id,
        name: loan.name,
        clientName: loan.clientName,
        params: loan.params,
        summary: {
          monthlyPayment: data.monthlyPayment,
          monthlyPaymentRounded: data.monthlyPaymentRounded,
          totalPayment: data.totalPayment,
          totalRoundedPayment: data.totalRoundedPayment,
          totalInterest: data.totalInterest,
        },
        createdAt: new Date().toISOString(),
        payments: [],
        status: 'active',
      };
    });
    setSavedLoans([...savedLoans, ...newLoans]);
    alert(`✅ ${newLoans.length} préstamos importados exitosamente`);
  };

  const handleRenegotiateLoan = (loanId: string, newParams: LoanParams) => {
    const data = calculateAmortization(newParams);
    setSavedLoans(savedLoans.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          params: newParams,
          summary: {
            monthlyPayment: data.monthlyPayment,
            monthlyPaymentRounded: data.monthlyPaymentRounded,
            totalPayment: data.totalPayment,
            totalRoundedPayment: data.totalRoundedPayment,
            totalInterest: data.totalInterest,
          },
          payments: [],
          status: 'active',
        };
      }
      return l;
    }));
    
    // Reload the loan
    const updatedLoan = savedLoans.find(l => l.id === loanId);
    if (updatedLoan) {
      handleLoadLoan({ ...updatedLoan, params: newParams });
    }
    
    alert('✅ Préstamo renegociado exitosamente');
  };

  const handleRegisterPayment = (payment: PaymentRecord) => {
    const newPayments = [...payments, payment];
    setPayments(newPayments);
    
    // Update amortization data
    const updatedData = amortizationData.map(row => {
      if (row.number === payment.quotaNumber) {
        return {
          ...row,
          isPaid: true,
          paidDate: payment.paidDate,
          paidAmount: payment.amount,
          extraPayment: payment.extraAmount,
        };
      }
      return row;
    });
    setAmortizationData(updatedData);

    // Update saved loan if exists
    if (currentLoanId) {
      setSavedLoans(savedLoans.map(l => 
        l.id === currentLoanId ? { ...l, payments: newPayments } : l
      ));
    }
  };

  const tabs = [
    { id: 'calculator', label: 'Calculadora', icon: Calculator },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'financial', label: 'Métricas', icon: TrendingUp },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'table', label: 'Tabla', icon: Table },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'simulator', label: 'Pago Anticipado', icon: Zap },
    { id: 'renegotiation', label: 'Renegociar', icon: RefreshCw },
    { id: 'comparator', label: 'Comparador', icon: Scale },
    { id: 'history', label: 'Historial', icon: FolderOpen },
    { id: 'import', label: 'Importar', icon: Upload },
    { id: 'commits', label: 'Commits', icon: GitBranch },
    { id: 'plan', label: 'Plan', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Sistema de Préstamos</h1>
                <p className="text-xs text-blue-300">Gestión completa de amortización</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-400 hover:text-white hover:border-blue-500/50 transition-all"
                title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <GlobalSearch loans={savedLoans} onSelectLoan={handleLoadLoan} />
              <NotificationSystem loans={savedLoans} />
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg">
                <User className="w-4 h-4 text-blue-400" />
                <div className="hidden md:block">
                  <p className="text-xs text-white font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <div className="text-right hidden md:block">
                <p className="text-sm text-blue-300">Tasa Mora</p>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={moraRate}
                    onChange={(e) => setMoraRate(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-slate-900/50 border border-slate-600/50 rounded text-white text-sm text-center focus:outline-none focus:border-red-500"
                    min={0}
                    max={20}
                    step={0.5}
                  />
                  <span className="text-white text-sm">%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-300">Moneda</p>
                <p className="text-white font-semibold">Bs.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800/30 border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-3 text-xs md:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-300 bg-blue-500/10'
                    : 'border-transparent text-slate-400 hover:text-blue-300 hover:border-blue-500/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'calculator' && (
          <LoanCalculator
            onCalculate={handleCalculate}
            defaultParams={loanParams}
            onSave={handleSaveLoan}
          />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard
            summary={summary}
            params={loanParams}
            data={amortizationData}
          />
        )}
        {activeTab === 'table' && (
          <AmortizationTable rows={amortizationData} summary={summary} />
        )}
        {activeTab === 'calendar' && (
          <PaymentCalendar data={amortizationData} moraRate={moraRate} />
        )}
        {activeTab === 'payments' && (
          <PaymentRegister
            data={amortizationData}
            payments={payments}
            onRegisterPayment={handleRegisterPayment}
            monthlyPayment={summary.monthlyPayment}
          />
        )}
        {activeTab === 'simulator' && (
          <EarlyPaymentSimulator
            data={amortizationData}
            params={loanParams}
            summary={summary}
          />
        )}
        {activeTab === 'comparator' && (
          <RateComparator amount={loanParams.amount} />
        )}
        {activeTab === 'history' && (
          <LoanHistory
            loans={savedLoans}
            onLoad={handleLoadLoan}
            onDelete={handleDeleteLoan}
            onUpdate={handleUpdateLoan}
            onDuplicate={handleDuplicateLoan}
            onExport={handleExportLoan}
          />
        )}
        {activeTab === 'commits' && (
          <CommitTimeline />
        )}
        {activeTab === 'plan' && (
          <ProjectPlan />
        )}
        {activeTab === 'financial' && (
          <FinancialDashboard loans={savedLoans} />
        )}
        {activeTab === 'import' && (
          <ExcelImport onImport={handleImportLoans} />
        )}
        {activeTab === 'reports' && (
          <MonthlyReport loans={savedLoans} />
        )}
        {activeTab === 'renegotiation' && currentLoanId && (
          <LoanRenegotiation
            loan={savedLoans.find(l => l.id === currentLoanId) || savedLoans[0]}
            onRenegotiate={handleRenegotiateLoan}
          />
        )}
        {activeTab === 'renegotiation' && !currentLoanId && savedLoans.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔄</div>
            <h3 className="text-xl text-slate-400">No hay préstamos para renegociar</h3>
            <p className="text-slate-500 mt-2">Calcula y guarda un préstamo primero</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/30 border-t border-blue-500/10 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-500">
            Sistema de Préstamos v2.0 — Amortización Francesa — Datos guardados localmente
          </p>
        </div>
      </footer>
    </div>
  );
}

function calculateAmortization(params: LoanParams) {
  const { amount, monthlyRate, term, startDate } = params;
  const rate = monthlyRate / 100;
  
  // Calcular cuota mensual con fórmula de amortización francesa
  const monthlyPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
  const monthlyPaymentRounded = Math.ceil(monthlyPayment); // Redondeo al entero superior
  
  const rows: AmortizationRow[] = [];
  let balance = amount;
  let totalInterest = 0;
  let totalPayment = 0;
  let totalRoundedPayment = 0;
  let accumulatedDifference = 0;

  // Generar solo las cuotas reales (1 a term)
  for (let i = 1; i <= term; i++) {
    // Calcular interés sobre el saldo actual
    const interest = Math.round(balance * rate * 100) / 100;
    
    // En la última cuota, ajustar el capital para que el saldo final sea exactamente 0
    let capital: number;
    let payment: number;
    let roundedPayment: number;
    
    if (i === term) {
      // Última cuota: el capital es igual al saldo restante
      capital = Math.round(balance * 100) / 100;
      payment = Math.round((capital + interest) * 100) / 100;
      // Ajustar cuota redondeada para compensar diferencia acumulada
      roundedPayment = Math.round((payment - accumulatedDifference) * 100) / 100;
    } else {
      // Cuotas normales
      capital = Math.round((monthlyPayment - interest) * 100) / 100;
      payment = Math.round(monthlyPayment * 100) / 100;
      roundedPayment = monthlyPaymentRounded;
    }
    
    // Calcular diferencia por redondeo
    const difference = Math.round((roundedPayment - payment) * 100) / 100;
    accumulatedDifference += difference;
    accumulatedDifference = Math.round(accumulatedDifference * 100) / 100;
    
    // Calcular nuevo saldo
    const newBalance = Math.round((balance - capital) * 100) / 100;
    
    // Calcular fecha de pago
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    // Acumular totales
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
