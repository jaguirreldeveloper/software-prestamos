export interface LoanParams {
  amount: number;
  monthlyRate: number;
  term: number;
  startDate: string;
}

export interface AmortizationRow {
  number: number;
  initialBalance: number;
  payment: number;
  interest: number;
  capital: number;
  finalBalance: number;
  paymentDate: string;
  isPaid?: boolean;
  paidDate?: string;
  paidAmount?: number;
  extraPayment?: number;
  mora?: number;
}

export interface LoanSummary {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface PaymentRecord {
  loanId: string;
  quotaNumber: number;
  paidDate: string;
  amount: number;
  extraAmount: number;
  notes: string;
}

export interface SavedLoan {
  id: string;
  name: string;
  clientName: string;
  params: LoanParams;
  summary: LoanSummary;
  createdAt: string;
  updatedAt?: string;
  payments: PaymentRecord[];
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export interface RateComparison {
  label: string;
  rate: number;
  term: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}
