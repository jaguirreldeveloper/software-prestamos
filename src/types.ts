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
}

export interface LoanSummary {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}
