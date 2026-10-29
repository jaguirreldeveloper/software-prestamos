import { useState } from 'react';
import LoanCalculator from './components/LoanCalculator';
import Dashboard from './components/Dashboard';
import AmortizationTable from './components/AmortizationTable';
import PaymentCalendar from './components/PaymentCalendar';
import { LoanParams, AmortizationRow } from './types';
import { Calculator, LayoutDashboard, Table, Calendar } from 'lucide-react';

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

  const tabs = [
    { id: 'calculator', label: 'Calculadora', icon: Calculator },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'table', label: 'Tabla Amortización', icon: Table },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
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
                <p className="text-xs text-blue-300">Calculadora de Amortización</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-300">Moneda</p>
              <p className="text-white font-semibold">Bs. (Bolivianos)</p>
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
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-300 bg-blue-500/10'
                    : 'border-transparent text-slate-400 hover:text-blue-300 hover:border-blue-500/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
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
          <AmortizationTable data={amortizationData} summary={summary} />
        )}
        {activeTab === 'calendar' && (
          <PaymentCalendar data={amortizationData} />
        )}
      </main>
    </div>
  );
}

function calculateAmortization(params: LoanParams) {
  const { amount, monthlyRate, term, startDate } = params;
  const rate = monthlyRate / 100;
  
  // French amortization formula
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
    });

    balance = newBalance;
  }

  return { monthlyPayment, totalPayment, totalInterest, rows };
}

export default App;
