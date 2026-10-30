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
import { LoanParams, AmortizationRow, SavedLoan, PaymentRecord } from './types';
import { Calculator, LayoutDashboard, Table, Calendar, CreditCard, Zap, FolderOpen, Scale, GitBranch, FileText } from 'lucide-react';

function App() {
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
    totalPayment: 0,
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

  const handleCalculate = (params: LoanParams) => {
    setLoanParams(params);
    const data = calculateAmortization(params);
    setAmortizationData(data.rows);
    setSummary({
      monthlyPayment: data.monthlyPayment,
      totalPayment: data.totalPayment,
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
    setSummary(loan.summary);
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
    { id: 'table', label: 'Tabla', icon: Table },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'simulator', label: 'Pago Anticipado', icon: Zap },
    { id: 'comparator', label: 'Comparador', icon: Scale },
    { id: 'history', label: 'Historial', icon: FolderOpen },
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
  
  const monthlyPayment = amount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - amount;

  const rows: AmortizationRow[] = [];
  let balance = amount;

  for (let i = 0; i <= term; i++) {
    const interest = balance * rate;
    const capital = monthlyPayment - interest;
    const newBalance = balance - capital;
    
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    rows.push({
      number: i,
      initialBalance: i === 0 ? amount : balance,
      payment: i === 0 ? 0 : monthlyPayment,
      interest: interest,
      capital: i === 0 ? -interest : capital,
      finalBalance: i === 0 ? amount : (i === term ? 0 : newBalance),
      paymentDate: paymentDate.toISOString().split('T')[0],
      isPaid: false,
    });

    balance = newBalance;
  }

  return { monthlyPayment, totalPayment, totalInterest, rows };
}

export default App;
